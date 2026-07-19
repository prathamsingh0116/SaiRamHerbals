const Product = require("../models/Product");
const Wishlist = require("../models/Wishlist");


// ======================================
// Show Product (Website)
// ======================================

module.exports.showProduct = async (req, res) => {

    try {


        const { slug } = req.params;

        const product = await Product.findOne({

            slug,
            isActive: true

        }).populate({

    path:"reviews",

    populate:{

        path:"user"

    }

}).lean();



const reviews = product.reviews || [];

const reviewCount = reviews.length;

let averageRating = 0;

if (reviewCount > 0) {

    const totalRating = reviews.reduce((sum, review) => {

        return sum + review.rating;

    }, 0);

    averageRating = (totalRating / reviewCount).toFixed(1);

}

        if (!product) {

            req.flash("error", "Product not found.");

            return res.redirect("/");

        }

        const relatedProducts = await Product.find({

            category: product.category,

            _id: { $ne: product._id },

            isActive: true

        })
        .limit(4)
        .lean();

        let wishlistIds = [];

if (req.user) {

    const wishlist = await Wishlist.find({

        user: req.user._id

    }).select("product");

    wishlistIds = wishlist.map(item => item.product.toString());

}
        res.render("website/home/product/show", {

            title: product.name,

            pageCSS: "product",

            pageJS: "product",

            product,

            relatedProducts,
            
            wishlistIds,
            
            averageRating,
            
            reviewCount

        });

    } catch (err) {

        console.error(err);

        req.flash("error", "Unable to load product.");

        res.redirect("/");

    }

};
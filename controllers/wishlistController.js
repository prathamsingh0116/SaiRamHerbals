const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// ======================================
// Wishlist Page
// ======================================

module.exports.index = async (req, res) => {

    try {

        const wishlist = await Wishlist.find({

            user: req.user._id

        })

        .populate("product")

        .lean();

     
        res.render("wishlist/index", {

            title: "My Wishlist",

            pageCSS: "wishlist",

            pageJS: "wishlist",

            wishlist,
           

        });

    } catch (err) {

        console.error(err);

        req.flash(

            "error",

            "Unable to load wishlist."

        );

        res.redirect("/");

    }

};

// ======================================
// Remove Wishlist
// ======================================

module.exports.remove = async (req, res) => {

    try {

        const { slug } = req.params;

        const product = await Product.findOne({

            slug

        });

        if (!product) {

            req.flash(
                "error",
                "Product not found."
            );

            return res.redirect(req.get("Referer") || "/");

        }

        const exists = await Wishlist.findOne({

            user: req.user._id,

            product: product._id

        });


            await Wishlist.findByIdAndDelete(

                exists._id

            );

            req.flash(

                "success",

                "Removed from wishlist."

            );

        return res.redirect("/wishlist");

    } catch (err) {

        console.error(err);

        req.flash(
            "error",
            "Unable to remove product."
        );

        return res.redirect("/wishlist");

    }

};


module.exports.toggle = async (req, res) => {

    try {

        const { slug } = req.params;

        const product = await Product.findOne({

            slug

        });

        if (!product) {

            req.flash(
                "error",
                "Product not found."
            );

            return res.redirect(req.get("Referer") || "/");

        }

        const exists = await Wishlist.findOne({

            user: req.user._id,

            product: product._id

        });

        if (exists) {

            await Wishlist.findByIdAndDelete(

                exists._id

            );

            req.flash(

                "success",

                "Removed from wishlist."

            );

        } else {

            await Wishlist.create({

                user: req.user._id,

                product: product._id

            });

            req.flash(

                "success",

                "Added to wishlist."

            );

        }

        return res.redirect(

            req.get("Referer") || "/"

        );

    } catch (err) {

        console.error(err);

        req.flash(

            "error",

            "Unable to update wishlist."

        );

        return res.redirect(

            req.get("Referer") || "/"

        );

    }

};
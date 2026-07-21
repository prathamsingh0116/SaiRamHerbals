const Product = require("../models/Product");
const Announcement = require("../models/Announcement");
const Wishlist = require("../models/Wishlist");

// ======================================
// Home Page
// ======================================

module.exports.home = async (req, res) => {

    try {

        const featuredProducts = await Product.find({

            isActive: true,

            isFeatured: true

        })
        .sort({ createdAt: -1 })
        .limit(8)
        .lean();
const categories = await Product.aggregate([

    {
        $match: {
            isActive: true
        }
    },

    {
        $sort: {
            createdAt: -1
        }
    },

    {
        $group: {

            _id: "$category",

            totalProducts: {
                $sum: 1
            },

            image: {
                $first: "$images"
            }

        }

    },

    {
        $sort: {
            _id: 1
        }
    }

]);

let wishlistIds = [];

if (req.user) {

    const wishlist = await Wishlist.find({

        user: req.user._id

    }).select("product");

    wishlistIds = wishlist.map(item => item.product.toString());

}



        res.render("home/index", {

            title: "SaiRam Herbals",

            pageCSS: "home",

            pageJS: false,
            currentPage:"home",

            featuredProducts,
            categories,
            wishlistIds,
            featuredProducts


        });

    } catch (err) {

        console.error(err);

        req.flash("error", "Unable to load homepage.");

        res.redirect("/");

    }

};

// module.exports.product = async (req, res) => {
//     const products = await Product.find({

//     isActive: true

// }).lean();

//  const featuredProducts = await Product.find({

//             isActive: true,

//             isFeatured: true

//         })
//         .sort({ createdAt: -1 })
//         .limit(8)
//         .lean();

// const categories = await Product.aggregate([

//     {
//         $match: {
//             isActive: true
//         }
//     },

//     {
//         $sort: {
//             createdAt: -1
//         }
//     },

//     {
//         $group: {

//             _id: "$category",

//             totalProducts: {
//                 $sum: 1
//             },

//             image: {
//                 $first: "$images"
//             }

//         }

//     },

//     {
//         $sort: {
//             _id: 1
//         }
//     }

// ]);

// try {

//         const { category } = req.query;

//         let filter = {};

//         if (category) {

//             filter.category = category;

//         }

//         const categoryproducts = await Product.find(filter);


// res.render("website/product/index",{

//     title:"Products",

//     pageCSS:"product/index",

//     pageJS:false,

//     products,
//     featuredProducts,
//     categories,
//     categoryproducts,
//     selectedCategory: category || "All"

// });

// } catch (err) {

//         console.log(err);

//         req.flash("error", "Unable to load products.");

//         res.redirect("/");

//     }
// };

// module.exports.product = async (req, res) => {

//     try {

//         const { category } = req.query;

//         let filter = {};

//         if (category) {

//             filter.category = category;

//         }

//         const categories = await Product.aggregate([

//     {
//         $match: {
//             isActive: true
//         }
//     },

//     {
//         $sort: {
//             createdAt: -1
//         }
//     },

//     {
//         $group: {

//             _id: "$category",

//             totalProducts: {
//                 $sum: 1
//             },

//             image: {
//                 $first: "$images"
//             }

//         }

//     },

//     {
//         $sort: {
//             _id: 1
//         }
//     }

// ]);

// const page = parseInt(req.query.page) || 1;

// const limit = 5;

// const totalProducts = await Product.countDocuments(filter);

// const totalPages = Math.ceil(totalProducts / limit);

// const productPage = await Product.find(req.query)
//     .skip((page - 1) * limit)
//     .limit(limit);

//         res.render("website/product/index", {

//             products,
//             productPage,
//             totalPages,
//             currentPage: page,
//             pageCSS: "product/products",
//             category,
//             categories,
//             selectedCategory: category || null

//         });

//     } catch (err) {

//         console.log(err);

//         req.flash("error", "Unable to load products.");

//         res.redirect("/");

//     }

// };

module.exports.product = async (req, res) => {

    try {

        const { category } = req.query;

        const page = parseInt(req.query.page) || 1;

        const limit = 5;

        const filter = {

            isActive: true

        };

        if (category) {

            filter.category = category;

        }

        const totalProducts = await Product.countDocuments(filter);

        const totalPages = Math.ceil(totalProducts / limit);

        const products = await Product.find(filter)

            .sort({ createdAt: -1 })

            .skip((page - 1) * limit)

            .limit(limit);

        const categories = await Product.aggregate([

            {

                $match: {

                    isActive: true

                }

            },

            {

                $sort: {

                    createdAt: -1

                }

            },

            {

                $group: {

                    _id: "$category",

                    totalProducts: {

                        $sum: 1

                    },

                    image: {

                        $first: "$images"

                    }

                }

            },

            {

                $sort: {

                    _id: 1

                }

            }

        ]);

        res.render("website/product/index", {

            products,

            currentPage: page,

            totalPages,

            pageCSS: "product/products",

            category,

            categories,

            selectedCategory: category || null

        });

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to load products.");

        res.redirect("/");

    }

};

module.exports.about = async (req, res) => {
    res.render("about/index",{
        title:"About Us",

    pageCSS:"about",

    pageJS:false,
    })
};


module.exports.contactUs = async (req, res) => {
    res.render("contact/index",{
        title:"Contact Us",

    pageCSS:"contactUs",

    pageJS:false,
    })
};
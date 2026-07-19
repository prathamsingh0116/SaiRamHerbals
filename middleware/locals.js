const Wishlist = require("../models/Wishlist");
const Cart = require("../models/Cart");

module.exports = async (req, res, next) => {

    try {

        // ===============================
        // Logged In User
        // ===============================

        res.locals.currentUser = req.user || null;

        res.locals.appliedCoupon = req.session.coupon || null;

// ===============================
// Cart Count
// ===============================

res.locals.cartCount = 0;

if (req.user) {

    const cart = await Cart.findOne({

        user: req.user._id

    });

    if (cart) {

        res.locals.cartCount = cart.items.reduce(

            (total, item) => total + item.quantity,

            0

        );

    }

}

        // ===============================
        // Wishlist Count
        // ===============================
        res.locals.wishlistCount = 20;

        if (req.user) {

            res.locals.wishlistCount =
                await Wishlist.countDocuments({

                    user: req.user._id

                });

        }

// ===============================
// Wishlist
// ===============================

res.locals.wishlistCount = 0;
res.locals.wishlistIds = [];

if (req.user) {

    res.locals.wishlistCount = await Wishlist.countDocuments({

        user: req.user._id

    });

    const wishlist = await Wishlist.find({

        user: req.user._id

    }).select("product");

    res.locals.wishlistIds = wishlist.map(item =>
        item.product.toString()
    );

}


        next();

    } catch (err) {

        console.error("Locals Middleware Error:", err);

        next();

    }

};

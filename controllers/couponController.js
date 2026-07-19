const Coupon = require("../models/Coupon");
const Cart = require("../models/Cart");

module.exports.applyCoupon = async (req, res) => {

    try {

        const { code } = req.body;

        if (!code) {

            req.flash("error", "Please enter coupon code.");

            return res.redirect("/cart");

        }

        const coupon = await Coupon.findOne({

            code: code.toUpperCase().trim()

        });

        if (!coupon) {

            req.flash("error", "Invalid coupon code.");

            return res.redirect("/cart");

        }

        if (!coupon.isActive) {

            req.flash("error", "Coupon is inactive.");

            return res.redirect("/cart");

        }

        if (coupon.expiryDate < new Date()) {

            req.flash("error", "Coupon has expired.");

            return res.redirect("/cart");

        }

        const cart = await Cart.findOne({

            user: req.user._id

        }).populate("items.product");

        if (!cart) {

            req.flash("error", "Cart is empty.");

            return res.redirect("/cart");

        }

        let subtotal = 0;

        cart.items.forEach(item => {

            subtotal += item.product.price * item.quantity;
            // ==========================


        });

        if (subtotal < coupon.minimumOrder) {

            req.flash(

                "error",

                `Minimum order should be ₹${coupon.minimumOrder}`

            );

            return res.redirect("/cart");

        }

     

        if (coupon.discountType === "percentage") {

            discount =

                subtotal * coupon.discountValue / 100;

        } else {

            discount = coupon.discountValue;

        }

        if (

            coupon.maximumDiscount > 0

        ) {

            discount = Math.min(

                discount,

                coupon.maximumDiscount

            );

        }

        const finalAmount = subtotal  - discount;

        req.session.coupon = {

            id: coupon._id,

            code: coupon.code,

            discount,

            subtotal,

            finalAmount

        };

        req.flash("success", "Coupon applied successfully.");

        res.redirect("/cart");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to apply coupon.");

        res.redirect("/cart");

    }

};

module.exports.removeCoupon = (req, res) => {

    delete req.session.coupon;

    req.flash("success", "Coupon removed.");

    res.redirect("/cart");

};
const Cart = require("../models/Cart");
const Address = require("../models/Address");

module.exports.checkoutPage = async (req, res) => {

    try {

        const cartData = await Cart.findOne({

            user: req.user._id

        }).populate("items.product");


        const addresses = await Address.find({

            user: req.user._id

        });

        if (!cartData || cartData.items.length === 0) {

            req.flash("error", "Your cart is empty.");

            return res.redirect("/cart");

        }
        const cart = cartData.items;
// ==========================
// Order Calculation
// ==========================

let subtotal = 0;
let productSavings = 0;

cart.forEach(item => {

    const product = item.product;

    const originalPrice = product.price;

    const finalPrice =

        originalPrice -

        (originalPrice * (product.discount || 0)) / 100;

    subtotal += finalPrice * item.quantity;

    productSavings +=

        (originalPrice - finalPrice) * item.quantity;

});

// ==========================
// Coupon
// ==========================

let couponDiscount = 0;

if(req.session.coupon){

    couponDiscount = Number(req.session.coupon.discount) || 0;

}

// ==========================
// Shipping
// ==========================

let shippingCharge = subtotal >= 500 ? 0 : 25;

let shippingSaving = subtotal >= 500 ? 25 : 0;

// ==========================
// Summary
// ==========================

const totalSavings =

Number(productSavings) +

Number(couponDiscount) +

Number(shippingSaving);

const grandTotal =

subtotal -

couponDiscount +

shippingCharge;

shippingSaving += couponDiscount
        
    const selectedAddress = req.session.selectedAddress || null;

// Session clear after reading
delete req.session.selectedAddress;

res.render("checkout/index",{

    title:"Checkout",

    pageCSS:"checkout",

    cart,

    addresses,

    subtotal,

    couponDiscount,

    shippingCharge,

    shippingSaving,

    totalSavings,

    grandTotal,

    appliedCoupon:req.session.coupon || null,

    selectedAddress,
    razorpayKey:

process.env.RAZORPAY_KEY_ID

});


    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to load checkout.");

        res.redirect("/cart");

    }

};
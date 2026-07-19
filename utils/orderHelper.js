const Cart = require("../models/Cart");

module.exports.prepareOrder = async (req) => {

    const cart = await Cart.findOne({
        user: req.user._id
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
        throw new Error("Your cart is empty.");
    }

    let subtotal = 0;
    let productSavings = 0;

    cart.items.forEach(item => {

        const product = item.product;

        const finalPrice =
            product.price -
            (product.price * (product.discount || 0)) / 100;

        subtotal += finalPrice * item.quantity;

        productSavings +=
            (product.price - finalPrice) * item.quantity;

    });

    let couponDiscount = 0;

    if (req.session.coupon) {
        couponDiscount = Number(req.session.coupon.discount) || 0;
    }

    let shippingCharge = subtotal >= 500 ? 0 : 25;

    let shippingSaving = subtotal >= 500 ? 25 : 0;

    let totalSavings =
        productSavings +
        couponDiscount +
        shippingSaving;

    const orderItems = cart.items.map(item => ({

        product: item.product._id,

        name: item.product.name,

        image: item.product.images[0]?.url || "",

        price: item.product.price,

        quantity: item.quantity

    }));

    return {

        cart,

        orderItems,

        subtotal,

        couponDiscount,

        shippingCharge,

        totalSavings

    };

};
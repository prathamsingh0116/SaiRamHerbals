const Product = require("../models/Product");
const Cart = require("../models/Cart");





// ======================================
// Cart Page
// ======================================

module.exports.cartPage = async (req, res) => {

    try {

        const cartData = await Cart.findOne({

            user: req.user._id

        }).populate("items.product");

        const cart = cartData ? cartData.items : [];

        let subtotal = 0;

        let productSavings = 0;

        // ==========================
        // Product Total
        // ==========================

        cart.forEach(item => {

            const product = item.product;

            const finalPrice =

                product.price -

                (product.price * product.discount) / 100;

            subtotal += finalPrice * item.quantity;

            productSavings +=

                (product.price - finalPrice) *

                item.quantity;

        });

        // ==========================
        // Coupon Discount
        // ==========================

        let couponDiscount = 0;

        if (req.session.coupon) {

            couponDiscount = req.session.coupon.discount;

        }

        // ==========================
        // Shipping
        // ==========================

        let shippingCharge = 25;

        let shippingSaving = 0;

        if (subtotal >= 500) {

            shippingCharge = 0;

            shippingSaving = 25;

        }

        // ==========================
        // Total Savings
        // ==========================

        const totalSavings =

            productSavings +

            couponDiscount +

            shippingSaving;

        // ==========================
        // Grand Total
        // ==========================

        const grandTotal =

            subtotal -

            couponDiscount +

            shippingCharge;

        res.render("cart/index", {

            title: "Shopping Cart",

            pageCSS: "cart",

            pageJS: "cart",

            cart,

            subtotal,

            productSavings,

            couponDiscount,

            shippingCharge,

            shippingSaving,

            totalSavings,

            grandTotal,

            appliedCoupon: req.session.coupon || null

        });

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to load cart.");

        return res.redirect("/products");

    }

};

// ======================================
// Add To Cart
// ======================================

module.exports.addToCart = async (req, res) => {




    try {

        const { slug } = req.params;

        const qty = Number(req.body.quantity) || 1;

        const product = await Product.findOne({

            slug,

            isActive: true

        }).lean();

        if (!product) {

            req.flash("error", "Product not found.");

            return res.redirect("back");

        }

        let cart = await Cart.findOne({

    user: req.session.userId

});



if (!cart) {

    cart = new Cart({

        user: req.user._id,

        items: []

    });

}

if (!cart.items) {
    cart.items = [];
}


        const existingItem = cart.items.find(

item =>

item.product.toString() === product._id.toString()

);

        if (existingItem) {

            existingItem.quantity += qty;

        } else {
            cart.items.push({

product: product._id,

quantity: qty

});

        }

        await cart.save();

        req.flash("success", "Product added to cart.");

        return res.redirect(req.get("Referer") || "/");

    } catch (err) {

        console.error(err);

        req.flash("error", "Unable to add product.");

        return res.redirect(req.get("Referer") || "/");

    }

};

// ======================================
// Increase Quantity
// ======================================

module.exports.increaseQuantity = async (req, res) => {

    try {

        const { id } = req.params;

        const cart = await Cart.findOne({

            user: req.user._id

        });

        if (!cart) {

            req.flash("error", "Cart not found.");

            return res.redirect("/cart");

        }

        const item = cart.items.find(

            item => item.product.toString() === id

        );

        if (item) {

            item.quantity++;

            await cart.save();

        }

        return res.redirect(req.get("Referer") || "/cart");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to update cart.");

        return res.redirect("/cart");

    }

};

// ======================================
// Decrease Quantity
// ======================================

module.exports.decreaseQuantity = async (req, res) => {

    try {

        const { id } = req.params;

        const cart = await Cart.findOne({

            user: req.user._id

        });

        if (!cart) {

            return res.redirect("/cart");

        }

        const item = cart.items.find(

            item => item.product.toString() === id

        );

        if (item && item.quantity > 1) {

            item.quantity--;

            await cart.save();

        }

        return res.redirect(req.get("Referer") || "/cart");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to update cart.");

        return res.redirect("/cart");

    }

};
// ======================================
// Remove Item
// ======================================

module.exports.removeItem = async (req, res) => {

    try {

        const { id } = req.params;

        const cart = await Cart.findOne({

            user: req.user._id

        });

        if (!cart) {

            return res.redirect("/cart");

        }

        cart.items = cart.items.filter(

            item => item.product.toString() !== id

        );

        await cart.save();

        req.flash("success", "Item removed from cart.");

        return res.redirect("/cart");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to remove item.");

        return res.redirect("/cart");

    }

};

// ======================================
// Buy Now
// ======================================

module.exports.buyNow = async (req, res) => {

    try {

        const { id } = req.params;

        // Product Check
        const product = await Product.findById(id);

        if (!product || !product.isActive) {

            req.flash("error", "Product not found.");

            return res.redirect("/products");

        }

        // Find User Cart
        let cart = await Cart.findOne({

            user: req.user._id

        });

        // Create Cart
        if (!cart) {

            cart = new Cart({

                user: req.user._id,

                items: []

            });

        }

        // Already Exists?
        const existingItem = cart.items.find(

            item => item.product.toString() === id

        );

        // Add only if not exists
        if (!existingItem) {

            cart.items.push({

                product: product._id,

                quantity: 1

            });

            await cart.save();

        }

        // Redirect Checkout
        return res.redirect("/cart");

    }

    catch (err) {

        console.log(err);

        req.flash("error", "Unable to process Buy Now.");

        return res.redirect(req.get("Referer") || "/");

    }

};
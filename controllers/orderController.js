const { prepareOrder } = require("../utils/orderHelper");

const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Address = require("../models/Address");

module.exports.placeOrder = async (req, res) => {

    try {

        const { address, paymentMethod } = req.body;
        // ==========================
        // Validate Address
        // ==========================

        if (!address) {

            req.flash("error", "Please select a delivery address.");

            return res.redirect("/checkout");

        }

        const selectedAddress = await Address.findOne({

            _id: address,

            user: req.user._id

        });

        if (!selectedAddress) {

            req.flash("error", "Invalid delivery address.");

            return res.redirect("/checkout");

        }

        const {

    cart,

    orderItems,

    subtotal,

    couponDiscount,

    shippingCharge,

    totalSavings

} = await prepareOrder(req);

let grandTotal =
    subtotal -
    couponDiscount +
    shippingCharge;

    if (paymentMethod === "COD") {

    grandTotal += 50;

}

        // ==========================
        // Save Order
        // ==========================

        const order = new Order({

            user: req.user._id,

            address,

            items: orderItems,

            subtotal,

            couponDiscount,

            shippingCharge,

            totalSavings,

            grandTotal,

            paymentMethod,
            codCharge:

paymentMethod === "COD"

? 50

: 0,
paidAmount:

paymentMethod === "COD"

? 0

: grandTotal,
            statusHistory:{

        placedAt:new Date()

    },

          paymentStatus: "UNPAID",
            isPaymentVerified: false

        });

        await order.save();


        req.flash(

            "success",

            "Order placed successfully."

        );

        res.redirect(

            "/orders/success/" + order._id

        );

    }

    catch (err) {

        console.log(err);

        req.flash(

            "error",

            "Unable to place order."

        );

        res.redirect("/checkout");

    }

};


module.exports.cancelOrder = async (req, res) => {

    const { id } = req.params;
    const { cancelReason } = req.body;

    const order = await Order.findById(id);

    if (!order) {
        req.flash("error", "Order not found.");
        return res.redirect("/orders");
    }

    // Security
    if (!order.user.equals(req.user._id)) {
        req.flash("error", "Unauthorized request.");
        return res.redirect("/orders");
    }

    // Allow only Pending or Confirmed
    if (!["Pending", "Confirmed"].includes(order.orderStatus)) {
        req.flash(
            "error",
            "This order can no longer be cancelled."
        );
        return res.redirect(`/orders/${id}`);
    }

    order.orderStatus = "Cancelled";
    order.cancelReason = cancelReason;
    order.cancelledBy = "USER";
    order.statusHistory.cancelledAt = new Date();

    await order.save();

    req.flash("success", "Order cancelled successfully.");

    res.redirect(`/orders/${id}`);

};

module.exports.successPage = async (req, res) => {

    const order = await Order.findById(

        req.params.id

    );

    if (!order) {

        req.flash("error", "Order not found.");

        return res.redirect("/");

    }

    res.render(

        "orders/success",

        {

            title: "Order Placed",

            pageCSS: "order-success",

            order

        }

    );

};

module.exports.myOrders = async(req,res)=>{

    const orders = await Order.find({

        user:req.user._id

    })
    .sort({createdAt:-1});

    res.render("orders/index",{

        title:"My Orders",

        pageCSS:"orders",

        orders

    });

};

module.exports.orderDetails = async (req, res) => {

    try {

        const order = await Order.findOne({

            _id: req.params.id,

            user: req.user._id

        }).populate("address");

        if (!order) {

            req.flash("error", "Order not found.");

            return res.redirect("/orders");

        }

        res.render("orders/show", {

            title: "Order Details",

            pageCSS: "orderDetails",

            order

        });

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to load order.");

        res.redirect("/orders");

    }

};
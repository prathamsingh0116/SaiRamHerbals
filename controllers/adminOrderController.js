const Order = require("../models/Order");

module.exports.index = async (req, res) => {

    try {

        const orders = await Order.find({})
            .populate("user")
            .sort({ createdAt: -1 });

        const totalOrders = await Order.countDocuments();

        const pendingOrders = await Order.countDocuments({
            orderStatus: "Pending"
        });

        const shippedOrders = await Order.countDocuments({
            orderStatus: "Shipped"
        });

        const deliveredOrders = await Order.countDocuments({
            orderStatus: "Delivered"
        });

        const cancelledOrders = await Order.countDocuments({
            orderStatus: "Cancelled"
        });

        res.render("admin/orders/index", {

            title: "Orders",

            pageCSS: "orders",
            currentPage: "orders",
            productCSS: false,

            orders,

            totalOrders,

            pendingOrders,

            shippedOrders,

            deliveredOrders,

            cancelledOrders

        });

    } catch (err) {

        console.log(err);

        req.flash("error","Unable to load orders");

        res.redirect("/admin");

    }

};

module.exports.show = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id)
            .populate("user")
            .populate("address");

        if (!order) {

            req.flash("error", "Order not found.");

            return res.redirect("/admin/orders");

        }

        res.render("admin/orders/show", {

            title: "Order Details",

            pageCSS: "orderShow",
            currentPage: "Orders",
            productCSS: false,

            order

        });

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to load order.");

        res.redirect("/admin/orders");

    }

};

module.exports.updateStatus = async (req, res) => {

    try {

        const { orderStatus } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {

            req.flash("error", "Order not found.");

            return res.redirect("/admin/orders");

        }

        const current = order.orderStatus;

// Cannot change Delivered
if (current === "Delivered") {

    req.flash("error", "Delivered order cannot be updated.");

    return res.redirect("/admin/orders/" + order._id);

}

// Cannot change Cancelled
if (current === "Cancelled") {

    req.flash("error", "Cancelled order cannot be updated.");

    return res.redirect("/admin/orders/" + order._id);

}

const workflow = {

    Pending: ["Confirmed", "Cancelled"],

    Confirmed: ["Packed", "Cancelled"],

    Packed: ["Shipped"],

    Shipped: ["Delivered","Cancelled"],

    Delivered: [],

    Cancelled: []

};

if (!workflow[current].includes(orderStatus)) {

    req.flash(

        "error",

        `Invalid status transition (${current} → ${orderStatus})`

    );

    return res.redirect("/admin/orders/" + order._id);

}

order.orderStatus = orderStatus;

        switch(orderStatus){

    case "Confirmed":

        if(!order.statusHistory.confirmedAt){

            order.statusHistory.confirmedAt=new Date();

        }

        break;

    case "Packed":

        if(!order.statusHistory.packedAt){

            order.statusHistory.packedAt=new Date();

        }

        break;

    case "Shipped":

        if(!order.statusHistory.shippedAt){

            order.statusHistory.shippedAt=new Date();

        }

        break;

    case "Delivered":

        if(!order.statusHistory.deliveredAt){

            order.statusHistory.deliveredAt=new Date();

        }

        break;

    case "Cancelled":

        if(!order.statusHistory.cancelledAt){

            order.statusHistory.cancelledAt=new Date();

        }

        break;

}

        await order.save();

        req.flash("success", "Order status updated successfully.");

        res.redirect("/admin/orders/" + order._id);

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to update order.");

        res.redirect("/admin/orders");

    }

};

module.exports.markPaid = async(req,res)=>{

const order=await Order.findById(req.params.id);

if(!order){

req.flash("error","Order not found.");

return res.redirect("/admin/orders");

}

if(order.paymentMethod!=="COD"){

req.flash("error","Only COD orders can be marked as paid.");

return res.redirect("/admin/orders");

}

if(order.paymentStatus==="PAID"){

req.flash("error","Already Paid.");

return res.redirect("/admin/orders");

}

order.paymentStatus="PAID";

order.paidAt=new Date();

await order.save();

req.flash("success", "Payment has been marked as paid successfully.");

res.redirect("/admin/orders");

}


module.exports.deleteOrder = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id);

        if (!order) {

            req.flash("error", "Order not found.");

            return res.redirect("/admin/orders");

        }

        if (order.orderStatus !== "Cancelled") {

            req.flash(
                "error",
                "Only cancelled orders can be deleted."
            );

            return res.redirect("/admin/orders");

        }

        await Order.findByIdAndDelete(req.params.id);

        req.flash(
            "success",
            "Order deleted successfully."
        );

        res.redirect("/admin/orders");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to delete order.");

        res.redirect("/admin/orders");

    }

};
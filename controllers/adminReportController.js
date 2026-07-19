const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const Review = require("../models/Review");
const PDFDocument = require("pdfkit");

module.exports.index = async (req, res) => {

    const range = req.query.range || "month";

const start = req.query.start || "";

const end = req.query.end || "";

let startDate;

let endDate = new Date();

switch(range){

    case "today":

startDate = new Date();

startDate.setHours(0,0,0,0);

break;

case "week":

startDate = new Date();

startDate.setDate(startDate.getDate()-7);

break;

case "month":

startDate = new Date(

new Date().getFullYear(),

new Date().getMonth(),

1

);

break;

case "year":

startDate = new Date(

new Date().getFullYear(),

0,

1

);

break;

case "custom":

startDate = new Date(start);

endDate = new Date(end);

endDate.setHours(23,59,59,999);

break;
}

const revenueDateFilter = {

    "statusHistory.deliveredAt":{

        $gte:startDate,

        $lte:endDate

    }

};

// ===============================
// Total Revenue
// ===============================

const revenue = await Order.aggregate([

    {
        $match:{
            orderStatus:"Delivered",
            paymentStatus:"PAID",
            ...revenueDateFilter
        }
    },

    {
        $group:{
            _id:null,
            totalRevenue:{
                $sum:"$grandTotal"
            }
        }
    }

]);

// ======================================
// Today
// ======================================

const today = new Date();
today.setHours(0,0,0,0);

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate()+1);

// Today's Orders

const todaysOrders = await Order.countDocuments({

    createdAt:{
        $gte:today,
        $lt:tomorrow
    }

});

// Today's Revenue

const todayRevenue = await Order.aggregate([

    {
        $match:{
            orderStatus:"Delivered",
            paymentStatus:"PAID",
            "statusHistory.deliveredAt":{
                $gte:today,
                $lt:tomorrow
            }
        }
    },

    {
        $group:{
            _id:null,
            revenue:{
                $sum:"$grandTotal"
            }
        }
    }

]);

const weekRevenue = await Order.aggregate([

    {

        $match:{

            orderStatus:"Delivered",

            paymentStatus:"PAID",

            "statusHistory.deliveredAt":{

                $gte:new Date(Date.now()-7*24*60*60*1000),

                $lte:new Date()

            }

        }

    },

    {

        $group:{

            _id:null,

            revenue:{

                $sum:"$grandTotal"

            }

        }

    }

]);



const yearRevenue = await Order.aggregate([

    {

        $match:{

            orderStatus:"Delivered",

            paymentStatus:"PAID",

            "statusHistory.deliveredAt":{

                $gte:new Date(

                    new Date().getFullYear(),

                    0,

                    1

                ),

                $lte:new Date()

            }

        }

    },

    {

        $group:{

            _id:null,

            revenue:{

                $sum:"$grandTotal"

            }

        }

    }

]);

// ======================================
// This Month
// ======================================

const startMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
);

const thisMonthOrders = await Order.countDocuments({

    createdAt:{
        $gte:startMonth
    }

});

const monthRevenue = await Order.aggregate([

    {
        $match:{
            orderStatus:"Delivered",
            paymentStatus:"PAID",
            "statusHistory.deliveredAt":{
                $gte:startMonth,
                $lte:new Date()
            }
        }
    },

    {
        $group:{
            _id:null,
            revenue:{
                $sum:"$grandTotal"
            }
        }
    }

]);

// ======================================
// Pending COD Amount
// ======================================

const pendingCOD = await Order.aggregate([

    {
        $match:{
            paymentMethod:"COD",
            paymentStatus:"UNPAID"
        }
    },

    {
        $group:{
            _id:null,
            amount:{
                $sum:"$grandTotal"
            }
        }
    }

]);

    // ===============================
    // Statistics
    // ===============================

 const [

    totalOrders,

    totalProducts,

    totalCustomers,

    totalReviews,

    pendingOrders,

    confirmedOrders,

    packedOrders,

    shippedOrders,

    outForDeliveryOrders,

    deliveredOrders,

    cancelledOrders,

    returnRequestedOrders

] = await Promise.all([

    Order.countDocuments(),

    Product.countDocuments(),

    User.countDocuments({ role: "user" }),

    Review.countDocuments(),

    Order.countDocuments({ orderStatus: "Pending" }),

    Order.countDocuments({ orderStatus: "Confirmed" }),

    Order.countDocuments({ orderStatus: "Packed" }),

    Order.countDocuments({ orderStatus: "Shipped" }),

    Order.countDocuments({ orderStatus: "Out For Delivery" }),

    Order.countDocuments({ orderStatus: "Delivered" }),

    Order.countDocuments({ orderStatus: "Cancelled" }),

    Order.countDocuments({ orderStatus: "Return Requested" })

]);

    // ===============================
    // Recent Orders
    // ===============================

    const recentOrders = await Order.find()

        .populate("user")

        .sort({

            createdAt: -1

        })

        .limit(5);

        // =====================================
// Top Selling Products
// =====================================

const topProducts = await Order.aggregate([

    {
        $match:{
    orderStatus:"Delivered",
    paymentStatus:"PAID"
}
    },

    {
        $unwind: "$items"

    },

    {
        $group: {

            _id: "$items.product",

            totalSold: {

                $sum: "$items.quantity"

            },

            revenue: {

                $sum: {

                    $multiply: [

                        "$items.quantity",

                        "$items.price"

                    ]

                }

            }

        }

    },

    {
        $sort: {

            totalSold: -1

        }

    },

    {
        $limit: 5

    },

    {

        $lookup: {

            from: "products",

            localField: "_id",

            foreignField: "_id",

            as: "product"

        }

    },

    {

        $unwind: "$product"

    }

]);

    // ===============================
    // Recent Reviews
    // ===============================

    const recentReviews = await Review.find()

        .populate("user")

        .populate("product")

        .sort({

            createdAt: -1

        })

        .limit(5);

       const revenueChart = await Order.aggregate([

    {
        $match: {
            orderStatus: "Delivered",
            paymentStatus: "PAID"
        }
    },

    {
        $group: {

            _id: {

                month: {
                    $month: "$statusHistory.deliveredAt"
                }

            },

            revenue: {
                $sum: "$grandTotal"
            }

        }

    },

    {
        $sort: {
            "_id.month": 1
        }
    }

]);

const orderChart = await Order.aggregate([

    {

        $group:{

            _id:{

                month:{

                    $month:"$createdAt"

                }

            },

            orders:{

                $sum:1

            }

        }

    },

    {

        $sort:{

            "_id.month":1

        }

    }

]);

    // ===============================
    // Render
    // ===============================

    res.render(

        "admin/reports/index",

        {

            title: "Reports",

            pageCSS: "adminReports",

            pageJS: "adminReports",

            currentPage: "reports",
            productCSS: false,

            totalRevenue:

                revenue.length ?

                revenue[0].totalRevenue :

                0,
                todayRevenue:

todayRevenue.length

?

todayRevenue[0].revenue

:

0,

todaysOrders,

thisMonthOrders,
weekRevenue:

weekRevenue.length

?

weekRevenue[0].revenue

:

0,

yearRevenue:

yearRevenue.length

?

yearRevenue[0].revenue

:

0,

monthRevenue:

monthRevenue.length

?

monthRevenue[0].revenue

:

0,
                
            totalOrders,

    totalProducts,

    totalCustomers,

    totalReviews,

    pendingOrders,

    confirmedOrders,

    packedOrders,

    shippedOrders,

    outForDeliveryOrders,

    deliveredOrders,

    cancelledOrders,

    returnRequestedOrders,
    topProducts,
    processingOrders:0,

pendingCOD:
pendingCOD.length
?
pendingCOD[0].amount
:
0,

            recentOrders,

            recentReviews,
            revenueChart,

orderChart,
range,

    start,

    end,

        }

    );

};

module.exports.exportPDF = async (req, res) => {

    const orders = await Order.find()

        .populate("user")
        .sort({ createdAt: -1 });

    const doc = new PDFDocument({

        margin: 40,

        size: "A4"

    });

    const fileName = `Sales_Report_${Date.now()}.pdf`;

    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
    );

    res.setHeader(
        "Content-Type",
        "application/pdf"
    );

    doc.pipe(res);

    // Heading

    doc

        .fontSize(22)

        .fillColor("#16a34a")

        .text("SaiRam Herbals", {

            align: "center"

        });

    doc.moveDown();

    doc

        .fontSize(16)

        .fillColor("black")

        .text("Sales Report", {

            align: "center"

        });

    doc.moveDown();

    doc.fontSize(11);

    doc.text(`Generated : ${new Date().toLocaleString()}`);

    doc.moveDown(2);

    doc.fontSize(13);

    doc.text("Recent Orders");

    doc.moveDown();

    orders.forEach((order,index)=>{

        doc

        .fontSize(10)

        .text(

`${index+1}. ${order.user?.fullName || "User"}

Status : ${order.orderStatus}

Amount : ₹${order.grandTotal}

Date : ${order.createdAt.toDateString()}

`
        );

    });

    doc.end();

};


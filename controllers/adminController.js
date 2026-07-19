const Product = require("../models/Product");
const User = require("../models/User");
const Announcement = require("../models/Announcement");

module.exports.dashboard = async (req, res) => {

    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalAnnouncements = await Announcement.countDocuments();

    // Latest 5 Products
    const recentProducts = await Product.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    // Low Stock Products
    const lowStockProducts = await Product.find({
        stock: { $lte: 10 }
    })
    .sort({ stock: 1 })
    .limit(5)
    .lean();

    res.render("admin/dashboard/index",{

        layout:"layouts/admin",

        title:"Dashboard",

        currentPage:"dashboard",


        pageCSS:"dashboard",
        productCSS:false,

        totalProducts,
        totalUsers,
        totalAnnouncements,

        recentProducts,
        lowStockProducts

    });

};
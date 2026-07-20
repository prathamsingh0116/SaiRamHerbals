require("dotenv").config();

console.log("=== APP START ===");
console.log("Node:", process.version);
console.log("MONGO_URI:", process.env.MONGO_URI ? "FOUND" : "MISSING");
console.log("SECRET:", process.env.SECRET ? "FOUND" : "MISSING");


// Core
const express = require("express");
const path = require("path");
const app = express();
const passport = require("./config/passport");

// Third Party
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const errorHandler = require("./middleware/errorHandler");
const localsMiddleware = require("./middleware/locals");

// Local
const connectDB = require("./config/db");

const {
    isLoggedin,
    isAdmin,
    loadAnnouncements
} = require("./middleware");

// Routes
const authRoutes = require("./routes/auth");

const announcementRoutes = require("./routes/announcement");
const adminDashboardRoutes = require("./routes/adminRoutes/dashboard");
const adminProductRoutes = require("./routes/adminRoutes/products");
const adminUserRoutes = require("./routes/adminRoutes/users");
const websiteProductRoutes = require("./routes/products");
const adminCouponRoutes = require("./routes/adminRoutes/coupons");
const adminOrderRoutes = require("./routes/adminRoutes/orders");
const adminReviewRoutes = require("./routes/adminRoutes/reviews");
const adminReportRoutes = require("./routes/adminRoutes/reports");


const profileRoutes = require("./routes/profile/profile");
const addressRoutes = require("./routes/profile/address");


const websiteRoutes = require("./routes/website");
const cartRoutes = require("./routes/carts");
const wishlistRoutes = require("./routes/wishlist");
const couponRoutes = require("./routes/coupon");
const checkoutRoutes = require("./routes/checkout");
const orderRoutes=require("./routes/order");
const reviewRoutes = require("./routes/reviews");
const legalRoutes = require("./routes/legal");
const contactRoutes = require("./routes/contact");

// Payment Route
const paymentRoutes = require("./routes/payment");


const mongoose = require('mongoose');


app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Connect Database
connectDB();


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.use((req, res, next) => {
    res.locals.title = "Sairam Herbals";
    next();
});

app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret: process.env.SECRET || "sairamherbalssecret",
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    }),

    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}));
app.use(flash());


app.use(passport.initialize());

app.use(passport.session());

app.use(loadAnnouncements);

app.use((req,res,next)=>{

    res.locals.title="SaiRam Herbals";

    res.locals.metaDescription="Premium Ayurvedic Herbal Products";

    res.locals.pageCSS=null;

    res.locals.pageJS=null;

    next();

});
app.use(async (req, res, next) => {

    try{

        const Announcement = require("./models/announcement");

        res.locals.announcements = await Announcement.find({
            isActive: true
        })
        .sort({ priority: 1 })
        .lean();

    }catch(err){

        console.log(err);

        res.locals.announcements = [];

    }

    next();

});

app.use((req, res, next) => {

    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");

    // Loader Trigger
    res.locals.showLoader = req.session.showLoader || false;

    req.session.showLoader = false;

    next();

});

// app.use((req, res, next) => {

//     res.locals.currentUser = null;

//     if (req.session.userId) {

//         res.locals.currentUser = {
//             id: req.session.userId,
//             name: req.session.userName,
//             role: req.session.userRole
//         };

//     }

//     next();

// });

app.use(async (req, res, next) => {

    if (req.session.userId) {

        const User = require("./models/User");

        const currentUser = await User.findById(req.session.userId);

        req.user = currentUser;

        res.locals.currentUser = currentUser;

    } else {

        req.user = null;

        res.locals.currentUser = null;

    }

    next();

});
app.use(localsMiddleware);



// Website IMP Routes
app.use("/", websiteRoutes);
app.use("/products", websiteProductRoutes);
app.use("/cart", cartRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/coupon", couponRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/orders",orderRoutes);
app.use("/products/:id/reviews", reviewRoutes);
app.use("/", legalRoutes);
app.use("/", contactRoutes);
app.use("/payment", paymentRoutes);

// Authentication
app.use("/", authRoutes);

// Admin Routes
app.use("/admin", isLoggedin, isAdmin, adminDashboardRoutes);

app.use("/admin/products", isLoggedin, isAdmin, adminProductRoutes);
app.use("/admin/coupons",isLoggedin, isAdmin, adminCouponRoutes);
app.use("/admin/orders",isLoggedin, isAdmin, adminOrderRoutes);
app.use(
    "/admin/users",
    isLoggedin,
    isAdmin,
    adminUserRoutes
);

app.use(
    "/admin/reviews",
    isLoggedin,
    isAdmin,
    adminReviewRoutes
);

app.use(
    "/admin/reports",
    adminReportRoutes
);


app.use("/admin/announcements", isLoggedin, isAdmin, announcementRoutes);


// Address Route
app.use("/addresses", addressRoutes);

// Profile Route
app.use("/profile", profileRoutes);


// Admin Panel User Routes


app.use((req, res) => {

    res.status(404).render("errors/error", {

        status: 404,

        heading: "Page Not Found",

        message: "The page you're looking for doesn't exist or may have been moved.",

        redirectTo: "/",

        redirectText: "Go Back Home"

    });

});


app.use((err, req, res, next) => {

    console.error(err);

    res.status(err.status || 500).render("errors/error", {

        status: err.status || 500,

        heading: "Something Went Wrong",

        message: err.message || "An unexpected error occurred.",

        redirectTo: "/",

        redirectText: "Return Home"

    });

});
// Error Handler
app.use(errorHandler);


const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on ${PORT}`);
});

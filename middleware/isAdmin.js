// ======================================
// Check Admin Authorization
// ======================================

const isAdmin = (req, res, next) => {

    // User not logged in
    if (!req.session.userId) {

        // Save requested URL
        req.session.redirectUrl = req.originalUrl;

        req.flash(
            "error",
            "Please login to continue."
        );

        return res.redirect("/login");
    }

    // User logged in but not admin
    if (req.session.userRole !== "admin") {

        req.flash(
            "error",
            "You are not authorized to access this page."
        );

        return res.redirect("/");
    }

    // User is admin
    next();
};

module.exports = isAdmin;
const User = require("../models/User");

const isLoggedIn = async (req, res, next) => {

    if (!req.session.userId) {

        req.session.redirectUrl = req.get("Referer") || "/";

        if (req.method === "POST") {

            req.session.pendingRequest = {

                url: req.originalUrl,

                body: req.body

            };

        }

        req.flash("error", "Please login to continue.");

        return res.redirect("/login");

    }

    // Fetch Logged In User
    const user = await User.findById(req.session.userId);

    if (!user) {

        req.session.destroy(() => {});

        req.flash("error", "Please login again.");

        return res.redirect("/login");

    }

    req.user = user;

    res.locals.currentUser = user;

    next();

};

module.exports = isLoggedIn;
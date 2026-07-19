const multer = require("multer");

module.exports = (err, req, res, next) => {

    console.error(err);

    let redirect = req.originalUrl;

    // Edit pages
    if (req.params.id && req.originalUrl.includes("/edit")) {
        redirect = req.originalUrl;
    }

    // New pages
    if (req.originalUrl.includes("/new")) {
        redirect = req.originalUrl;
    }

    // Multer
    if (err instanceof multer.MulterError) {

        if (err.code === "LIMIT_FILE_SIZE") {

            req.flash(
                "error",
                "Image size should not exceed 5 MB."
            );

            return res.redirect(redirect);
        }

        req.flash("error", err.message);

        return res.redirect(redirect);
    }

    // Validation
    if (err.name === "ValidationError") {

        const message = Object.values(err.errors)
            .map(e => e.message)
            .join(", ");

        req.flash("error", message);

        return res.redirect(redirect);
    }

    // Duplicate Key
    if (err.code === 11000) {

        const field = Object.keys(err.keyValue)[0];

        req.flash(
            "error",
            `${field} already exists.`
        );

        return res.redirect(redirect);
    }

    // Invalid ObjectId
    if (err.name === "CastError") {

        req.flash(
            "error",
            "Invalid request."
        );

        return res.redirect(redirect);
    }

    req.flash(
        "error",
        err.message || "Something went wrong."
    );

    return res.redirect(redirect);

};
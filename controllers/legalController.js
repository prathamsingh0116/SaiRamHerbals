// =======================================
// FAQ
// =======================================

module.exports.faq = (req, res) => {

    res.render("website/legal/faq", {
        title: "Frequently Asked Questions"
    });

};

// =======================================
// Shipping Policy
// =======================================

module.exports.shipping = (req, res) => {

    res.render("website/legal/shipping", {
        title: "Shipping Policy"
    });

};

// =======================================
// Privacy Policy
// =======================================

module.exports.privacy = (req, res) => {

    res.render("website/legal/privacy", {
        title: "Privacy Policy"
    });

};

// =======================================
// Refund Policy
// =======================================

module.exports.refund = (req, res) => {

    res.render("website/legal/refund", {
        title: "Refund & Return Policy"
    });

};

// =======================================
// Terms & Conditions
// =======================================

module.exports.terms = (req, res) => {

    res.render("website/legal/terms", {
        title: "Terms & Conditions"
    });

};
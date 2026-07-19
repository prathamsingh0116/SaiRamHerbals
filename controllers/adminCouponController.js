const Coupon = require("../models/Coupon");

// ==============================
// Coupon List
// ==============================

module.exports.index = async (req, res) => {

    try {

        const coupons = await Coupon.find({})
            .sort({ createdAt: -1 });

        res.render("coupon/index", {
            coupons,
            title: "Coupons",
            productCSS: false,
            currentPage: "coupons",
            pageCSS:"coupon",
            pageJS:false,
        });

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to load coupons.");

        res.redirect("/admin");

    }

};

// ==============================
// Render New
// ==============================

module.exports.renderNewForm = async(req, res) => {

    res.render("coupon/new",{
        title:"Coupons",
         currentPage: "New Coupon",
            productCSS:false,
            pageCSS:"coupon",
            pageJS:false,

    });

};

// ==============================
// Create Coupon
// ==============================

module.exports.create = async (req, res) => {

    try {

        req.body.isActive = req.body.isActive === "on";
        const coupon = new Coupon(req.body);

        coupon.createdBy = req.user._id;

        await coupon.save();

        req.flash("success", "Coupon Created Successfully.");

        res.redirect("/admin/coupons");

    } catch (err) {

        console.log(err);

        req.flash("error", err.message);

        res.redirect("/admin/coupons/new");

    }

};

// ==============================
// Render Edit
// ==============================

module.exports.renderEditForm = async (req, res) => {

    const { id } = req.params;

    const coupon = await Coupon.findById(id);

    if (!coupon) {

        req.flash("error", "Coupon not found.");

        return res.redirect("/admin/coupons",{
            coupon
        });

    }

    res.render("coupon/edit", {

        coupon,
         currentPage: "Edit Coupons",
            productCSS:false,
            pageCSS:coupon,
            pageJS:false,


    });

};

// ==============================
// Update
// ==============================

module.exports.update = async (req, res) => {

    try{

        req.body.isActive = req.body.isActive === "on";

        await Coupon.findByIdAndUpdate(

            req.params.id,

            req.body,

            { runValidators:true }

        );

        req.flash("success","Coupon updated successfully.");

        res.redirect("/admin/coupons");

    }catch(err){

        console.log(err);

        req.flash("error","Unable to update coupon.");

        res.redirect("/admin/coupons");

    }

};

// ==============================
// Delete
// ==============================

module.exports.destroy = async (req, res) => {

    const { id } = req.params;

    await Coupon.findByIdAndDelete(id);

    req.flash("success", "Coupon Deleted.");

    res.redirect("/admin/coupons");

};
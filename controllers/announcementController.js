const Announcement = require("../models/Announcement");

// ======================================
// Show All Announcements (Admin)
// ======================================

module.exports.index = async (req, res) => {

    try {

        const announcements = await Announcement
            .find({})
            .sort({ priority: 1, createdAt: -1 })
            .lean();

            

        res.render("admin/announcements", {

            layout: "layouts/admin",

            title: "Announcements",

            pageCSS: false,
            
            productCSS:false,

            currentPage: "announcements",

            announcements

        });

    } catch (err) {

        console.error(err);

        req.flash(
            "error",
            "Unable to load announcements."
        );

        return res.redirect("/admin");

    }

};

// ======================================
// Show New Form
// ======================================

module.exports.renderNewForm = (req, res) => {

    
    res.render("admin/announcements/new", {
    layout: "layouts/admin",
    title: "Edit Announcement",
    pageCSS: "announcement",
    productCSS: false,
    currentPage: "announcements",
})

};


// ======================================
// Create Announcement
// ======================================

module.exports.createAnnouncement = async (req, res) => {
    try {
        const data = {
            ...req.body,
            isActive: req.body.isActive === "on",
        };

        const announcement = new Announcement(data);

        await announcement.save();

        req.flash("success", "Announcement Created Successfully");

        return res.redirect("/admin/announcements");

    } catch (err) {
        console.error(err);

        req.flash("error", "Unable to create announcement.");

        return res.redirect("/admin/announcements/new");
    }
};


// ======================================
// Show Edit Form
// ======================================

module.exports.renderEditForm = async (req, res) => {

    try {

        const { id } = req.params;

        const announcement =
            await Announcement.findById(id);

        if (!announcement) {

            req.flash(
                "error",
                "Announcement Not Found"
            );

            return res.redirect(
                "/admin/announcements"
            );

        }

    res.render("admin/announcements/edit", {
    layout: "layouts/admin",
    title: "Edit Announcement",
    pageCSS: "announcement",
    productCSS: false,
    currentPage: "announcements",
    announcement
});

    } catch (err) {

        console.log(err);

        res.redirect("/admin/announcements");

    }

};


// ======================================
// Update Announcement
// ======================================

module.exports.updateAnnouncement = async (req, res) => {

    try {

        const { id } = req.params;

        const data = {

            ...req.body,

            isActive: req.body.isActive === "on"

        };

        await Announcement.findByIdAndUpdate(
            id,
            data,
            {
                runValidators: true,
                returnDocument: "after"
            }
        );

        req.flash(
            "success",
            "Announcement Updated Successfully"
        );

        res.redirect("/admin/announcements");

    } catch (err) {

        console.log(err);

        req.flash(
            "error",
            "Unable to update announcement."
        );

        res.redirect(`/admin/announcements/${req.params.id}/edit`);

    }

};


// ======================================
// Delete Announcement
// ======================================

module.exports.deleteAnnouncement = async (req, res) => {

    try {

        const { id } = req.params;

        await Announcement.findByIdAndDelete(id);

        req.flash(
            "success",
            "Announcement Deleted Successfully"
        );
        res.redirect("/admin/announcements");

    } catch (err) {

        req.flash(
    "error",
    "Something went wrong."
);

        res.redirect("/admin/announcements");

    }

};


// ======================================
// Active Announcement For Website
// ======================================

module.exports.getActiveAnnouncements = async () => {

    return await Announcement.find({

        isActive: true,

    }).sort({

        priority: 1

    });

};
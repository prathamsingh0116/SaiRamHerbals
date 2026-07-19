const express = require("express");
const router = express.Router();

const announcementController = require("../controllers/announcementController");

// ==========================
// Show All Announcements
// ==========================

router.get(
    "/",
    announcementController.index
);

// ==========================
// New Announcement Form
// ==========================

router.get(
    "/new",
    announcementController.renderNewForm
);

// ==========================
// Create Announcement
// ==========================

router.post(
    "/",
    announcementController.createAnnouncement
);

// ==========================
// Edit Form
// ==========================

router.get(
    "/:id/edit",
    announcementController.renderEditForm
);

// ==========================
// Update Announcement
// ==========================

router.put(
    "/:id",
    announcementController.updateAnnouncement
);

// ==========================
// Delete Announcement
// ==========================

router.delete(
    "/:id",
    announcementController.deleteAnnouncement
);

module.exports = router;
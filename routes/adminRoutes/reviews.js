const express = require("express");

const router = express.Router();

const reviewController = require("../../controllers/adminReviewController");

const { isLoggedin, isAdmin } = require("../../middleware");

// Review List
router.get(
    "/",
    isLoggedin,
    isAdmin,
    reviewController.index
);

// Review Details
router.get(
    "/:id",
    isLoggedin,
    isAdmin,
    reviewController.show
);

// Delete Review
router.delete(
    "/:id",
    isLoggedin,
    isAdmin,
    reviewController.destroy
);

module.exports = router;
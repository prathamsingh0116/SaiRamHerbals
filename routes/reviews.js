const express = require("express");

const router = express.Router({ mergeParams: true });

const reviewController = require("../controllers/reviewController");

const { isLoggedin } = require("../middleware");

// ============================
// Create Review
// ============================

router.post(
    "/",
    isLoggedin,
    reviewController.createReview
);

// ============================
// Edit Review
// ============================

// router.put(
//     "/:reviewId",
//     isLoggedin,
//     reviewController.updateReview
// );

// // ============================
// // Delete Review
// // ============================

router.delete(
    "/:reviewId",
    isLoggedin,
    reviewController.deleteReview
);

module.exports = router;
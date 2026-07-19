const express = require("express");

const router = express.Router();

const legalController = require("../controllers/legalController");

// FAQ
router.get("/faq", legalController.faq);

// Shipping Policy
router.get("/shipping-policy", legalController.shipping);

// Privacy Policy
router.get("/privacy-policy", legalController.privacy);

// Refund Policy
router.get("/refund-policy", legalController.refund);

// Terms & Conditions
router.get("/terms-and-conditions", legalController.terms);

module.exports = router;
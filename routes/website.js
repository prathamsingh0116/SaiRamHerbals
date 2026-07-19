const express = require("express");
const router = express.Router();

const websiteController = require("../controllers/websiteController");

router.get("/", websiteController.home);
router.get("/products", websiteController.product);
router.get("/about/index", websiteController.about);
router.get("/about", websiteController.about);
router.get("/contact", websiteController.contactUs);

module.exports = router;
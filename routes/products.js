const express = require("express");
const router = express.Router();

const websiteProductController = require("../controllers/productController");

router.get("/:slug", websiteProductController.showProduct);

module.exports = router;
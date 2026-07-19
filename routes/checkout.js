const express = require("express");
const router = express.Router();

const checkoutController = require("../controllers/checkoutController");

const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/", isLoggedIn, checkoutController.checkoutPage);

module.exports = router;
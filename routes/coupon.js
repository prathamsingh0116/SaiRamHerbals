const express = require("express");

const router = express.Router();

const couponController = require("../controllers/couponController");

const isLoggedIn = require("../middleware/isLoggedIn");

router.post("/apply", isLoggedIn, couponController.applyCoupon);

router.post("/remove", isLoggedIn, couponController.removeCoupon);

module.exports = router;
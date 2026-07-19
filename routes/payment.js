const express = require("express");

const router = express.Router();

const isLoggedIn = require("../middleware/isLoggedIn");

const paymentController = require("../controllers/paymentController");

router.post(

"/create-order",
isLoggedIn,
paymentController.createOrder

);


router.post(

"/verify",

isLoggedIn,

paymentController.verifyPayment

);

module.exports = router;
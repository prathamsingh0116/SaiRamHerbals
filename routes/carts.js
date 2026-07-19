const express = require("express");
const router = express.Router();
const  isLoggedIn  = require("../middleware/isLoggedIn");

const cartController = require("../controllers/cartController");

router.get("/", cartController.cartPage);


router.post(
    "/add/:slug",
    isLoggedIn,
    cartController.addToCart
);

router.post("/increase/:id", cartController.increaseQuantity);

router.post("/decrease/:id", cartController.decreaseQuantity);

router.post("/remove/:id", cartController.removeItem);

router.post("/buy-now/:id", isLoggedIn, cartController.buyNow);

module.exports = router;
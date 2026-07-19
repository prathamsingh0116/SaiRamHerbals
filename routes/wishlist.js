const express = require("express");
const router = express.Router();

const wishlistController = require("../controllers/wishlistController");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get(
    "/",
    isLoggedIn,
    wishlistController.index
);

router.post(
    "/remove/:slug",
    isLoggedIn,
    wishlistController.remove
);

router.post(
    "/toggle/:slug",
    isLoggedIn,
    wishlistController.toggle
);

module.exports = router;
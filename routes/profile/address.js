const express = require("express");
const router = express.Router();
const addressController = require("../../controllers/addressController");

const  isLoggedIn  = require("../../middleware/isLoggedIn");



router
    .route("/")
    .get(isLoggedIn, addressController.index)
    .post(isLoggedIn ,addressController.create);

router
    .route("/new")
    .get(isLoggedIn, addressController.renderNewForm);

router
    .route("/:id/edit")
    .get(isLoggedIn, addressController.renderEditForm);


router.put(
    "/:id/default",
    isLoggedIn,
    addressController.makeDefault
);

router
    .route("/:id")
    .put(isLoggedIn,addressController.update)
    .delete(isLoggedIn, addressController.destroy);

router.patch(
    "/:id/default",
    isLoggedIn,
    addressController.makeDefault
);

module.exports = router;
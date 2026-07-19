const express = require("express");

const router = express.Router();

const profileController = require("../../controllers/profileController");

const { isLoggedin , wrapAsync } = require("../../middleware");

const uploadProfileImage=require("../../middleware/uploadProfileImage");




// Dashboard
router.get("/", isLoggedin, profileController.index);

// Edit Profile
router.get("/edit", isLoggedin, profileController.renderEditProfile);

router.put(

    "/",

    isLoggedin,

    uploadProfileImage.single("profileImage"),

    profileController.updateProfile

);


// Change password
router.get(
    "/change-password",
    isLoggedin,
    profileController.showChangePassword
);

router.post(
    "/change-password",
    isLoggedin,
    profileController.changePassword
);

module.exports = router;
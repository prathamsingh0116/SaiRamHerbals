const express = require("express");
const router = express.Router();

const { isLoggedin, isAdmin } = require("../../middleware");


const wrapAsync = require("../../utils/wrapAsync");
const adminUserController = require("../../controllers/adminUserController");

// All Users
router.get(
    "/",
    wrapAsync(adminUserController.index)
);

// User Details
router.get(
    "/:id",
    wrapAsync(adminUserController.show)
);


router.put(
"/:id/toggle-block",
isLoggedin,
isAdmin,
adminUserController.toggleBlock
);


// Delete User

router.delete(
    "/:id",
    isLoggedin,
    isAdmin,
    adminUserController.deleteUser
);

module.exports = router;
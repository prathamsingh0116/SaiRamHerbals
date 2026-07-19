const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const authController = require("../controllers/authController");



router.get("/register", authController.renderRegister);
router.post("/register", authController.registerUser);

router.get("/login", authController.renderLogin);
router.post("/login", authController.loginUser);


// ===============================
// Google Authentication
// ===============================

router.get(
    "/auth/google",
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);

router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/login"
    }),
    authController.googleLogin
);

router.get("/logout", authController.logoutUser);

// Forgot Password

router.get("/forgot-password", authController.renderForgotPassword);

router.post("/forgot-password", authController.verifyIdentity);

// Reset Password

router.get("/reset-password/:id", authController.renderResetPassword);

router.post("/reset-password/:id", authController.updatePassword);

module.exports = router;
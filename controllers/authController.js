const User = require("../models/User");
const bcrypt = require("bcrypt");

// Register Page
exports.renderRegister = (req, res) => {
    res.render("auth/register", {
        title: "Register | Sairam Herbals"
    });
};

// Login Page
exports.renderLogin = (req, res) => {
    res.render("auth/login", {
        title: "Login | Sairam Herbals",
        pageJS:"admin",
    });
};

// Register User
exports.registerUser = async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            password,
            confirmPassword
        } = req.body;

        if (password !== confirmPassword) {
            req.flash("error","Passwords do not match");
return res.redirect("/register");
        }

        const emailExists = await User.findOne({ email });

        if (emailExists) {
            req.flash("error","Email already registered");
return res.redirect("/register");
        }

        const phoneExists = await User.findOne({ phone });

        if (phoneExists) {
            req.flash("error","Email already registered");
return res.redirect("/register");
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            fullName,
            email,
            phone,
            password: hashedPassword
        });

        await user.save();
        req.flash("success","Registration Successful");
        res.redirect("/login");

    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
};

// Login User
exports.loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Find User
        const user = await User.findOne({ email });

        if (!user) {
req.flash("error","Invalid Email or Password");
return res.redirect("/login");
        }

        // Check Password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            req.flash("error","Invalid Password");
return res.redirect("/login");
        }

        // Check Blocked User
        if (user.isBlocked) {
           req.flash("error","Your account has been blocked.");
return res.redirect("/login");
        }

        // Create Session
        req.session.userId = user._id;
        req.session.userRole = user.role;
        req.session.userName = user.fullName;
        req.session.showLoader = true;

        const redirectUrl = req.session.redirectUrl || "/";
        const pendingRequest=req.session.pendingRequest;

        // Redirect According to Role
        if (user.role === "admin") {
        req.flash("success","Welcome Back!");
            return res.redirect(redirectUrl);
        }
        
        delete req.session.redirectUrl;
        delete req.session.pendingRequest;
        req.flash("success","Welcome Back!");

            res.redirect(redirectUrl);

    } catch (err) {

        console.log(err);
        res.status(500).send("Server Error");

    }

};


// ======================================
// Google Login Success
// ======================================

exports.googleLogin = async (req, res) => {

    try {

        const user = req.user;

        if (!user) {

            req.flash("error", "Google authentication failed.");

            return res.redirect("/login");

        }

        // Blocked User
        if (user.isBlocked) {

            req.logout(() => {});

            req.flash("error", "Your account has been blocked.");

            return res.redirect("/login");

        }

        // Session
        req.session.userId = user._id;
        req.session.userRole = user.role;
        req.session.userName = user.fullName;
        req.session.showLoader = true;

        user.lastLogin = new Date();

        await user.save();

        // First Google Login → Profile Complete
        if (!user.phone) {

            req.flash(
                "success",
                "Welcome! Please complete your profile."
            );

            return res.redirect("/profile/edit");
        }

        req.flash("success", "Welcome Back!");

        return res.redirect("/");

    }

    catch (err) {

        console.log(err);

        req.flash("error", "Unable to login with Google.");

        return res.redirect("/login");

    }

};


// Logout

exports.logoutUser = (req, res) => {

    req.session.userId = null;
    req.session.userName = null;
    req.session.userRole = null;

    // Show loader on next page
    req.session.showLoader = true;

    req.flash("success", "Logged out successfully.");

    res.redirect("/");
};


// Forgot Password

exports.renderForgotPassword = (req, res) => {

    res.render("auth/forgotPassword", {

        title: "Forgot Password | SaiRam Herbals"

    });

};


exports.verifyIdentity = async (req, res) => {

    try{

        const { email, phone } = req.body;

        const user = await User.findOne({

            email,

            phone

        });

        if(!user){

            req.flash("error","Invalid Email or Mobile Number.");

            return res.redirect("/forgot-password");

        }

        return res.redirect(`/reset-password/${user._id}`);

    }

    catch(err){

        console.log(err);

        req.flash("error","Something went wrong.");

        res.redirect("/forgot-password");

    }

};

exports.renderResetPassword = async (req,res)=>{

    try{

        const { id } = req.params;

        const user = await User.findById(id);

        if (
    !req.session.isPasswordResetVerified ||
    !req.session.resetUserId
) {
    req.flash("error", "Please verify your identity first.");
    return res.redirect("/forgot-password");
}

        if(!user){

            req.flash("error","User not found.");

            return res.redirect("/forgot-password");

        }

        res.render("auth/resetPassword",{

            title:"Reset Password",

            user

        });

    }

    catch(err){

        console.log(err);

        req.flash("error","Invalid request.");

        res.redirect("/forgot-password");

    }

};


exports.updatePassword = async (req,res)=>{

    try{

        const { id } = req.params;

        const {

            password,

            confirmPassword

        } = req.body;

        if(password!==confirmPassword){

            req.flash("error","Passwords do not match.");

            return res.redirect(`/reset-password/${id}`);

        }

        const hashedPassword = await bcrypt.hash(password,12);

        await User.findByIdAndUpdate(id,{

            password:hashedPassword

        });

        delete req.session.resetUserId;
        delete req.session.isPasswordResetVerified;

        req.flash("success","Password Updated Successfully.");

        res.redirect("/login");

    }

    catch(err){

        console.log(err);

        req.flash("error","Unable to reset password.");

        res.redirect("/forgot-password");

    }

};
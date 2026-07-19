const User = require("../models/User");
const Address = require("../models/Address");

const Order = require("../models/Order");
const Wishlist = require("../models/Wishlist");
const Review = require("../models/Review");

const { cloudinary } = require("../config/cloudinary");
const bcrypt = require("bcrypt");

module.exports.index = async (req, res) => {

    try {

        const user = await User.findById(req.session.userId);

        if (!user) {

            req.flash("error", "User not found.");

            return res.redirect("/login");

        }

        const addresses = await Address.find({

            user: req.session.userId

        }).sort({

            isDefault: -1,

            createdAt: -1

        });

        const defaultAddress = addresses.find(

            address => address.isDefault

        );

        // Counts

const orderCount = await Order.countDocuments({

    user: req.session.userId

});

const wishlistCount = await Wishlist.countDocuments({

    user: req.session.userId

});


const reviewCount = await Review.countDocuments({

    user: req.session.userId

});

const recentOrders = await Order.find({

    user: req.session.userId

})

.populate({

    path: "items.product"

})

.sort({

    createdAt: -1

})

.limit(3);

        const profileData = {

            user,

            addresses,

            defaultAddress,

            addressCount: addresses?.length || 0,

            orderCount,

            wishlistCount,

            reviewCount,
            recentOrders

        };

        if (user.role === "admin") {

            return res.render(

                "website/profile/admin/index",

                {

                    title: "Admin Profile",

                    pageCSS: "profile",

                    pageJS: "profile",

                    ...profileData

                }

            );

        }

        res.render(

            "website/profile/user/index",

            {

                title: "My Profile",

                pageCSS: "profile",

                pageJS: "profile",

                ...profileData

            }

        );

    }

    catch (err) {

        console.log(err);

        req.flash("error", "Unable to load profile.");

        res.redirect("/");

    }

};


module.exports.renderEditProfile = async (req, res) => {

    try {

        const user = await User.findById(req.session.userId);

        if (!user) {

            req.flash("error", "User not found.");

            return res.redirect("/profile");

        }

        res.render("website/profile/user/edit", {

            title: "Edit Profile",

            pageCSS: "profile",

            pageJS: "profile",

            user

        });

    }

    catch(err){

        console.log(err);

        req.flash("error","Something went wrong.");

        res.redirect("/profile");

    }

};

module.exports.updateProfile = async (req, res) => {

    try {

        const {

            fullName,

            phone,

            gender,

            dateOfBirth

        } = req.body;

        const updateData = {

    fullName,

    phone,

    gender,

    dateOfBirth

};

if (req.file) {

    const currentUser = await User.findById(req.session.userId);

    // Delete old Cloudinary image
    if (

        currentUser.profileImage &&

        currentUser.profileImage.filename

    ) {

        await cloudinary.uploader.destroy(

            currentUser.profileImage.filename

        );

    }

    updateData.profileImage = {

        url: req.file.path,

        filename: req.file.filename

    };

}
await User.findByIdAndUpdate(

    req.session.userId,

    updateData,

    {

        runValidators:true,

        new:true

    }

);

        req.flash(

            "success",

            "Profile updated successfully."

        );

        res.redirect("/profile");

    }

    catch(err){

        console.log(err);

        req.flash(

            "error",

            "Unable to update profile."

        );

        res.redirect("/profile/edit");

    }

}

module.exports.showChangePassword = (req,res)=>{

    res.render(

        "website/profile/changePassword",

        {

            title:"Change Password",

            pageCSS:false,

            pageJS:"changePass",
            productCSS: false,

        }

    );

};

module.exports.changePassword = async(req,res)=>{

    const {

        currentPassword,

        newPassword,

        confirmPassword

    } = req.body;

    const user = await User.findById(

        req.session.userId

    );

    if(!user){

        req.flash(

            "error",

            "User not found."

        );

        return res.redirect("/login");

    }

    const isMatch = await bcrypt.compare(

        currentPassword,

        user.password

    );

    if(!isMatch){

        req.flash(

            "error",

            "Current password is incorrect."

        );

        return res.redirect("/profile/change-password");

    }

    if(newPassword!==confirmPassword){

        req.flash(

            "error",

            "Passwords do not match."

        );

        return res.redirect("/profile/change-password");

    }

    if(newPassword.length<8){

        req.flash(

            "error",

            "Password must be at least 8 characters."

        );

        return res.redirect("/profile/change-password");

    }

    const samePassword = await bcrypt.compare(

        newPassword,

        user.password

    );

    if(samePassword){

        req.flash(

            "error",

            "New password must be different."

        );

        return res.redirect("/profile/change-password",{
            
        }

        );

    }

    user.password = await bcrypt.hash(

        newPassword,

        12

    );

    await user.save();

    req.flash(

        "success",

        "Password changed successfully."

    );

    res.redirect("/profile");

};

const User = require("../models/User");
const Order = require("../models/Order");
const Review = require("../models/Review");
const Wishlist = require("../models/Wishlist");
const Cart = require("../models/Cart");
const Address = require("../models/Address.js");

// =========================
// All Users
// =========================

module.exports.index = async (req, res) => {

    const users = await User.find({})
        .sort({ createdAt: -1 })
        .lean();

    const stats = {

        total: users.length,

        customers: users.filter(u => u.role === "customer").length,

        admins: users.filter(u => u.role === "admin").length,

        blocked: users.filter(u => u.isBlocked).length

    };

    res.render("admin/users/index", {

        users,

        stats,
        pageCSS: "user",
        currentPage: "users",
        productCSS:false,
        
        
        title: "Users"

    });

};


// =========================
// User Details
// =========================

module.exports.show = async (req, res) => {

    const user = await User.findById(req.params.id);

    if (!user) {

        req.flash("error", "User not found.");

        return res.redirect("/admin/users",{
            title:"Users",
        currentPage:"Users",
        });

    }

    res.render("admin/users/show", {
        title:"Users",
        currentPage:"Users",
        productCSS:false,
        pageCSS:"user",
        user
    });

};

module.exports.toggleBlock = async(req,res)=>{

try{

const user=await User.findById(req.params.id);

if(!user){

req.flash("error","User not found.");

return res.redirect("/admin/users");

}

// Admin cannot block himself
if(user._id.toString()===req.user._id.toString()){

req.flash("error","You cannot block yourself.");

return res.redirect("/admin/users");

}

user.isBlocked=!user.isBlocked;

await user.save();

req.flash(

"success",

`User ${user.isBlocked?"blocked":"unblocked"} successfully.`

);

return res.redirect("/admin/users");

}catch(err){

console.log(err);

req.flash("error","Something went wrong.");

return res.redirect("/admin/users");

}

}

module.exports.deleteUser = async (req, res) => {

    try {

        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {

            req.flash("error", "User not found.");

            return res.redirect("/admin/users");

        }

        // Admin can't delete himself
        if (user._id.toString() === req.user._id.toString()) {

            req.flash("error", "You cannot delete your own account.");

            return res.redirect("/admin/users");

        }

        // Don't delete last admin
        if (user.role === "admin") {

            const totalAdmins = await User.countDocuments({

                role: "admin"

            });

            if (totalAdmins <= 1) {

                req.flash("error", "Last admin cannot be deleted.");

                return res.redirect("/admin/users");

            }

        }

        // Delete Related Data

        await Cart.deleteMany({

            user: user._id

        });

        await Wishlist.deleteMany({

            user: user._id

        });

        await Address.deleteMany({

            user: user._id

        });

        await Review.deleteMany({

            user: user._id

        });

        // Keep Orders (recommended for business records)
        // OR delete if you want:
        // await Order.deleteMany({ user: user._id });

        await User.findByIdAndDelete(user._id);

        req.flash("success", "User deleted successfully.");

        return res.redirect("/admin/users");

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to delete user.");

        return res.redirect("/admin/users");

    }

};

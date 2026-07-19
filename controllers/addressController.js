const Address = require("../models/address");

/* =========================================
        GET : All Addresses
========================================= */

module.exports.index = async (req, res) => {

    try {

        // TODO : Fetch all addresses of logged in user

       const addresses = await Address.find({

    user:req.user._id

}).sort({

    isDefault:-1,

    createdAt:-1

});

res.render("website/address/index",{

    title:"My Addresses",
    pageCSS:"address",
    addresses

});

    } catch (err) {

        console.error(err);

        req.flash("error", "Unable to load addresses.");

        res.redirect("back");

    }

};


/* =========================================
        GET : Add Address Form
========================================= */

module.exports.renderNewForm = (req, res) => {

    res.render("website/address/add", {
            address:null,
        title: "Add Address",
        pageCSS:"address",
        redirect: req.query.redirect || ""
        

    });

};


/* =========================================
        POST : Create Address
========================================= */

module.exports.create = async (req, res) => {

    try {
        req.body.address.isDefault = req.body.address.isDefault === "on";

        const address = new Address(req.body.address);

        address.user = req.user._id;

        // If first address, make it default
        const totalAddresses = await Address.countDocuments({
            user: req.user._id
        });

        if (totalAddresses === 0) {
            address.isDefault = true;
        }

        // If user selected default
        if (req.body.address.isDefault) {

            await Address.updateMany(
                {
                    user: req.user._id
                },
                {
                    $set: {
                        isDefault: false
                    }
                }
            );

            address.isDefault = true;
        }

        await address.save();

       if (req.body.redirect === "checkout") {

    req.flash("success", "Address added successfully.");

    return res.redirect("/checkout");

}

req.flash("success", "Address added successfully.");

return res.redirect("/profile/addresses");

    } catch (err) {

        console.log(err);

        req.flash("error", err.message);

        res.redirect("/addresses/new",{
            address:null,
        });

    }

};


/* =========================================
        GET : Edit Address Form
========================================= */

module.exports.renderEditForm = async (req, res) => {

    try {

        // TODO : Find Address by ID

        const { id } = req.params;

const address = await Address.findOne({

    _id:id,

    user:req.user._id

});

if(!address){

    req.flash("error","Address not found.");

    return res.redirect("/addresses");

}

res.render("website/address/edit",{

    title:"Edit Address",

    address

});

    } catch (err) {

        console.error(err);

        req.flash("error", "Address not found.");

        res.redirect("/addresses");

    }

};


/* =========================================
        PUT : Update Address
========================================= */

module.exports.update = async (req, res) => {

    try {

        // TODO : Update address

      const { id } = req.params;

if(req.body.address.isDefault){

    await Address.updateMany(

        {

            user:req.user._id

        },

        {

            $set:{

                isDefault:false

            }

        }

    );

}
req.body.address.isDefault = req.body.address.isDefault === "on";
await Address.findOneAndUpdate(

    {

        _id:id,

        user:req.user._id

    },

    req.body.address

);

req.flash("success","Address updated.");

res.redirect("/addresses");

    } catch (err) {

        console.error(err);

        req.flash("error", "Unable to update address.");

        res.redirect("/addresses");

    }

};

/* =========================================
        DEFAULT : MakeDefault Address
========================================= */


module.exports.makeDefault = async (req, res) => {

    const { id } = req.params;

    // Remove old default address
    await Address.updateMany(
        { user: req.user._id },
        { $set: { isDefault: false } }
    );

    // Set selected address as default
   const updated = await Address.findOneAndUpdate(
    {
        _id: id,
        user: req.user._id
    },
    {
        isDefault: true
    }
);

if (!updated) {
    req.flash("error", "Address not found.");
    return res.redirect("/addresses");
}

    req.flash("success", "Default address updated successfully.");

    res.redirect("/addresses");
};


/* =========================================
        DELETE : Delete Address
========================================= */

module.exports.destroy = async (req, res) => {

    try {

        // TODO : Delete Address

       const { id } = req.params;

const deletedAddress=await Address.findOneAndDelete({

    _id:id,

    user:req.user._id

});

if(deletedAddress && deletedAddress.isDefault){

    const nextAddress=await Address.findOne({

        user:req.user._id

    });

    if(nextAddress){

        nextAddress.isDefault=true;

        await nextAddress.save();

    }

}

req.flash("success","Address deleted.");

res.redirect("/addresses");

    } catch (err) {

        console.error(err);

        req.flash("error", "Unable to delete address.");

        res.redirect("/addresses");

    }

};


/* =========================================
        PATCH : Make Default Address
========================================= */

module.exports.makeDefault = async (req, res) => {

    try {

        // TODO : Make selected address default
        const { id } = req.params;

await Address.updateMany(

    {

        user:req.user._id

    },

    {

        $set:{

            isDefault:false

        }

    }

);

await Address.findOneAndUpdate(

    {

        _id:id,

        user:req.user._id

    },

    {

        isDefault:true

    }

);

req.flash("success","Default address updated.");

res.redirect("/addresses");
        

    } catch (err) {

        console.error(err);

        req.flash("error", "Unable to update default address.");

        res.redirect("/addresses");

    }

};
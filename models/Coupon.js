const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({

    name: {

        type: String,

        required: true,

        trim: true

    },

    code: {

        type: String,

        required: true,

        unique: true,

        uppercase: true,

        trim: true

    },

    description: {

        type: String,

        trim: true

    },

    discountType: {

        type: String,

        enum: ["percentage", "fixed"],

        default: "percentage"

    },

    discountValue: {

        type: Number,

        required: true,

        min: 1

    },

    minimumOrder: {

        type: Number,

        default: 0

    },

    maximumDiscount: {

        type: Number,

        default: 0

    },

    usageLimit: {

        type: Number,

        default: 1

    },

    usedCount: {

        type: Number,

        default: 0

    },

    expiryDate: {

        type: Date,

        required: true

    },

    isActive: {

        type: Boolean,

        default: true

    },

    createdBy: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User"

    }

}, {

    timestamps: true

});

module.exports = mongoose.model("Coupon", couponSchema);
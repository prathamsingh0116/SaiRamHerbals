const mongoose = require("mongoose");

const { Schema } = mongoose;

const reviewSchema = new Schema(

    {

        rating: {

            type: Number,

            required: true,

            min: 1,

            max: 5

        },

        comment: {

    type: String,

    required: true,

    trim: true,

    minlength: 10,

    maxlength: 1000

},

        user: {

            type: Schema.Types.ObjectId,

            ref: "User",

            required: true

        },

        product: {

            type: Schema.Types.ObjectId,

            ref: "Product",

            required: true

        },

        isVerifiedPurchase: {

            type: Boolean,

            default: false

        },

        isActive: {

            type: Boolean,

            default: true

        }

    },

    {

        timestamps: true

    }

);

module.exports = mongoose.model("Review", reviewSchema);
// ======================================
// Imports
// ======================================

const mongoose = require("mongoose");

// ======================================
// Product Schema
// ======================================

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        minlength: 3,
        maxlength: 150
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    brand: {
        type: String,
        default: "SaiRam Herbals",
        trim: true
    },

    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true
    },

    sku: {
        type: String,
        required: [true, "SKU is required"],
        unique: true,
        trim: true,
        uppercase: true
    },

    price: {
        type: Number,
        required: [true, "Price is required"],
        min: 0
    },

    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },

    stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
},

lowStockLimit: {
    type: Number,
    default: 10
},

stockStatus: {
    type: String,
    enum: ["In Stock", "Low Stock", "Out of Stock"],
    default: "In Stock"
},

    description: {
        type: String,
        trim: true,
        default: ""
    },

    images: [
        {
            url: {
                type: String,
                default: ""
            },
            filename: {
                type: String,
                default: ""
            }
        }
    ],
    reviews: [

    {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Review"

    }

],

    isFeatured: {
        type: Boolean,
        default: false
    },

    isActive: {
        type: Boolean,
        default: true
    },

    sold: {
        type: Number,
        default: 0,
        min: 0
    }

}, {
    timestamps: true
},



);

// ======================================
// Indexes
// ======================================

productSchema.index({ slug: 1 });

productSchema.index({ sku: 1 });

productSchema.index({ category: 1 });

productSchema.index({ isFeatured: 1 });

productSchema.index({ isActive: 1 });

// ======================================
// Virtual
// ======================================

productSchema.virtual("finalPrice").get(function () {

    return this.price - (this.price * this.discount) / 100;

});

// ======================================
// Export
// ======================================

const Product =
    mongoose.models.Product ||
    mongoose.model("Product", productSchema);

module.exports = Product;
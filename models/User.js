// ======================================
// Imports
// ======================================

const mongoose = require("mongoose");

// ======================================
// User Schema
// ======================================

const userSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true
    },
    
    phone: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    
    password: {
        type: String,
        default: null
    },
    
    googleId: {
    type: String,
    default: null,
    unique: true,
    sparse: true
},
    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer"
    },
    dateOfBirth: Date,

    gender: {
        type: String,
        enum: ["Male", "Female", "Other"]
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    isBlocked: {
        type: Boolean,
        default: false
    },

    profileImage: {
        url: {
            type: String,
            filename: String,
            default: ""
        },
        filename: {
            type: String,
            default: ""
        }
    },

    lastLogin: {
        type: Date
    }

}, {
    timestamps: true
});

// ======================================
// Indexes
// ======================================

userSchema.index({ email: 1 });


// ======================================
// Virtual
// ======================================

userSchema.virtual("displayRole").get(function () {

    return this.role.charAt(0).toUpperCase() + this.role.slice(1);

});

// ======================================
// Export
// ======================================

module.exports = mongoose.model("User", userSchema);
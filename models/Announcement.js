// ======================================
// Imports
// ======================================

const mongoose = require("mongoose");

// ======================================
// Announcement Schema
// ======================================

const announcementSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, "Title is required."],
        trim: true,
        minlength: 3,
        maxlength: 120
    },

    message: {
        type: String,
        required: [true, "Message is required."],
        trim: true,
        minlength: 5,
        maxlength: 500
    },

    type: {
    type: String,
    enum: [
        "offer",
        "sale",
        "coupon",
        "shipping",
        "new",
        "festival",
        "stock",
        "info"
    ],
    default: "info"
},

    coupon: {
        type: String,
        trim: true,
        uppercase: true,
        default: ""
    },

    priority: {
        type: Number,
        default: 1,
        min: 1,
        max: 10
    },

    backgroundColor: {
        type: String,
        default: "#2E7D32",
        trim: true
    },

    textColor: {
        type: String,
        default: "#FFFFFF",
        trim: true
    },

    link: {
        type: String,
        trim: true,
        default: ""
    },

    clickable: {
        type: Boolean,
        default: false
    },

    buttonText: {
        type: String,
        trim: true,
        maxlength: 30,
        default: ""
    },

    startDate: {
        type: Date
    },

    endDate: {
        type: Date
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

// ======================================
// Indexes
// ======================================

announcementSchema.index({ isActive: 1 });
announcementSchema.index({ priority: 1 });
announcementSchema.index({ startDate: 1 });
announcementSchema.index({ endDate: 1 });

// ======================================
// Virtual
// ======================================

announcementSchema.virtual("status").get(function () {

    return this.isActive ? "Active" : "Inactive";

});

// ======================================
// Export
// ======================================

const Announcement =
    mongoose.models.Announcement ||
    mongoose.model("Announcement", announcementSchema);

module.exports = Announcement;
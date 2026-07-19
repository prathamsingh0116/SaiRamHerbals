// ======================================
// Load Active Announcements
// ======================================

const Announcement = require("../models/Announcement");

// ======================================
// Global Announcement Middleware
// ======================================

const loadAnnouncements = async (req, res, next) => {

    try {

        const today = new Date();

        const announcements = await Announcement.find({

            isActive: true,

            $and: [

                {
                    $or: [

                        { startDate: { $exists: false } },

                        { startDate: { $lte: today } }

                    ]
                },

                {
                    $or: [

                        { endDate: { $exists: false } },

                        { endDate: { $gte: today } }

                    ]
                }

            ]

        })
        .sort({ priority: 1 })
        .lean();

        // Make announcements available in all EJS pages
        res.locals.announcements = announcements;

    } catch (err) {

        console.error("Announcement Middleware Error:");
        console.error(err);

        // Prevent application crash
        res.locals.announcements = [];

    }

    next();

};

module.exports = loadAnnouncements;
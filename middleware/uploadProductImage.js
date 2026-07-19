const multer = require("multer");

const { productStorage } = require("../config/cloudinary");

// =====================================================
// TODO : Cloudinary Migration
//
// Current : Local Storage
// Future : Replace diskStorage() with Cloudinary Storage
//
// Product Schema will remain unchanged.
//
// =====================================================

// Create folder automatically


const fileFilter = (req, file, cb) => {

    const allowed = [

        "image/jpeg",

        "image/png",

        "image/jpg",

        "image/webp"

    ];

    if (allowed.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(

            new Error("Only image files are allowed."),

            false

        );

    }

};

module.exports = multer({

    storage: productStorage,

    fileFilter,

    limits: {

        fileSize: 5* 1024 * 1024

    }

});


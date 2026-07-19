const cloudinary = require("cloudinary").v2;

const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({

    cloud_name: process.env.CLOUD_NAME,

    api_key: process.env.CLOUD_API_KEY,

    api_secret: process.env.CLOUD_API_SECRET,

});

const productStorage = new CloudinaryStorage({

    cloudinary,

    params: {

        folder: "SaiRamHerbals/products",

        allowed_formats: ["jpg","jpeg","png","webp"]

    }

});

const profileStorage = new CloudinaryStorage({

    cloudinary,

    params: {

        folder: "SaiRamHerbals/profiles",

        allowed_formats: ["jpg","jpeg","png","webp"]

    }

});

module.exports = {

    cloudinary,

    productStorage,

    profileStorage

};
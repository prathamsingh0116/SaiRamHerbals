const multer = require("multer");
const { profileStorage } = require("../config/cloudinary");



const fileFilter=(req,file,cb)=>{

    const allowed=["image/jpeg","image/png","image/jpg","image/webp"];

    if(allowed.includes(file.mimetype)){

        cb(null,true);

    }else{

        cb(new Error("Only image files are allowed."),false);

    }

}

module.exports=multer({

    storage:profileStorage,

    fileFilter,

    limits:{

        fileSize:10*1024*1024

        
    }

});
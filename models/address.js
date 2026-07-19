const mongoose = require("mongoose");

const { Schema } = mongoose;

const addressSchema = new Schema({

    user:{

        type:Schema.Types.ObjectId,

        ref:"User",

        required:true,

        index:true,

    },

    fullName:{

        type:String,

        required:true,

        trim:true,

    },

    phone:{

        type:String,

        required:true,

        trim:true,

    },

    alternatePhone:{

        type:String,

        default:"",

        trim:true,

    },

    addressLine1:{

        type:String,

        required:true,

        trim:true,

    },

    addressLine2:{

        type:String,

        default:"",

        trim:true,

    },

    landmark:{

        type:String,

        default:"",

        trim:true,

    },

    city:{

        type:String,

        required:true,

        trim:true,

    },

    state:{

        type:String,

        required:true,

        trim:true,

    },

    country:{

        type:String,

        default:"India",

        trim:true,

    },

    pincode:{

        type:String,

        required:true,

        trim:true,

    },

    label: {
    type: String,
    default: ""
},

latitude: Number,

longitude: Number,

    addressType:{

        type:String,

        enum:["Home","Office","Other"],

        default:"Home",

    },

    isDefault:{

        type:Boolean,

        default:false,

    }

},{timestamps:true});

module.exports =
    mongoose.models.Address ||
    mongoose.model("Address", addressSchema);
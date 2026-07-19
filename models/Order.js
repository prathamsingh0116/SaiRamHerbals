const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({

    product:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Product",

        required:true

    },

    name:String,

    image:String,

    price:Number,

    quantity:Number

});

const orderSchema = new mongoose.Schema({

    user:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:true

    },

    address:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Address",

        required:true

    },

    items:[orderItemSchema],

    subtotal:Number,

    couponDiscount:{

        type:Number,

        default:0

    },

    shippingCharge:{

        type:Number,

        default:0

    },

    totalSavings:{

        type:Number,

        default:0

    },

    grandTotal:Number,

    paymentMethod:{

        type:String,

        enum:["COD","ONLINE","RAZORPAY"],

        default:"COD"

    },

    paymentStatus: {
    type: String,
    enum: ["UNPAID", "PAID", "FAILED", "REFUNDED"],
    default: "UNPAID"
},

    orderStatus:{

        type:String,

        enum:[

"Pending",

"Confirmed",

"Packed",

"Shipped",

"Out For Delivery",

"Delivered",

"Cancelled",

"Return Requested",

"Returned",

"Refunded"

],

        default:"Pending"

    },

    razorpayOrderId:{

    type:String,

    default:null

},
cancelReason:{

type:String,

default:""

},

cancelledBy:{

type:String,

enum:["USER","ADMIN"],

default:null

},

returnReason:{

type:String,

default:""

},

refundAmount:{

type:Number,

default:0

},

refundDate:{

type:Date,

default:null

},
codCharge:{

    type:Number,

    default:0

},
paymentDate:{

    type:Date,

    default:null

},
paidAmount:{

    type:Number,

    default:0

},
isPaymentVerified:{

type:Boolean,

default:false

},
 statusHistory:{

    placedAt:{
        type:Date,
        default:Date.now
    },

    confirmedAt:{
        type:Date,
        default:null
    },

    packedAt:{
        type:Date,
        default:null
    },

    shippedAt:{
        type:Date,
        default:null
    },
    outForDeliveryAt:{

type:Date,

default:null

},

returnedAt:{

type:Date,

default:null

},

refundDate:{

type:Date,

default:null

},

    deliveredAt:{
        type:Date,
        default:null
    },

    cancelledAt:{
        type:Date,
        default:null
    }

},


},{timestamps:true});

module.exports=mongoose.model("Order",orderSchema);
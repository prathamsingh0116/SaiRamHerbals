const express=require("express");

const router=express.Router();

const orderController=require("../controllers/orderController");

const isLoggedIn=require("../middleware/isLoggedIn");

router.post(

"/place",

isLoggedIn,

orderController.placeOrder

);


router.get(
    
    "/success/:id",
    
    isLoggedIn,
    
    orderController.successPage
    
);

router.get(
    
    "/",
    
    isLoggedIn,
    
    orderController.myOrders
    
);

router.get(
    
    "/:id",
    
    isLoggedIn,
    
    orderController.orderDetails
    
);

router.patch(
    "/:id/cancel",
    isLoggedIn,
    orderController.cancelOrder
);

module.exports=router;
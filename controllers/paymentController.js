const crypto = require("crypto");

const razorpay = require("../config/razorpay");

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Address = require("../models/Address");

const { prepareOrder } = require("../utils/orderHelper");

module.exports.createOrder = async (req, res) => {

    try {

        const { address } = req.body;

        // Validate Address
        if (!address) {

            return res.status(400).json({

                success: false,

                message: "Please select delivery address."

            });

        }

        const selectedAddress = await Address.findOne({

            _id: address,

            user: req.user._id

        });

        if (!selectedAddress) {

            return res.status(400).json({

                success: false,

                message: "Invalid address."

            });

        }

        // Prepare Order
        const {

            cart,

            orderItems,

            subtotal,

            couponDiscount,

            shippingCharge,

            totalSavings

        } = await prepareOrder(req);

        const grandTotal =
            subtotal -
            couponDiscount +
            shippingCharge;

        // Razorpay Order
        const razorpayOrder =
            await razorpay.orders.create({

                amount: Math.round(grandTotal * 100),

                currency: "INR",

                receipt: "SRH_" + Date.now()

            });

        // Pending Order
        const pendingOrder =
            await Order.create({

                user: req.user._id,

                address,

                items: orderItems,

                subtotal,

                couponDiscount,

                shippingCharge,

                totalSavings,

                grandTotal,

                paymentMethod: "RAZORPAY",

                paymentStatus: "UNPAID",

                isPaymentVerified: false,

                paidAmount: 0,

                codCharge: 0,

                razorpayOrderId: razorpayOrder.id,

                statusHistory: {

                    placedAt: new Date()

                }

            });

        return res.json({

            success: true,

            order: razorpayOrder,

            orderId: pendingOrder._id

        });

    }

    catch (err) {

        console.log(err);

        return res.status(500).json({

            success: false,

            message: "Unable to create payment."

        });

    }

};

module.exports.verifyPayment = async (req, res) => {

    try {

        const {

            orderId,

            razorpay_order_id,

            razorpay_payment_id,

            razorpay_signature

        } = req.body;

        // ==========================
        // Find Pending Order
        // ==========================

        const order = await Order.findById(orderId);

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found."

            });

        }

        // ==========================
        // Verify Signature
        // ==========================

        const generatedSignature = crypto

            .createHmac(

                "sha256",

                process.env.RAZORPAY_KEY_SECRET

            )

            .update(

                razorpay_order_id +

                "|" +

                razorpay_payment_id

            )

            .digest("hex");

        if (generatedSignature !== razorpay_signature) {

            order.paymentStatus = "Failed";

            await order.save();

            return res.status(400).json({

                success: false,

                message: "Payment verification failed."

            });

        }

        // ==========================
        // Payment Success
        // ==========================

        order.paymentStatus = "PAID";

        order.isPaymentVerified = true;

        order.razorpayPaymentId = razorpay_payment_id;

        order.razorpayOrderId = razorpay_order_id;

        order.razorpaySignature = razorpay_signature;

        order.paymentDate = new Date();

        order.paidAmount = order.grandTotal;

        await order.save();
        
        // ==========================
        // Empty Cart
        // ==========================

        const cart = await Cart.findOne({

            user: req.user._id

        });

        if (cart) {

            cart.items = [];

            await cart.save();

        }

        // Remove Coupon
        delete req.session.coupon;

        return res.json({

            success: true,

            redirect:

                "/orders/success/" + order._id

        });

    }

    catch (err) {

        console.log(err);

        return res.status(500).json({

            success: false,

            message: "Something went wrong."

        });

    }

};
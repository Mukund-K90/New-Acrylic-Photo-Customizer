const BillingDetails = require("../Model/BillingDetails");
const Cart = require("../Model/Cart");
const Products = require("../Model/Product");
const razorpayService = require('../utils/razorpay');
const { errorResponse, successResponse } = require('../utils/apiResponse');
const { status } = require('http-status')
const generateOrderNumber = require('../utils/orderNoGenerate');
const cartService = require("../Service/CartService");
const billingService = require("../Service/billingService");

const placeOrder = async (req, res) => {
    try {
        const { firstname, lastname, country, street_address, city, province, zipcode, phone, email, additional } = req.body;

        if (!firstname || !lastname || !country || !street_address || !city || !province || !zipcode || !phone || !email) {
            return res.status(400).json({ success: false, message: "Please fill all required fields!" });
        }

        const cartItems = await cartService.getCart(req.user.id);
        if (!cartItems.length) {
            return res.status(400).json({ success: false, message: "Cart is empty!" });
        }

        const productsData = cartItems.map(item => ({
            image: item.image,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            user: item.user,
            type: item.type,
            border: item.border,
            size: item.size,
            thickness: item.thickness,
            address: item.address,
            subTotal: item.subTotal
        }));

        const savedProducts = await billingService.addProducts(productsData);

        const orderNo = await generateOrderNumber();
        const billingDetails = {
            firstname,
            lastname,
            country,
            street_address,
            city,
            province,
            zipcode,
            phone,
            email,
            additional,
            products: savedProducts.map(product => ({ productId: product._id })),
            total: cartItems.reduce((sum, item) => sum + item.subTotal, 0),
            userId: req.user.id,
            orderNo
        };
        const order = await billingService.addBillingDetails(billingDetails);

        if (!order) {
            return res.status(400).json({ success: false, message: "Failed to save billing" });
        }

        await cartService.clearUserCart(req.user.id);

        return res.status(201).json({ success: true, message: "Order placed successfully!", order });
    } catch (error) {
        console.error("Error placing order:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const orders = await billingService.getUserOrders(req.user.id);
        return res.status(200).json({ success: true, message: "Orders retrieved successfully!", orders });
    } catch (error) {
        console.error("Error retrieving orders:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const getBillingDetails = async (req, res) => {
    try {
        const billingData = await billingService.getBillingData(req.params.orderId);
        const paymentDetails = await razorpayService.getOrderDetailsById(billingData.orderId);
        if (!billingData) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        return successResponse(req, res, status.OK, "Billing Details Fetched!!", { billingData, paymentDetails })
    } catch (error) {
        console.error("Error retrieving orders:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const cancelUserOrder = async (req, res) => {
    try {
        const canceledOrder = await billingService.cancelOrder(req.params.orderId);

        if (!canceledOrder) {
            return res.status(404).json({ success: false, message: "Order not found or already canceled." });
        }

        return res.status(200).json({ success: true, message: "Order canceled successfully.", data: canceledOrder });

    } catch (error) {
        console.error("Error canceling order:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


module.exports = { placeOrder, getUserOrders, getBillingDetails, cancelUserOrder };

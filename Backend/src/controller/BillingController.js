const BillingDetails = require("../Model/BillingDetails");
const Cart = require("../Model/Cart");
const Products = require("../Model/Product");
const { getOrderDetailsById } = require('../utils/razorpay');
const { errorResponse, successResponse } = require('../utils/apiResponse');
const { status } = require('http-status')
const generateOrderNumber=require('../utils/orderNoGenerate')

const placeOrder = async (req, res) => {
    try {
        const { firstname, lastname, country, street_address, city, province, zipcode, phone, email, additional } = req.body;
        const userId = req.user.id;

        if (!firstname || !lastname || !country || !street_address || !city || !province || !zipcode || !phone || !email) {
            return res.status(400).json({ success: false, message: "Please fill all required fields!" });
        }

        const cartItems = await Cart.find({ user: userId });
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

        const savedProducts = await Products.insertMany(productsData);

        const orderNo=await generateOrderNumber();
        const order = new BillingDetails({
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
            userId,
            orderNo
        });

        await order.save();

        await Cart.deleteMany({ user: userId });

        return res.status(201).json({ success: true, message: "Order placed successfully!", order });
    } catch (error) {
        console.error("Error placing order:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const orders = await BillingDetails.find({ userId: req.user.id })
            .populate('products.productId');
        return res.status(200).json({ success: true, message: "Orders retrieved successfully!", orders });
    } catch (error) {
        console.error("Error retrieving orders:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const getOrderDetails = async (req, res) => {
    try {
        const order = await BillingDetails.findById(req.params.orderId).populate('products.productId');
        const paymentDetails = await getOrderDetailsById(order.orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        return successResponse(req, res, status.OK, "Order Details Fetched!!", { order, paymentDetails })
    } catch (error) {
        console.error("Error retrieving orders:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

module.exports = { placeOrder, getUserOrders, getOrderDetails };

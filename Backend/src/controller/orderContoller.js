const { createNewOrder, getOrderDetailsById } = require("../utils/razorpay");
const Billing = require("../Model/BillingDetails");
//create new order

exports.createOrder = async (req, res) => {
    try {
        const { amount, billingId } = req.body;

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `order_rcptid_${Date.now()}`,
        };

        const order = await createNewOrder(options);
        console.log("SASASSASs",billingId);
        
        await Billing.findByIdAndUpdate(
            billingId,
            { orderId: order.id },
            { new: true } 
        );
        return res.status(200).json({ success: true, data: order });

    } catch (error) {
        console.error("Order creation error:", error);
        res.status(500).json({ success: false, message: "Failed to create order" });
    }
};

//get order details
exports.getOrderDetails = async (req, res) => {
    try {
        const receiptId = req.params.receiptId;
        const order = await getOrderDetailsById(receiptId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        return res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error("Error fetching order details:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

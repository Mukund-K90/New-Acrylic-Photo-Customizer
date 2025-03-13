const crypto = require('crypto');
const Billing = require('../Model/BillingDetails');
const { CONFIG } = require('../config/config')

//payment verification callback
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_signature, razorpay_payment_id, razorpay_order_id, billingId } = req.body;

        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !billingId) {
            return res.status(400).json({ success: false, message: "Missing required parameters." });
        }

        // Generate the expected signature
        const generated_signature = crypto
            .createHmac("sha256", CONFIG.razorPayKeySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        const isAuthentic = generated_signature === razorpay_signature;

        // Fetch billing details
        const billingData = await Billing.findById(billingId);
        if (!billingData) {
            return res.status(404).json({ success: false, message: "Billing data not found." });
        }
        console.log(isAuthentic);
        
        if (!isAuthentic) {
            billingData.paymentStatus = "Failed";
            await billingData.save();
            return res.status(400).json({ success: false, message: "Payment verification failed." });
        }

        // Payment is valid, update billing status
        billingData.paymentStatus = "Captured";
        await billingData.save();

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully. Order placed!",
            data: { billingId, paymentStatus: "Captured" },
        });

    } catch (error) {
        console.error("Payment verification error:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};
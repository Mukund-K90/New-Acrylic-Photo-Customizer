const Billing = require("../Model/BillingDetails");
const Products = require("../Model/Product");

module.exports.addProducts = async (productsData) => {
    try {
        return await Products.insertMany(productsData);
    } catch (error) {
        throw error;
    }
}

module.exports.addBillingDetails = async (billingData) => {
    try {
        const billingDetails = new Billing(billingData);
        return await billingDetails.save();
    } catch (error) {
        throw error;
    }
}

module.exports.getUserOrders = async (userId) => {
    try {
        return await Billing.find({ userId }).sort({ createdAt: -1 }).populate('products.productId').lean();
    } catch (error) {
        throw error;
    }
}

module.exports.getBillingData = async (id) => {
    try {
        return Billing.findById(id).populate('products.productId').lean();
    } catch (error) {
        throw error;
    }
}
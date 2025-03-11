const Razorpay = require('razorpay');
const { CONFIG } = require('../config/config');

//RazorPay instance
const razorpayInstance = new Razorpay({
    key_id: CONFIG.razorPayKeyId,
    key_secret: CONFIG.razorPayKeySecret,
});

//create customer
const createCustomer = async (email, name, contact) => {
    try {
        const customer = await razorpayInstance.customers.create({
            name,
            email,
            contact
        });
        return customer;
    } catch (error) {
        console.error("Error creating customer:", error);
        throw new Error("Failed to create customer");
    }
};

//check existing cutomer
const checkCustomer = async (customerId) => {
    try {
        const customer = await razorpayInstance.customers.fetch(customerId);
        return customer;
    } catch (error) {
        if (error.statusCode === 400 && error.error.code === 'BAD_REQUEST_ERROR') {
            console.warn("Customer not found:", error.error.description);
            return null;
        }
        console.error("Error fetching customer:", error);
        throw new Error("Failed to fetch customer");
    }
};

//create new subscription
const createSubscription = async (planId) => {
    try {
        const startAt = Math.floor(Date.now() / 1000) + 3600;
        const subscription = razorpayInstance.subscriptions.create({
            plan_id: planId,
            customer_notify: 1,
            quantity: 1,
            total_count: 12,
        });

        return subscription;
    } catch (error) {
        console.error("Error creating subscription:", error);
        throw new Error("Failed to create subscription", error);
    }
};

//get subscription details
const generateSubscriptionDetails = async (subscriptionId) => {
    try {
        const subscription = await razorpayInstance.subscriptions.fetch(subscriptionId);
        return subscription;
    } catch (error) {
        console.error("Error creating subscription:", error);
        throw new Error("Failed to create subscription");
    }
}

//pause subscription
const pauseSubscription = async (subscriptionId) => {
    try {
        const subscription = await razorpayInstance.subscriptions.pause(subscriptionId,{
            pause_at: "now"
        });
        return subscription;
    } catch (error) {
        console.error("Error pausing subscription:", error);
        throw new Error("Failed to pause subscription", error);
    }
}

//cancel subscription
const cancelSubscription = async (subscriptionId) => {
    try {
        const subscription = await razorpayInstance.subscriptions.cancel(subscriptionId);
        return subscription;
    } catch (error) {
        console.error("Error cancel subscription:", error);
        throw new Error("Failed to cancel subscription", error);
    }
}

// const cancelSubscription = async (subscriptionId) => {
//     try {
//         const subscription = await generateSubscriptionDetails(subscriptionId);
//         const createdAt = subscription.created_at;
//         const currentTime = Math.floor(Date.now() / 1000);
//         const timeDiff = currentTime - createdAt;
//         const fiveDaysInSeconds = 5 * 24 * 60 * 60;

//         await razorpayInstance.subscriptions.cancel(subscriptionId);

//         if (timeDiff <= fiveDaysInSeconds) {
//             const refundResponse = await refundLastPayment(subscriptionId);
//             return { success: true, message: "Subscription canceled and refunded", refund: refundResponse };
//         }

//         return { success: true, message: "Subscription canceled, no refund issued" };
//     } catch (error) {
//         throw new Error("Failed to cancel subscription: " + error.message);
//     }
// };

// const getLastPayment = async (subscriptionId) => {
//     try {
//         const invoices = await razorpayInstance.invoices.all({ subscription_id: subscriptionId });
//         const lastInvoice = invoices.items.find(invoice => invoice.status === "paid");

//         return lastInvoice ? lastInvoice.payment_id : null;
//     } catch (error) {
//         throw new Error("Failed to get last payment: " + error.message);
//     }
// };

// const refundLastPayment = async (subscriptionId) => {
//     try {
//         const lastPaymentId = await getLastPayment(subscriptionId);

//         if (!lastPaymentId) {
//             return { success: false, message: "No payment found, so no refund issued." };
//         }

//         return await razorpayInstance.payments.refund(lastPaymentId, { speed: "normal" });
//     } catch (error) {
//         throw new Error("Failed to refund: " + error.message);
//     }
// };




//create plan
const createPlan = async (options) => {
    try {
        const plan = await razorpayInstance.plans.create(options);
        return plan;
    } catch (error) {
        console.error("Error creating plan:", error);
        throw new Error("Failed to create plan");
    }
}

//get all plans
const getPlans = async () => {
    try {
        const allPlans = await razorpayInstance.plans.all();

        const activePlans = allPlans.items.filter(plan => plan.item && plan.item.active);

        return activePlans;
    } catch (error) {
        console.error("Error fetching active plans:", error);
        throw new Error("Failed to fetch active plans");
    }
};

//create order
const createNewOrder = async (options) => {
    try {
        const order = await razorpayInstance.orders.create(options);
        return order;
    } catch (error) {
        console.error("Error creating order:", error);
        throw new Error("Failed to create order");
    }
}

//get order details by recipt
const getOrderDetailsById = async (orderId) => {
    try {
        const response = await razorpayInstance.orders.fetchPayments(orderId);
        return response;
    } catch (error) {
        console.error("Error fetching order payments:", error);
        throw new Error("Failed to fetch order payments");
    }
};

module.exports = {
    createSubscription,
    pauseSubscription,
    cancelSubscription,
    createCustomer,
    checkCustomer,
    generateSubscriptionDetails,
    createPlan,
    getPlans,
    createNewOrder,
    getOrderDetailsById,
};

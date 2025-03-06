// const Subscription = require("../model/subscription");
// const { generateSubscriptionDetails } = require("../utils/razorpay");


// module.exports.realTimeStatus =async () => {
//     console.log("⏳ Running subscription status sync...");
//     try {
//         const subscriptions = await Subscription.find({ status: { $in: ["completed", "cancelled"] } });

//         if (subscriptions.length === 0) {
//             console.log("✅ No active subscriptions to update.");
//             return;
//         }

//         for (const sub of subscriptions) {
//             const razorpaySub = await generateSubscriptionDetails(sub.subscriptionId);
//             if (razorpaySub) {
//                 await Subscription.updateOne(
//                     { subscriptionId: sub.subscriptionId },
//                     { $set: { status: razorpaySub.status } }
//                 );
//                 console.log(`✅ Updated subscription ${sub.subscriptionId} to status: ${razorpaySub.status}`);
//             }
//         }

//         console.log("✅ Subscription status sync completed.");
//     } catch (error) {
//         console.error("❌ Error in subscription status sync:", error.message);
//     }
// };

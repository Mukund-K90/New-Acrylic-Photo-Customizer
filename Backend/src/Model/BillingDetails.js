const mongoose = require("mongoose");

const BillingSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        country: {
            type: String
        },
        street_address: {
            type: String
        },
        city: {
            type: String
        },
        province: {
            type: String
        },
        zipcode: {
            type: String
        },
        phone: {
            type: String
        },
        email: {
            type: String
        },
        additional: {
            type: String
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Cart'
                }
            },
        ],
        total: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "Processing", "Completed"],
            default: "Pending"
        },
        orderId: {
            type: String
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Products",
                }
            }
        ],
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true
    }
);


const Billing = mongoose.model("Billing", BillingSchema);

module.exports = Billing;

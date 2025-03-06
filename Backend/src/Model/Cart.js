const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        imageDetails: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;

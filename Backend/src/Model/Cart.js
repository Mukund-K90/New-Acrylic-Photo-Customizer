const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
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
      index: false, // ✅ Ensure no unique index is created
    },
    type: {
      type: String,
      required: true,
    },
    border: {
      type: String,
      default: null,
    },
    size: {
      type: String,
      default: "default",
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;

const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    name: {
      type: String,
    },
    price: {
      type: Number,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: false,
    },
    type: {
      type: String,
    },
    border: {
      type: String,
      default: null,
    },
    size: {
      type: String,
      default: "default",
    },
    thickness: {
      type: String,
      default: "default"
    }
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
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
    },
    address: {
      type: String,
      default: null
    },
    subTotal: {
      type: Number,
      default: 0
    },
  },
  { timestamps: true }
);

const Products = mongoose.model("Products", productSchema);

module.exports = Products;

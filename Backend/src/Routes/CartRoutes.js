const express = require("express");
const router = express.Router();
const { cloudUpload } = require("../utils/upload");
const { addToCart, getUserCart, deleteCartItem, clearCart, updateCartItem, decreaseQuantity, increaseQuantity, removeItem } = require("../controller/CartController");
const upload = require("../utils/upload");
const { authorization } = require("../middleware/auth.middleware");

router.post("/add", authorization, upload.single("image"), addToCart);
router.get("/get", authorization, getUserCart);
router.put("/update/:cartItemId", authorization, updateCartItem);
router.delete("/remove/:cartItemId", authorization, deleteCartItem);
router.delete("/clear/:userId", authorization, clearCart);
router.put("/increase/:id", authorization, increaseQuantity);
router.put("/decrease/:id", authorization, decreaseQuantity);
router.delete("/remove/:id", authorization, removeItem);

module.exports = router;

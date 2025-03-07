const Cart = require("../Model/Cart");
const cloudinary = require("../config/cloudinary");

exports.addToCart = async (req, res) => {
    try {
        const details = JSON.parse(req.body.details);
        const subject = req.body.subject || "Custom Acrylic Photo";
        console.log(details);
        
        let uploadedImageUrl = null;

        if (req.file) {
            const uploadedImage = await cloudinary.uploader.upload(req.file.path);
            uploadedImageUrl = uploadedImage.secure_url;
        } else {
            return res.status(400).json({ success: false, message: "Image upload failed" });
        }

        const cartItem = new Cart({
            size: details.size,
            type: details.type,
            border: details.border,
            image: uploadedImageUrl,
            name: subject,
            price: 799,
            quantity: 1,
            user: req.user.id,
        });

        await cartItem.save();
        res.status(201).json({ success: true, message: "Item added to cart", cartItem });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Error adding item to cart", error: error.message });
    }
};


// Get all cart items for a user
exports.getUserCart = async (req, res) => {
    try {
        const cartItems = await Cart.find({ user: req.user.id });

        res.status(200).json({ success: true, cartItems });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching cart items", error: error.message });
    }
};

// Update a cart item (quantity, etc.)
exports.updateCartItem = async (req, res) => {
    try {
        const { cartItemId } = req.params;
        const { quantity } = req.body;

        const updatedCartItem = await Cart.findByIdAndUpdate(
            cartItemId,
            { quantity },
            { new: true }
        );

        if (!updatedCartItem) {
            return res.status(404).json({ success: false, message: "Cart item not found" });
        }

        res.status(200).json({ success: true, message: "Cart item updated", cartItem: updatedCartItem });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating cart item", error: error.message });
    }
};

// Delete a cart item
exports.deleteCartItem = async (req, res) => {
    try {
        const { cartItemId } = req.params;

        const deletedCartItem = await Cart.findByIdAndDelete(cartItemId);

        if (!deletedCartItem) {
            return res.status(404).json({ success: false, message: "Cart item not found" });
        }

        res.status(200).json({ success: true, message: "Cart item removed" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting cart item", error: error.message });
    }
};

// Clear the entire cart for a user
exports.clearCart = async (req, res) => {
    try {
        const { userId } = req.params;

        await Cart.deleteMany({ user: userId });

        res.status(200).json({ success: true, message: "Cart cleared successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error clearing cart", error: error.message });
    }
};

exports.increaseQuantity = async (req, res) => {
    try {
        const cartItem = await Cart.findById(req.params.id);
        if (!cartItem) return res.status(404).json({ success: false, message: "Item not found" });

        cartItem.quantity += 1;
        await cartItem.save();

        const cartItems = await Cart.find({ user: req.user.id });
        res.json({ success: true, cartItems });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Decrease quantity of a cart item
exports.decreaseQuantity = async (req, res) => {
    try {
        const cartItem = await Cart.findById(req.params.id);
        if (!cartItem) return res.status(404).json({ success: false, message: "Item not found" });

        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
            await cartItem.save();
        }

        const cartItems = await Cart.find({ user: req.user.id });
        res.json({ success: true, cartItems });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Remove an item from the cart
exports.removeItem = async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Item removed" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
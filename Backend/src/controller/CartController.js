const Cart = require("../Model/Cart");
const cloudinary = require("../config/cloudinary");
const { addCart, getCart, deleteCart, clearCart, getCartById, removeItem } = require("../dao/CartDao");
const { errorResponse, successResponse } = require('../utils/apiResponse');
const { status } = require('http-status');

exports.addToCart = async (req, res) => {
    try {
        const details = JSON.parse(req.body.details);
        let uploadedImageUrl = null;

        if (req.file) {
            const uploadedImage = await cloudinary.uploader.upload(req.file.path);
            uploadedImageUrl = uploadedImage.secure_url;
        } else {
            return errorResponse(req, res, status.BAD_REQUEST, "Image upload failed");
        }

        const cartItem = {
            size: details.size || null,
            type: details.type || null,
            border: details.border || null,
            image: uploadedImageUrl || null,
            name: details.name || null,
            price: details.price || null,
            quantity: 1,
            user: req.user.id || null,
            thickness: details.thickness || null,
            subTotal: details.price
        };

        const addedCart = await addCart(cartItem);

        if (!addedCart) {
            return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, "Error adding item to cart");
        }

        return successResponse(req, res, status.CREATED, "Item added to cart", addedCart);
    } catch (error) {
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, "Error adding item to cart", error.message);
    }
};

// Get all cart items for a user
exports.getUserCart = async (req, res) => {
    try {
        const cartItems = await getCart(req.user.id);
        if (!cartItems) {
            return errorResponse(req, res, status.NOT_FOUND, "Cart is empty");
        }
        return successResponse(req, res, status.OK, "Cart items fetched successfully", cartItems);
    } catch (error) {
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, "Error fetching cart items", error.message);
    }
};

// Delete a cart item
exports.deleteCartItem = async (req, res) => {
    try {
        const deletedCartItem = await deleteCart(req.params.cartItemId);

        if (!deletedCartItem) {
            return errorResponse(req, res, status.NOT_FOUND, "Cart item not found");
        }
        return successResponse(req, res, status.OK, "Cart item removed successfully");
    } catch (error) {
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, "Error deleting cart item", error.message);
    }
};

// Clear the entire cart for a user
exports.clearCart = async (req, res) => {
    try {
        const clearCart = await clearCart(req.user.id);
        if (!clearCart) {
            return errorResponse(req, res, status.BAD_REQUEST, "Clear Cart failed");
        }
        return successResponse(req, res, status.OK, "Cart cleared successfully");
    } catch (error) {
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, "Error clearing cart", error.message);
    }
};

// Increase quantity of a cart item
exports.increaseQuantity = async (req, res) => {
    try {
        const cartItem = await getCartById(req.params.id);
        if (!cartItem) {
            return errorResponse(req, res, status.NOT_FOUND, "Item not found");
        }

        cartItem.quantity += 1;
        cartItem.subTotal = cartItem.quantity * cartItem.price;
        await cartItem.save();

        const cartItems = await getCart(req.user.id);
        return successResponse(req, res, status.OK, "Quantity increased", cartItems);
    } catch (error) {
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Decrease quantity of a cart item
exports.decreaseQuantity = async (req, res) => {
    try {
        const cartItem = await getCartById(req.params.id);
        if (!cartItem) {
            return errorResponse(req, res, status.NOT_FOUND, "Item not found");
        }

        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
            cartItem.subTotal = cartItem.quantity * cartItem.price;
            await cartItem.save();
        }

        const cartItems = await getCart(req.user.id);
        return successResponse(req, res, status.OK, "Quantity decreased", cartItems);
    } catch (error) {
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, error.message);
    }
};

exports.removeItem = async (req, res) => {
    try {
        const removedItem = await removeItem(req.params.id);
        if (!removedItem) {
            return errorResponse(req, res, status.NOT_FOUND, "Item not found");
        }
        return successResponse(req, res, status.OK, "Item removed successfully");
    } catch (error) {
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, error.message);
    }
};

const Cart = require("../Model/Cart");
const cloudinary = require("../config/cloudinary");
const cartService = require("../Service/CartService");
const { errorResponse, successResponse } = require('../utils/apiResponse');
const { status } = require('http-status');
const { getCloudinaryPublicId, destroyImage } = require("../utils/upload");

exports.addToCart = async (req, res) => {
    try {
        const details = JSON.parse(req.body.details);
        const cartItem = {
            size: details.size || null,
            type: details.type || null,
            border: details.border || null,
            image: req.file.path || null,
            name: details.name || null,
            price: details.price || null,
            quantity: 1,
            user: req.user.id || null,
            thickness: details.thickness || null,
            subTotal: details.price
        };

        const addedCart = await cartService.addCart(cartItem);

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
        const cartItems = await cartService.getCart(req.user.id);
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
        const deletedCartItem = await cartService.deleteCart(req.params.cartItemId);

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
        const clearedCart = await cartService.clearUserCart(req.user.id);        
        if (!clearedCart) {
            return errorResponse(req, res, status.BAD_REQUEST, "Clear Cart failed");
        }
        return successResponse(req, res, status.OK, "Cart cleared successfully");
    } catch (error) {
        console.log(error);

        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Increase quantity of a cart item
exports.increaseQuantity = async (req, res) => {
    try {
        const cartItem = await cartService.getCartById(req.params.id);
        if (!cartItem) {
            return errorResponse(req, res, status.NOT_FOUND, "Item not found");
        }

        cartItem.quantity += 1;
        cartItem.subTotal = cartItem.quantity * cartItem.price;
        await cartItem.save();

        const cartItems = await cartService.getCart(req.user.id);
        return successResponse(req, res, status.OK, "Quantity increased", cartItems);
    } catch (error) {
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Decrease quantity of a cart item
exports.decreaseQuantity = async (req, res) => {
    try {
        const cartItem = await cartService.getCartById(req.params.id);
        if (!cartItem) {
            return errorResponse(req, res, status.NOT_FOUND, "Item not found");
        }

        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
            cartItem.subTotal = cartItem.quantity * cartItem.price;
            await cartItem.save();
        }

        const cartItems = await cartService.getCart(req.user.id);
        return successResponse(req, res, status.OK, "Quantity decreased", cartItems);
    } catch (error) {
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, error.message);
    }
};

exports.removeItem = async (req, res) => {
    try {
        const removedItem = await cartService.removeItem(req.params.id);
        if (!removedItem) {
            return errorResponse(req, res, status.NOT_FOUND, "Item not found");
        }

        return successResponse(req, res, status.OK, "Item removed successfully");
    } catch (error) {
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, error.message);
    }
};

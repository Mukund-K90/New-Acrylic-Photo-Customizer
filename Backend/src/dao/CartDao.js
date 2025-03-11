const Cart = require("../Model/Cart");

module.exports.addCart = async (cartData) => {
    try {
        const cart = new Cart(cartData);
        await cart.save();
        return cart;
    } catch (error) {
        throw error;
    }
}

module.exports.getCart = async (userId) => {
    try {
        return await Cart.find({ user: userId }).lean();
    } catch (error) {
        throw error;
    }
}

module.exports.deleteCart = async (id) => {
    try {
        return await Cart.findByIdAndDelete(id);
    } catch (error) {
        throw error;

    }
}

module.exports.clearCart = async (userId) => {
    try {
        return await Cart.deleteMany({ user: userId })
    } catch (error) {
        throw error;
    }
}

module.exports.getCartById = async (id) => {
    try {
        return await Cart.findById(id);
    } catch (error) {
        throw error;
    }
}
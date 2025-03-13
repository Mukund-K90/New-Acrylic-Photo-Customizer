const Cart = require("../Model/Cart");
const { getCloudinaryPublicId, destroyImage } = require("../utils/upload");

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

module.exports.clearUserCart = async (userId) => {
    try {
        const cartItems = await Cart.find({ user: userId });

        await Promise.all(
            cartItems
                .filter(item => item.image)
                .map(item => {
                    const publicId = getCloudinaryPublicId(item.image);
                    return publicId ? destroyImage(publicId) : null;
                })
        );
        return await Cart.deleteMany({ user: userId });

    } catch (error) {
        throw error;
    }
};


module.exports.getCartById = async (id) => {
    try {
        return await Cart.findById(id);
    } catch (error) {
        throw error;
    }
}

module.exports.removeItem = async (id) => {
    try {
        const removedItem = await Cart.findByIdAndDelete(id);
        if (removedItem.image) {
            const publicId = getCloudinaryPublicId(removedItem.image);
            if (publicId) await destroyImage(publicId);
        }
        return removedItem;
    }
    catch {
        throw error;
    }
}
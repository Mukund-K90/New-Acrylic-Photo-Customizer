const BillingDetails = require("../Model/BillingDetails");
const Cart = require("../Model/Cart");
const Products = require("../Model/Product");

const placeOrder = async (req, res) => {
    try {
        const { firstname, lastname, country, street_address, city, province, zipcode, phone, email, additional } = req.body;
        const userId = req.user.id;

        if (!firstname || !lastname || !country || !street_address || !city || !province || !zipcode || !phone || !email) {
            return res.status(400).json({ success: false, message: "Please fill all required fields!" });
        }

        const cartItems = await Cart.find({ user: userId });
        if (!cartItems.length) {
            return res.status(400).json({ success: false, message: "Cart is empty!" });
        }

        // Transfer cart items to Products collection
        const productsData = cartItems.map(item => ({
            image: item.image,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            user: item.user,
            type: item.type,
            border: item.border,
            size: item.size,
            thickness: item.thickness,
            address: item.address,
            subTotal: item.subTotal
        }));

        const savedProducts = await Products.insertMany(productsData);

        const order = new BillingDetails({
            firstname,
            lastname,
            country,
            street_address,
            city,
            province,
            zipcode,
            phone,
            email,
            additional,
            products: savedProducts.map(product => ({ productId: product._id })),
            total: cartItems.reduce((sum, item) => sum + item.subTotal, 0),
            userId,
        });

        await order.save();

        await Cart.deleteMany({ user: userId });

        return res.status(201).json({ success: true, message: "Order placed successfully!", order });
    } catch (error) {
        console.error("Error placing order:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getUserOrders=async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
}

module.exports = { placeOrder };

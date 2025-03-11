import {
    Box,
    Typography,
    Button,
    Divider,
    IconButton,
    Checkbox,
} from "@mui/material";
import { FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import useCartStore from "../manage/CartStore";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const CheckoutScreen = () => {
    const navigate = useNavigate();
    const { removeCart } = useCartStore();
    const [carts, setCart] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const token = localStorage.getItem("token");

    // Fetch Cart Data
    const fetchCart = async () => {
        try {
            const response = await axios.get(`${API_URL}/cart/get`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                setCart(response.data.data || []);
                setSelectedItems(response.data.data.map((item) => item._id) || []);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
            setCart([]);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Select/Deselect items
    const toggleSelectItem = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    // Increase quantity
    const increaseQuantity = async (id) => {
        try {
            const response = await axios.put(`${API_URL}/cart/increase/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                fetchCart();
            }
        } catch (error) {
            console.error("Error increasing quantity:", error);
        }
    };

    // Decrease quantity
    const decreaseQuantity = async (id) => {
        try {
            const response = await axios.put(`${API_URL}/cart/decrease/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                fetchCart(); // Refresh cart data
            }
        } catch (error) {
            console.error("Error decreasing quantity:", error);
        }
    };

    // Remove item from cart
    const removeItem = async (id) => {
        try {
            await axios.delete(`${API_URL}/cart/remove/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Update cart state
            const updatedCart = carts.filter((item) => item._id !== id);
            setCart(updatedCart);
            toast.success("Item removed from cart!");
            removeCart(id);
        } catch (error) {
            console.error("Error removing item:", error);
            toast.error("Failed to remove item.");
        }
    };


    // Clear entire cart
    const clearCart = async () => {
        try {
            await axios.delete(`${API_URL}/cart/clear`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setCart([]);
            localStorage.removeItem("cart");
            toast.success("Cart cleared!");
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    };

    const subtotal = carts.reduce((total, item) => total + item.subTotal, 0);

    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", p: 3, bgcolor: "#fff" }}>
            {/* Left: Cart Items */}
            <Box sx={{ width: "65%", pr: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                    Shopping Cart
                </Typography>

                {carts.length === 0 ? (
                    <Typography variant="h6" sx={{ color: "gray", mt: 2 }}>
                        🛒 Your cart is empty. Start shopping now!
                    </Typography>
                ) : (
                    <>
                        <Typography
                            variant="body2"
                            sx={{ color: "blue", cursor: "pointer", mb: 2 }}
                            onClick={() => setSelectedItems([])}
                        >
                            Deselect all items
                        </Typography>

                        {carts.map((item) => (
                            <Box
                                key={item._id}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    borderBottom: "1px solid #ddd",
                                    pb: 2,
                                    mb: 2,
                                }}
                            >
                                <Checkbox
                                    checked={selectedItems.includes(item._id)}
                                    onChange={() => toggleSelectItem(item._id)}
                                />
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    width={80}
                                    height={80}
                                    style={{ borderRadius: 8 }}
                                />

                                <Box sx={{ flex: 1, ml: 2 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                        {item.name}
                                    </Typography>
                                    <Typography variant="body2" color="green">
                                        In Stock
                                    </Typography>
                                    <Typography variant="body2">
                                        ₹{item.price.toLocaleString()}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <Button
                                        variant="outlined"
                                        sx={{ minWidth: 40, mr: 1, fontWeight: "bold" }}
                                        onClick={() => decreaseQuantity(item._id)}
                                    >
                                        -
                                    </Button>
                                    <Typography>{item.quantity}</Typography>
                                    <Button
                                        variant="outlined"
                                        sx={{ minWidth: 40, ml: 1, fontWeight: "bold" }}
                                        onClick={() => increaseQuantity(item._id)}
                                    >
                                        +
                                    </Button>
                                    <IconButton onClick={() => removeItem(item._id)}>
                                        <FaTrash />
                                    </IconButton>
                                </Box>
                            </Box>
                        ))}
                    </>
                )}
            </Box>

            {/* Right: Checkout Summary */}
            {carts.length > 0 && (
                <Box
                    sx={{
                        width: "30%",
                        p: 3,
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        bgcolor: "#f9f9f9",
                        height: "fit-content",
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        <span style={{ color: "green" }}>✔</span> Your order is eligible for FREE Delivery.
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 1, color: "gray" }}>
                        Choose FREE Delivery option at checkout.
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Subtotal ({selectedItems.length} items): ₹{subtotal.toLocaleString()}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                        <Checkbox />
                        <Typography variant="body2">This order contains a gift</Typography>
                    </Box>

                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            mt: 2,
                            bgcolor: "#0056B3",
                            color: "white",
                            fontWeight: "bold",
                            ":hover": { bgcolor: "#004494" },
                        }}
                        onClick={() => navigate("/checkout")}
                        disabled={selectedItems.length === 0}
                    >
                        Check Out
                    </Button>

                    <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        sx={{ mt: 2, fontWeight: "bold" }}
                        onClick={clearCart}
                    >
                        Clear Cart
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default CheckoutScreen;

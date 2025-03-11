import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
} from "@mui/material";
import axios from "axios";
import { toast } from "sonner";
import useCartStore from "../manage/CartStore";
const API_URL = import.meta.env.VITE_BACKEND_URL;

const CheckoutPage = () => {
    const { clearCart } = useCartStore();
    const [carts, setCart] = useState([]);
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        country: "Sri Lanka",
        street_address: "",
        city: "",
        province: "Western Province",
        zipcode: "",
        phone: "",
        email: "",
        additional: "",
    });
    const [paymentMethod, setPaymentMethod] = useState("bank");
    const [loading, setLoading] = useState(false);

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Validate Form Data
    const validateForm = () => {
        const requiredFields = ["firstname", "lastname", "street_address", "city", "zipcode", "phone", "email"];
        for (let field of requiredFields) {
            if (!formData[field]) {
                toast.error(`Please fill ${field.replace("_", " ")}`);
                return false;
            }
        }
        return true;
    };

    // Handle Place Order
    const handlePlaceOrder = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Step 1: Place the Order (Store Billing Data in DB)
            const billingResponse = await axios.post(`${API_URL}/billing/place-order`,
                { ...formData },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!billingResponse.data.success) {
                toast.error(billingResponse.data.message);
                setLoading(false);
                clearCart();
                return;
            }

            toast.success("Billing information stored successfully!");
            const totalAmount = billingResponse.data.order.total;
            const billingId = billingResponse.data.order._id;
            console.log(billingId);
            
            // Step 2: Create an Order for Payment
            const orderResponse = await axios.post(`${API_URL}/order/create`,
                { amount: totalAmount, billingId: billingId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                }
            );

            if (!orderResponse.data.success) {
                toast.error("Failed to create order.");
                setLoading(false);
                return;
            }
            console.log(orderResponse.data.data?.amount);

            const orderId = orderResponse.data.data?.id;
            const amount = orderResponse.data.data?.amount;

            const options = {
                key: "rzp_test_uzGTmLb6xkyeHP",
                amount: amount,
                currency: "INR",
                name: "furniro",
                image: "/Assets/Meubel House_Logos-05.png",
                description: "Purchase Order",
                order_id: orderId,
                handler: async function (response) {
                    console.log(`Payment ID: ${response.razorpay_payment_id}`);
                    console.log(`Order ID: ${response.razorpay_order_id}`);

                    try {
                        toast.success("Payment successful!");
                        clearCart();
                    } catch (error) {
                        console.error("Error handling response:", error);
                    }
                },
                prefill: {
                    name: `${formData.firstname} ${formData.lastname}`,
                    email: formData.email,
                    contact: formData.phone,
                },
                notes: { "address": "Razorpay Corporate Office" },
                theme: { color: "#3399cc" },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.on("payment.failed", function (response) {
                console.error("Payment Failed:", response.error);
                toast.error("Payment failed. Please try again.");
            });
            paymentObject.open();

        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };


    const fetchCart = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/cart/get`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            if (response.data.success) {
                setCart(response.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
            setCart([]);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);
    const subtotal = carts.reduce((total, item) => total + item.subTotal, 0);

    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", p: 4 }}>
            {/* Left: Billing Details */}
            <Box sx={{ width: "55%" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                    Billing details
                </Typography>

                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <TextField label="First Name" name="firstname" fullWidth onChange={handleChange} />
                    <TextField label="Last Name" name="lastname" fullWidth onChange={handleChange} />
                </Box>

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Country / Region</InputLabel>
                    <Select name="country" value={formData.country} onChange={handleChange}>
                        <MenuItem value="Sri Lanka">Sri Lanka</MenuItem>
                    </Select>
                </FormControl>

                <TextField label="Street Address" name="street_address" fullWidth sx={{ mb: 2 }} onChange={handleChange} />
                <TextField label="Town / City" name="city" fullWidth sx={{ mb: 2 }} onChange={handleChange} />

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Province</InputLabel>
                    <Select name="province" value={formData.province} onChange={handleChange}>
                        <MenuItem value="Western Province">Western Province</MenuItem>
                    </Select>
                </FormControl>

                <TextField label="ZIP Code" name="zipcode" fullWidth sx={{ mb: 2 }} onChange={handleChange} />
                <TextField label="Phone" name="phone" fullWidth sx={{ mb: 2 }} onChange={handleChange} />
                <TextField label="Email Address" name="email" fullWidth sx={{ mb: 2 }} onChange={handleChange} />
                <TextField label="Additional Information" name="additional" fullWidth sx={{ mb: 2 }} onChange={handleChange} />
            </Box>

            {/* Right: Order Summary */}
            {/* Right: Order Summary */}
            <Box sx={{ width: "40%", p: 3, border: "1px solid #ddd", borderRadius: "8px", bgcolor: "#f9f9f9" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                    Product <span style={{ float: "right" }}>Subtotal</span>
                </Typography>

                {carts.length > 0 ? (
                    carts.map((item) => (
                        <Box key={item._id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <img src={item.image} alt={item.name} width={60} style={{ borderRadius: "4px" }} />
                                <Typography>{item.name} × {item.quantity}</Typography>
                            </Box>

                            {/* Price */}
                            <Typography>Rs. {item.subTotal.toFixed(2)}</Typography>
                        </Box>
                    ))
                ) : (
                    <Typography sx={{ textAlign: "center", color: "gray", mb: 2 }}>Your cart is empty</Typography>
                )}
                <Typography sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                    Subtotal <span>Rs. {subtotal.toFixed(2)}</span>
                </Typography>

                <Typography sx={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", color: "#ff9800", fontSize: "1.2rem", mt: 1 }}>
                    Total <span>Rs. {subtotal.toFixed(2)}</span>
                </Typography>

                <Typography variant="body2" sx={{ color: "gray", mt: 2 }}>
                    Your personal data will be used to support your experience on this website, manage access to your account, and for other purposes described in our <span style={{ textDecoration: "underline", cursor: "pointer" }}>privacy policy</span>.
                </Typography>

                <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2, fontWeight: "bold", borderRadius: "4px", bgcolor: "#0056B3", color: "white" }}
                    onClick={handlePlaceOrder}
                    disabled={loading}
                >
                    {loading ? "Placing Order..." : "Place Order"}
                </Button>
            </Box>

        </Box>
    );
};

export default CheckoutPage;

import React, { useState } from "react";
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
            const response = await axios.post(`${API_URL}/billing/place-order`,
                { ...formData },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.data.success) {
                toast.success("Order placed successfully!");
                clearCart();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);

            toast.error("Failed to place order. Try again.");
        } finally {
            setLoading(false);
        }
    };

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
            <Box sx={{ width: "40%", p: 3, border: "1px solid #ddd", borderRadius: "8px", bgcolor: "#f9f9f9" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                    Product <span style={{ float: "right" }}>Subtotal</span>
                </Typography>

                <Typography sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    Agggard Sofa × 1 <span>Rs. 250,000.00</span>
                </Typography>

                <Typography sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    Subtotal <span>Rs. 250,000.00</span>
                </Typography>

                <Typography sx={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", color: "#ff9800", fontSize: "1.2rem" }}>
                    Total <span>Rs. 250,000.00</span>
                </Typography>

                {/* Payment Method */}
                <FormControl component="fieldset" sx={{ mt: 2 }}>
                    <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <FormControlLabel value="bank" control={<Radio />} label="Direct Bank Transfer" />
                        <Typography variant="body2" sx={{ color: "gray", mb: 2 }}>
                            Make your payment directly into our bank account. Please use your Order ID as the payment reference.
                        </Typography>
                        <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
                    </RadioGroup>
                </FormControl>

                <Typography variant="body2" sx={{ color: "gray", mb: 2 }}>
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

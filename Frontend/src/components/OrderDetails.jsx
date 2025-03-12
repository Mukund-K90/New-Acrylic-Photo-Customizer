import React, { lazy, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Grid,
    CircularProgress,
    Divider,
    Button,
} from "@mui/material";
import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const OrderDetails = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`${API_URL}/billing/${orderId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });

                if (response.data.success) {
                    setOrder(response.data.data);
                } else {
                    toast.error("Failed to fetch order details.");
                }
            } catch (error) {
                console.error("Error fetching order details:", error);
                toast.error("Error loading order details.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    const { order: orderData, paymentDetails } = order;

    return (
        <Box sx={{ maxWidth: "900px", margin: "auto", mt: 4, p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                Order Details
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
                Order placed{" "}
                {new Date(orderData.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                })}{" "}
                | Order number <strong>{orderData.orderNo}</strong>
            </Typography>

            {/* Shipping Address, Payment, and Summary in One Row */}
            <Card sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <Grid container spacing={7}>
                    <Grid item xs={12} md={5}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                            Shipping Address
                        </Typography>
                        <Typography>{orderData.firstname} {orderData.lastname}</Typography>
                        <Typography>{orderData.street_address}</Typography>
                        <Typography>{orderData.city}</Typography>
                        <Typography>{orderData.zipcode}</Typography>
                        <Typography>Phone: {orderData.phone}</Typography>
                        <Typography>Email: {orderData.email}</Typography>
                    </Grid>

                    {/* Payment Method */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                            Payment Methods
                        </Typography>
                        <Typography>{paymentDetails?.items[0]?.method?.toUpperCase() || "N/A"}</Typography>
                    </Grid>

                    {/* Order Summary */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                            Order Summary
                        </Typography>
                        <Typography>Item(s) Subtotal: ₹{orderData.total.toFixed(2)}</Typography>
                        <Typography>Shipping: ₹40.00</Typography>
                        <Typography>Total: ₹{(orderData.total + 40).toFixed(2)}</Typography>
                        <Typography sx={{ color: "green" }}>Promotion Applied: -₹40.00</Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Grand Total: ₹{orderData.total.toFixed(2)}
                        </Typography>
                    </Grid>
                </Grid>
            </Card>

            {/* Ordered Products Below */}
            {orderData.products.map((item) => (
                <Card key={item.productId._id} sx={{ mb: 2, display: "flex", alignItems: "center", p: 2 }}>
                    <CardMedia
                        component="img"
                        image={item.productId.image || "/placeholder.jpg"}
                        sx={{ width: 120, height: 120, objectFit: "cover", borderRadius: 2 }}
                    />
                    <CardContent sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ color: "#0073bb", cursor: "pointer" }}>
                            {item.productId.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "gray" }}>
                            Sold by: Acylic Image Customizer
                        </Typography>
                        <Typography sx={{ fontWeight: "bold" }}>₹{item.productId.price}</Typography>
                    </CardContent>
                </Card>
            ))}

        </Box>

    );
};

export default OrderDetails;

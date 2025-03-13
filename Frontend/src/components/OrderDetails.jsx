import React, { useEffect, useState } from "react";
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
    Stepper,
    Step,
    StepLabel,
    Button,
} from "@mui/material";
import { IoImages } from "react-icons/io5";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
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

    const statusSteps = ["Order Accepted", "Processing", "Order Completed"];
    const statusMapping = {
        "Pending": 0,
        "Processing": 1,
        "Completed": 2,
    };
    const activeStep = statusMapping[orderData.status] || 0;

    const CustomStepIcon = ({ active, completed }) => {
        return completed || activeStep == 2 ? (
            <CheckCircleIcon sx={{ color: "#0056B3" }} />
        ) : active ? (
            <IoImages color="#0056B3" size={'1.5rem'} />
        ) : (
            <RadioButtonUncheckedIcon sx={{ color: "gray" }} />
        );
    };

    const downloadInvoice = async (order, paymentDetails) => {
        const promise = new Promise((resolve, reject) => {
            fetch("http://localhost:8080/download-invoice", {
                method: "POST",
                body: JSON.stringify({ order, paymentDetails }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.blob())
                .then((blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `invoice-${order.orderNo}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });

        toast.promise(promise, {
            loading: 'Downloading invoice...',
            success: 'Invoice downloaded successfully!',
            error: 'Download failed. Please try again.',
        });
    };

    return (
        <>
            <Box sx={{ maxWidth: "100%", margin: "auto", mt: 4, p: 3 }}>
                {/* Amazon-like Status Tracker */}
                <Box sx={{ my: 3 }}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {statusSteps.map((label, index) => (
                            <Step key={label}>
                                <StepLabel StepIconComponent={CustomStepIcon}>
                                    {label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                    Order Details
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Order placed{" "}
                        {new Date(orderData.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })}{" "}
                        | Order number <strong>{orderData.orderNo} | {orderData.orderId}</strong>
                    </Typography>
                    <Button variant="text" sx={{ fontSize: "1rem", fontWeight: "bold", textDecoration: "underline" }} onClick={() => downloadInvoice(orderData, paymentDetails)}>Invoice</Button>
                </Box>


                {/* Shipping Address, Payment, and Summary */}
                <Card sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                    <Grid container spacing={10}>
                        <Grid item xs={12} md={5}>
                            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                                Billing Address
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

                {/* Ordered Products */}
                {orderData.products.map((item) => (
                    <Card key={item.productId._id} sx={{ mb: 2, display: "flex", alignItems: "center", p: 2 }}>
                        <CardMedia
                            component="img"
                            image={item.productId.image || "/placeholder.jpg"}
                            sx={{ width: 120,objectFit: "cover", borderRadius: 2 }}
                        />
                        <CardContent sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ color: "#0073bb" }}>
                                {item.productId.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "gray" }}>
                                Sold by: Acylic Image Customizer
                            </Typography>
                            <Typography sx={{ fontWeight: "bold" }}>₹{item.productId.price} x {item.productId.quantity}</Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
            
        </>
    );
};

export default OrderDetails;

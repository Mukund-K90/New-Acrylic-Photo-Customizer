import React, { forwardRef } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider } from "@mui/material";

const InvoicePDF = forwardRef(({ order, paymentDetails }, ref) => {
    if (!order || !paymentDetails) return <Typography>Loading...</Typography>;

    return (
        <Box 
            ref={ref}
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",  // Center vertically
                backgroundColor: "#f5f5f5", // Light background
                padding: "20px",
            }}
        >
            <Box 
                sx={{
                    maxWidth: "800px",
                    width: "100%",
                    backgroundColor: "#fff",
                    padding: "20px",
                    border: "1px solid #ddd",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Add shadow for a professional look
                    borderRadius: "8px", // Smooth edges
                }}
            >
                {/* Header */}
                <Box sx={{ textAlign: "center", mb: 2 }}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon Logo" width={150} />
                    <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>
                        Tax Invoice/Bill of Supply/Cash Memo
                    </Typography>
                </Box>

                {/* Seller & Billing Details */}
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Box>
                        <Typography variant="body2"><strong>Sold By:</strong></Typography>
                        <Typography variant="body2">R K Worldinfocom Pvt Ltd</Typography>
                        <Typography variant="body2">Renaissance Industrial Smart City, Kalyan Sape Road</Typography>
                        <Typography variant="body2">Thane, Maharashtra, 421302</Typography>
                        <Typography variant="body2">IN</Typography>
                    </Box>
                    <Box>
                        <Typography variant="body2"><strong>Billing Address:</strong></Typography>
                        <Typography variant="body2">{order.firstname} {order.lastname}</Typography>
                        <Typography variant="body2">{order.street_address}</Typography>
                        <Typography variant="body2">{order.city}, {order.zipcode}</Typography>
                        <Typography variant="body2">Phone: {order.phone}</Typography>
                    </Box>
                </Box>

                <Divider />

                {/* Order Info */}
                <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
                    <Box>
                        <Typography variant="body2"><strong>Order Number:</strong> {order.orderNo}</Typography>
                        <Typography variant="body2"><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="body2"><strong>Invoice Number:</strong> BOM5-435371</Typography>
                        <Typography variant="body2"><strong>Invoice Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</Typography>
                    </Box>
                </Box>

                {/* Product Table */}
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>SL No</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Unit Price</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Tax</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order.products.map((item, index) => (
                                <TableRow key={item.productId._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.productId.name}</TableCell>
                                    <TableCell>₹{item.productId.price}</TableCell>
                                    <TableCell>18% GST</TableCell>
                                    <TableCell>₹{(item.productId.price * 1.18).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Total */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    <Box sx={{ textAlign: "right" }}>
                        <Typography><strong>Total Amount:</strong> ₹{(order.total * 1.18).toFixed(2)}</Typography>
                        <Typography sx={{ fontSize: "14px", fontStyle: "italic", color: "gray" }}>
                            Amount in Words: One Thousand Five Hundred Ninety-Eight Rupees Only
                        </Typography>
                    </Box>
                </Box>

                {/* Payment Details */}
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2"><strong>Payment Method:</strong> {paymentDetails.items[0].method.toUpperCase()}</Typography>
                <Typography variant="body2"><strong>Transaction ID:</strong> {paymentDetails.items[0].id}</Typography>

                {/* Footer */}
                <Divider sx={{ my: 2 }} />
                <Typography sx={{ fontSize: "12px", textAlign: "center" }}>
                    This is a system-generated invoice. No signature is required.
                </Typography>
            </Box>
        </Box>
    );
});

export default InvoicePDF;

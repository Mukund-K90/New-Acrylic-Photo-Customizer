import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardMedia, CardContent, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_URL}/billing`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          toast.error("Failed to fetch orders.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Error loading orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "900px", margin: "auto", mt: 4, p: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Typography sx={{ textAlign: "center", color: "gray" }}>No orders found.</Typography>
      ) : (
        orders.map((order) => (
          <Card key={order._id} sx={{ mb: 3, border: "1px solid #ddd", borderRadius: 2 }}>
            <Box sx={{ display: "flex", p: 2, alignItems: "center" }}>
              {/* Product Image */}
              {order.products.length > 0 && order.products[0]?.productId?.image ? (
                <CardMedia
                  component="img"
                  image={order.products[0]?.productId?.image}
                  alt={order.products[0]?.productId?.name}
                  sx={{ width: 120, height: 120, borderRadius: 2, objectFit: "cover" }}
                />
              ) : (
                <CardMedia
                  component="img"
                  image="/placeholder.jpg"
                  alt="No Image"
                  sx={{ width: 120, height: 120, borderRadius: 2, objectFit: "cover" }}
                />
              )}

              {/* Order Details */}
              <CardContent sx={{ flex: 1, ml: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Order ID: {order.orderId}
                </Typography>
                <Typography variant="body1">
                  <strong>Product:</strong> {order.products[0]?.productId?.name || "Unknown Product"}
                </Typography>
                <Typography variant="body1">
                  <strong>Total:</strong> Rs. {order.total.toFixed(2)}
                </Typography>
                <Typography variant="body1">
                  <strong>Status:</strong> {order.status}
                </Typography>
                <Typography variant="body2" sx={{ color: "gray" }}>
                  Ordered on: {new Date(order.createdAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                    timeZone: "Asia/Kolkata"
                  })}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2, bgcolor: "#0056b3", color: "white" }}
                  onClick={() => navigate(`/order/${order._id}`)}
                >
                  View Details
                </Button>
              </CardContent>
            </Box>
          </Card>
        ))
      )}
    </Box>
  );
};

export default MyOrders;

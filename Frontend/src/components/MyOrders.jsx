import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
  Grid,
} from "@mui/material";
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
    <Box sx={{ maxWidth: "1000px", margin: "auto", mt: 4, p: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Typography sx={{ textAlign: "center", color: "gray" }}>
          No orders found.
        </Typography>
      ) : (
        orders.map((order) => (
          <Card
            key={order._id}
            sx={{
              mb: 3,
              border: "1px solid #ddd",
              borderRadius: 2,
              p: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Grid container spacing={2} alignItems="center">
              {/* Product Image */}
              <Grid item xs={3}>
                <CardMedia
                  component="img"
                  image={order.products[0]?.productId?.image || "/placeholder.jpg"}
                  alt={order.products[0]?.productId?.name}
                  sx={{ width: 120, height: 120, borderRadius: 2, objectFit: "contain" }}
                />
              </Grid>

              {/* Order Details */}
              <Grid item xs={9}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Order ID: {order.orderId}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Product:</strong> {order.products[0]?.productId?.name || "Unknown Product"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Price:</strong> ₹{order.total.toFixed(2)}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Status:</strong> {order.status}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "gray" }}>
                    Ordered on:{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      sx={{ bgcolor: "#FF9900", color: "white", mr: 1 }}
                      onClick={() => navigate(`/order/${order._id}`)}
                    >
                      View Order
                    </Button>
                    <Button variant="outlined">Buy Again</Button>
                  </Box>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        ))
      )}
    </Box>
  );
};

export default MyOrders;

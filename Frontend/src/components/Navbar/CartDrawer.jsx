import React, { useState, useEffect } from "react";
import { Drawer, Box, Typography, IconButton, List, Button } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { IoCloseCircle } from "react-icons/io5";
import { BsBagX } from "react-icons/bs";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ProductDetailsDialog from "../ProductDetailsDialog";
import useCartStore from "../../manage/CartStore";

const CartDrawer = ({ open, onClose }) => {
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { removeCart } = useCartStore()

  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  // Fetch cart data from API
  const fetchCart = async () => {
    try {
      console.log("FETCHED");

      const response = await axios.get(`${API_URL}/cart/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setCart(response.data.cartItems);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

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
      const updatedCart = cart.filter((item) => item._id !== id);
      setCart(updatedCart);

      toast.success("Item removed from cart!");
      removeCart(id);
      // const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      // const updatedStoredCart = storedCart.filter(item => item._id !== id);
      // localStorage.setItem("cart", JSON.stringify(updatedStoredCart));

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

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 450, display: "flex", flexDirection: "column", height: "100%" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              bgcolor: "white",
              borderBottom: "1px solid #ddd",
            }}
          >

            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>Your Cart</Typography>
              {!cart || cart.length !== 0 && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "red",
                    cursor: "pointer",
                    fontSize: "12px",
                    "&:hover": { textDecoration: "underline" },
                  }}
                  onClick={clearCart}
                >
                  Clear Cart
                </Typography>
              )}
            </Box>
            <IconButton onClick={onClose}>
              <BsBagX />
            </IconButton>
          </Box>


          {/* Cart Items */}
          {cart.length === 0 ? (
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Typography variant="body1">Your cart is empty.</Typography>
              <Button
                variant="contained"
                sx={{ mt: 2, bgcolor: "#0056B3", color: "white", fontWeight: "bold" }}
                onClick={() => {
                  navigate("/home");
                  onClose();
                }}
              >
                Personalize Now
              </Button>
            </Box>
          ) : (
            <List sx={{ flexGrow: 1, overflowY: "auto" }}>
              {cart.map((item) => (
                <Box key={item._id} sx={{ display: "flex", alignItems: "center", padding: "16px", borderBottom: "1px solid #ddd", position: "relative" }}>
                  {/* Product Image */}
                  <Box sx={{ width: "100px", height: "100px", borderRadius: "8px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", cursor: 'pointer' }}>
                    <img src={item.image} alt={item.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} onClick={() => { setSelectedItem(item); setDialogOpen(true); }} />
                  </Box>

                  {/* Product Details */}
                  <Box sx={{ flex: 1, marginLeft: "16px" }} >
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>{item.name}</Typography>
                    <Typography variant="body3" sx={{ color: "#0056B3", fontWeight: "bold", ml: 1 }}>
                      Rs. {item.price.toLocaleString() || "00"}.00
                    </Typography>

                    {/* Quantity Controls */}
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <IconButton size="small" onClick={() => decreaseQuantity(item._id)} sx={{ color: "#0056B3", borderRadius: "4px", p: 0.5 }}>
                        <Remove />
                      </IconButton>
                      <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                      <IconButton size="small" onClick={() => increaseQuantity(item._id)} sx={{ color: "#0056B3", borderRadius: "4px", p: 0.5 }}>
                        <Add />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Delete Button (X) */}
                  <IconButton size="small" onClick={() => removeItem(item._id)}>
                    <IoCloseCircle style={{ fontSize: "1.5rem" }} />
                  </IconButton>
                </Box>
              ))}
            </List>
          )}

          {/* Subtotal Section */}
          {cart.length > 0 && (
            <Box sx={{ p: 2, borderTop: "1px solid #ddd", textAlign: "left" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Subtotal: <span style={{ fontWeight: 'bold', color: "#0056B3" }}>Rs. {totalPrice.toLocaleString()}.00</span>
              </Typography>
            </Box>
          )}

          {/* Checkout Button */}
          {cart.length > 0 && (
            <Box sx={{ p: 2 }}>
              <Button variant="contained" sx={{ width: "100%", bgcolor: "#0056B3", color: "white", fontWeight: "bold" }}>
                Checkout
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>

      <ProductDetailsDialog open={dialogOpen} onClose={() => setDialogOpen(false)} productDetails={selectedItem} />
    </>
  );
};

export default CartDrawer;

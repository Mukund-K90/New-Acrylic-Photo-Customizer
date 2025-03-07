import React, { useContext, useState } from "react";
import { Drawer, Box, Typography, IconButton, List, Button } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { IoCloseCircle } from "react-icons/io5";
import { BsBagX } from "react-icons/bs";
import { CartContext } from "../CartContext";
import ProductDetailsDialog from "../ProductDetailsDialog";
import { useNavigate } from "react-router-dom";

const CartDrawer = ({ open, onClose }) => {
  const { cart, increaseQuantity, decreaseQuantity, removeItem } = useContext(CartContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const navigate = useNavigate();

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 450, display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Cart Header */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2, bgcolor: "white", borderBottom: "1px solid #ddd" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>Your Cart</Typography>
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
                <Box key={item.id} sx={{ display: "flex", alignItems: "center", padding: "16px", borderBottom: "1px solid #ddd", position: "relative" }}>
                  {/* Product Image */}
                  <Box sx={{ width: "100px", height: "100px", borderRadius: "8px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", cursor: 'pointer' }}>
                    <img src={item.image} alt={item.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} onClick={() => { setSelectedItem(item); setDialogOpen(true); }} />
                  </Box>

                  {/* Product Details */}
                  <Box sx={{ flex: 1, marginLeft: "16px" }} >
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>{item.name}</Typography>
                    <Typography variant="body3" sx={{ color: "#0056B3", fontWeight: "bold", ml: 1 }}>
                      Rs. {item.price.toLocaleString()}.00
                    </Typography>

                    {/* Quantity Controls */}
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <IconButton size="small" onClick={() => decreaseQuantity(item.id)} sx={{ color: "#0056B3", borderRadius: "4px", p: 0.5 }}>
                        <Remove />
                      </IconButton>
                      <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                      <IconButton size="small" onClick={() => increaseQuantity(item.id)} sx={{ color: "#0056B3", borderRadius: "4px", p: 0.5 }}>
                        <Add />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Delete Button (X) */}
                  <IconButton size="small" onClick={() => removeItem(item.id)}>
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

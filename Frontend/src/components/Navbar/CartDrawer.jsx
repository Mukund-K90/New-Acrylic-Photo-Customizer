import React, { useContext, useState } from "react";
import { Drawer, Box, Typography, IconButton, Button, List } from "@mui/material";
import { BsBagX } from "react-icons/bs";
import CartItem from "./CartItem";
import { CartContext } from "../CartContext";
import ProductDetailsDialog from "../ProductDetailsDialog";

export default function CartDrawer({ open, onClose }) {
  const { cart } = useContext(CartContext);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 450, display: "flex", flexDirection: "column", height: "100%" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", p: 2, borderBottom: "1px solid #ddd" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>Your Cart</Typography>
            <IconButton onClick={onClose}>
              <BsBagX />
            </IconButton>
          </Box>

          {cart.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>Your cart is empty.</Typography>
          ) : (
            <List sx={{ flexGrow: 1, overflowY: "auto" }}>
              {cart.map((item) => (
                <CartItem key={item.id} item={item} onClick={() => { setSelectedItem(item); setDialogOpen(true); }} />
              ))}
            </List>
          )}

          {cart.length > 0 && (
            <Box sx={{ p: 2, borderTop: "1px solid #ddd" }}>
              <Typography variant="h6">Subtotal: <span style={{ color: "#0056B3" }}>Rs. {totalPrice.toLocaleString()}.00</span></Typography>
              <Button variant="contained" sx={{ width: "100%", bgcolor: "#0056B3", color: "white", fontWeight: "bold" }}>Checkout</Button>
            </Box>
          )}
        </Box>
      </Drawer>
      
      <ProductDetailsDialog open={dialogOpen} onClose={() => setDialogOpen(false)} productDetails={selectedItem} />
    </>
  );
}

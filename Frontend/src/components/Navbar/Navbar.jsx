import React, { useState, useContext } from "react";
import { AppBar, Box, Toolbar, Typography, IconButton, Badge } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import CartDrawer from "./CartDrawer";
import { CartContext } from "../CartContext";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ backgroundColor: "#0056b3" }}>
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }} onClick={() => setSidebarOpen(true)}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={() => navigate("/")}>
            Acrylic Photos
          </Typography>

          <IconButton size="large" color="inherit" onClick={() => setCartOpen(true)}>
            <Badge badgeContent={cart.length} color="error">
              <RiShoppingBag3Fill />
            </Badge>
          </IconButton>

          <IconButton size="large" color="inherit" onClick={() => navigate("/profile")}>
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </Box>
  );
}

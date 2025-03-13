import React, { useEffect, useState } from "react";
import { AppBar, Box, Toolbar, Typography, IconButton, Badge, Menu, MenuItem, Divider, ListItemIcon } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import CartDrawer from "./CartDrawer";
import useCartStore from "../../manage/CartStore";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, SetUser] = useState(JSON.parse(localStorage.getItem('user')));

  const navigate = useNavigate();

  const carts = useCartStore((state) => state.carts);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const handleLogout = (path) => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate(path);
  }

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
            <Badge badgeContent={carts.length} color="error">
              <RiShoppingBag3Fill />
            </Badge>
          </IconButton>

          {/* Profile Icon with Dropdown Menu */}
          <IconButton size="large" color="inherit" onClick={handleMenuOpen}>
            <AccountCircle />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }} onClick={() => handleNavigate("/profile")}>
              <Typography sx={{ fontWeight: "bold", color: "black" }}>{user?.firstName || "Guest"} {user?.lastName[0] || ""}</Typography>
              <Typography variant="body2" sx={{ color: "blue", cursor: "pointer" }} >
                View Account
              </Typography>
            </MenuItem>

            <Divider />

            {/* My Orders */}
            <MenuItem onClick={() => handleNavigate("/my-orders")}>
              <ListItemIcon>
                <ShoppingBagIcon fontSize="small" />
              </ListItemIcon>
              Your Orders
            </MenuItem>

            {/* Cart */}
            <MenuItem onClick={() => handleNavigate("/cart")}>
              <ListItemIcon>
                <ShoppingCartIcon fontSize="small" />
              </ListItemIcon>
              Cart
            </MenuItem>

            <Divider />

            {/* Logout */}
            <MenuItem onClick={() => handleLogout("/")}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {cartOpen && <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />}
    </Box>
  );
}

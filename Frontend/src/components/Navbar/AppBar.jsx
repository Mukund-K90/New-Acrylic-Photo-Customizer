import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Badge,
  Divider,
  Button,
} from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { ListItemIcon } from "@mui/material";
import CropSquareIcon from "@mui/icons-material/CropSquare"; // Square
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye"; // Round
import RoundedCornerIcon from "@mui/icons-material/RoundedCorner"; // Round Corners
import SpaIcon from "@mui/icons-material/Spa"; // Leaf (Best match for a natural shape)

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { ExpandLess, ExpandMore, Add, Remove, Delete } from "@mui/icons-material";
import { FaOpencart } from "react-icons/fa6";
import { CartContext } from "../CartContext";
import ProductDetailsDialog from "../ProductDetailsDialog";

export default function MenuAppBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState({
    fridge: false,
    collage: false,
  });

  const { cart, increaseQuantity, decreaseQuantity, removeItem } = useContext(CartContext);



  const navigate = useNavigate();
  const location = useLocation();

  // Toggle Sidebar
  const toggleSidebar = (open) => () => setSidebarOpen(open);

  // Toggle Cart Drawer
  const toggleCart = (open) => () => setCartOpen(open);

  const handleMainMenuClick = (menu, path) => () => {
    navigate(path);
    setSubmenuOpen((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleNavigate = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // Load Cart from Local Storage on Component Mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    // setCart(storedCart);
  }, []);


  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const shapeData = {
    "round-corners": { label: "Round Corners", icon: <RoundedCornerIcon sx={{ color: "#007BFF" }} /> },
    "round": { label: "Round", icon: <PanoramaFishEyeIcon sx={{ color: "#007BFF" }} /> },
    "leaf": { label: "Leaf", icon: <SpaIcon sx={{ color: "#007BFF" }} /> },
    "square": { label: "Square", icon: <CropSquareIcon sx={{ color: "#007BFF" }} /> },
  };
  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        {/* App Bar */}
        <AppBar position="fixed" sx={{ backgroundColor: "#0056b3" }}>
          <Toolbar>
            {/* Menu Icon to Open Sidebar */}
            <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }} onClick={toggleSidebar(true)}>
              <MenuIcon />
            </IconButton>

            {/* Title */}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={() => handleNavigate("/")}>
              Acrylic Photos
            </Typography>

            {/* Cart Icon */}
            <IconButton size="large" color="inherit" onClick={toggleCart(true)}>
              <Badge badgeContent={cart.length} color="error">
                <RiShoppingBag3Fill />
              </Badge>
            </IconButton>

            {/* Profile Icon */}
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{ "& .MuiPaper-root": { width: "13%" } }} // Increased width
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>Logout</MenuItem>
              </Menu>

            </div>
          </Toolbar>
        </AppBar>

        {/* Sidebar (Drawer) */}
        <Drawer anchor="left" open={sidebarOpen} onClose={toggleSidebar(false)}>
          <Box sx={{ width: 280, display: "flex", flexDirection: "column" }}>
            {/* Drawer Header with Close Icon */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "end", }}>
              <IconButton onClick={toggleSidebar(false)} sx={{ color: "#007BFF" }}>
                <CloseIcon />
              </IconButton>
            </Box>

            <List>
              {/* HOME */}
              <ListItemButton
                onClick={() => handleNavigate("/")}
                sx={{
                  bgcolor: isActive("/") ? "#ddd" : "transparent",
                  "&:hover": { bgcolor: "#f0f0f0" },
                  borderLeft: isActive("/") ? "4px solid #007BFF" : "none",
                }}
              >
                <ListItemText primary="Home" />
                {/* <ListItemIcon><ImHome </ListItemIcon> */}
              </ListItemButton>
              {/* Sidebar Items */}
              <ListItemButton
                onClick={() => handleNavigate("/acrylic")}
                sx={{
                  bgcolor: isActive("/acrylic") ? "#ddd" : "transparent",
                  "&:hover": { bgcolor: "#f0f0f0" },
                  borderLeft: isActive("/acrylic") ? "4px solid #007BFF" : "none",
                }}
              >
                <ListItemText primary="Acrylic Photo" />
              </ListItemButton>
              <ListItemButton
                onClick={() => handleNavigate("/clear-acrylic")}
                sx={{
                  bgcolor: isActive("/clear-acrylic") ? "#ddd" : "transparent",
                  "&:hover": { bgcolor: "#f0f0f0" },
                  borderLeft: isActive("/clear-acrylic") ? "4px solid #007BFF" : "none",
                }}
              >
                <ListItemText primary="Clear Acrylic Photo" />
              </ListItemButton>
              {/* Fridge Magnets (With Submenu) */}
              <ListItemButton
                onClick={handleMainMenuClick("fridge", "/fridge-magnets")}
                sx={{
                  bgcolor: isActive("/fridge-magnets") ? "#ddd" : "transparent",
                  "&:hover": { bgcolor: "#f0f0f0" },
                  borderLeft: isActive("/fridge-magnets") ? "4px solid #007BFF" : "none",
                }}
              >
                <ListItemText primary="Fridge Magnets" />
                {submenuOpen.fridge ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={submenuOpen.fridge} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {Object.entries(shapeData).map(([type, { label, icon }]) => (
                    <ListItemButton
                      key={type}
                      sx={{
                        pl: 4,
                        bgcolor: isActive(`/customize/${type}`) ? "#ddd" : "transparent",
                        "&:hover": { bgcolor: "#f0f0f0" },
                        borderLeft: isActive(`/customize/${type}`) ? "4px solid #007BFF" : "none",
                      }}
                      onClick={() => handleNavigate(`/customize/${type}`)}
                    >
                      <ListItemIcon>{icon}</ListItemIcon>
                      <ListItemText primary={label} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
              {/* Acrylic Wall Clock */}
              <ListItemButton
                onClick={() => handleNavigate("/acrylic-wall-clock")}
                sx={{
                  bgcolor: isActive("/acrylic-wall-clock") ? "#ddd" : "transparent",
                  "&:hover": { bgcolor: "#f0f0f0" },
                  borderLeft: isActive("/acrylic-wall-clock") ? "4px solid #007BFF" : "none",
                }}
              >
                <ListItemText primary="Acrylic Wall Clock" />
              </ListItemButton>
              {/* Collage Acrylic Photo (With Submenu) */}
              <ListItemButton
                onClick={handleMainMenuClick("collage", "/collage-acrylic-photo")}
                sx={{
                  bgcolor: isActive("/collage-acrylic-photo") ? "#ddd" : "transparent",
                  "&:hover": { bgcolor: "#f0f0f0" },
                  borderLeft: isActive("/collage-acrylic-photo") ? "4px solid #007BFF" : "none",
                }}
              >
                <ListItemText primary="Collage Acrylic Photo" />
                {submenuOpen.collage ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={submenuOpen.collage} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {["2-pics", "5-pics", "8-pics"].map((type) => (
                    <ListItemButton
                      key={type}
                      sx={{
                        pl: 4,
                        bgcolor: isActive(`/colllage/${type}`) ? "#ddd" : "transparent",
                        "&:hover": { bgcolor: "#f0f0f0" },
                        borderLeft: isActive(`/colllage/${type}`) ? "4px solid #007BFF" : "none",
                      }}
                      onClick={() => handleNavigate(`/colllage/${type}`)}
                    >
                      <ListItemText primary={type} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </List>
          </Box>
        </Drawer>

        {/* Cart Drawer */}
        <Drawer anchor="right" open={cartOpen} onClose={toggleCart(false)}>
          <Box sx={{ width: 400, display: "flex", flexDirection: "column", height: "100%" }}>
            {/* Drawer Header with Close Icon */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2, bgcolor: "#0056B3", color: "white" }}>
              <Typography variant="h6">Your Cart</Typography>
              <IconButton onClick={toggleCart(false)} sx={{ color: "white" }}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Divider />

            {cart.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
                Your cart is empty.
              </Typography>
            ) : (
              <List sx={{ flexGrow: 1, overflowY: "auto" }}>
                {cart.map((item) => (
                  <Box key={item.id} sx={{ display: "flex", alignItems: "flex-start", padding: "16px", borderBottom: "1px solid #ddd" }}>

                    {/* 🖼 Product Image */}
                    <Box
                      sx={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "1px solid #ddd",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#fff",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </Box>


                    {/* 📄 Product Details */}
                    <Box sx={{ flex: 1, marginLeft: "16px" }}>
                      <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "16px" }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "green", fontWeight: "500", marginTop: "4px" }}>
                        In stock
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#888", marginTop: "4px" }}>
                        Eligible for FREE Shipping
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#555", marginTop: "4px" }}>
                        Price: ₹{item.price.toLocaleString()}
                      </Typography>

                      {/* 🟨 Quantity + Delete Options */}
                      <Box sx={{ display: "flex", justifyContent: 'flex-start' }}>
                        <Box sx={{ display: "flex", alignItems: "center", marginTop: "8px", padding: "4px 12px", border: "1px solid #ddd", borderRadius: "20px", width: "100px", justifyContent: "space-between" }}>
                          <IconButton size="small" onClick={() => decreaseQuantity(item.id)}>
                            <Remove />
                          </IconButton>
                          <Typography variant="body1">{item.quantity}</Typography>
                          <IconButton size="small" onClick={() => increaseQuantity(item.id)}>
                            <Add />
                          </IconButton>
                        </Box>
                        <IconButton size="small" onClick={() => removeItem(item.id)}>
                          <Delete color="error" />
                        </IconButton>
                      </Box>
                      <Typography
                        variant="outlined"
                        sx={{ borderBottom: '1px solid', cursor: 'pointer', marginTop: "8px", width: "100%", color: "#0056B3", borderColor: "#0056B3" }}
                        onClick={() => handleViewDetails(item)}
                      >
                        View Details
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </List>


            )}

            {/* Total Price */}
            <Box sx={{ p: 2, bgcolor: "#f8f8f8", textAlign: "center" }}>
              <Typography variant="h6">Total: ₹{totalPrice.toFixed(2)}</Typography>
            </Box>

            {/* Checkout Button */}
            {cart.length > 0 && (
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Button style={{ width: "100%" }} variant="contained" startIcon={<FaOpencart />}>
                  Checkout
                </Button>
              </Box>
            )}
          </Box>
        </Drawer>
      </Box>

      <ProductDetailsDialog open={dialogOpen} onClose={() => setDialogOpen(false)} productDetails={selectedItem} />

    </>
  );
}

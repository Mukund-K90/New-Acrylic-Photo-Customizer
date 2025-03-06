import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { IoCloseCircle } from "react-icons/io5";

const CartItem = ({ item, increaseQuantity, decreaseQuantity, removeItem, onViewDetails }) => {
    return (
        <Box sx={{ display: "flex", alignItems: "center", padding: "16px", borderBottom: "1px solid #ddd" }}>
            {/* Product Image */}
            <Box
                sx={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
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

            {/* Product Details */}
            <Box sx={{ flex: 1, marginLeft: "16px", cursor: "pointer" }} onClick={() => onViewDetails(item)}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>{item.name}</Typography>
                <Typography variant="body2" sx={{ color: "#0056B3", fontWeight: "bold", mt: 1 }}>
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

            {/* Delete Button */}
            <IconButton size="small" onClick={() => removeItem(item.id)}>
                <IoCloseCircle style={{ fontSize: "1.5rem" }} />
            </IconButton>
        </Box>
    );
};

export default CartItem;

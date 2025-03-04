import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    Typography,
    Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MdStraighten } from "react-icons/md";
import { FaShapes } from "react-icons/fa";
import { MdOutlineHeight } from "react-icons/md";
import { RxWidth } from "react-icons/rx";
import { RxBorderWidth } from "react-icons/rx";
import { TbBrandDatabricks } from "react-icons/tb";

const ProductDetailsDialog = ({ open, onClose, productDetails }) => {
    if (!productDetails) return null;
    console.log(productDetails);
    // const isCollagePhoto = productDetails.imageDetails?.name == "Acrylic Collage";

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            {/* Dialog Title with Close Icon */}
            <DialogTitle
                sx={{
                    bgcolor: "#0056B3",
                    color: "white",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 24px",
                }}
            >
                {productDetails.name} ({productDetails?.imageDetails?.size || "N/A"})
                <IconButton onClick={onClose} sx={{ color: "white" }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ padding: "24px" }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: "24px",
                        alignItems: "center",
                    }}
                >
                    {/* Product Image */}
                    <Box
                        sx={{
                            flex: "1",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <img
                            src={productDetails.image}
                            alt={productDetails.name}
                            style={{
                                maxWidth: "100%",
                                maxHeight: "400px",
                                borderRadius: "8px",
                                border: "1px solid #ddd",
                                padding: "8px",
                                background: "#fff",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            }}
                        />
                    </Box>

                    {/* Product Info */}
                    <Box sx={{ flex: "1", textAlign: "left" }}>
                        <Typography variant="h6" sx={{ color: "#D32F2F", fontWeight: "bold", mb: 2 }}>
                            Price: ₹{productDetails.price?.toLocaleString() || "N/A"} / unit
                        </Typography>

                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                            Quantity: {productDetails.quantity || "N/A"}
                        </Typography>

                        <Divider sx={{ mb: 2 }} />

                        {/* Dynamic Product Fields */}
                        {productDetails.imageDetails?.width && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: 1 }}>
                                <RxWidth style={{ color: "#1976D2" }} />
                                <Typography variant="body1">
                                    <strong>Width:</strong> {productDetails.imageDetails.width}
                                </Typography>
                            </Box>
                        )}

                        {productDetails.imageDetails?.height && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: 1 }}>
                                <MdOutlineHeight style={{ color: "#1976D2" }} />
                                <Typography variant="body1">
                                    <strong>Height:</strong> {productDetails.imageDetails.height}
                                </Typography>
                            </Box>
                        )}

                        {productDetails.imageDetails?.shape && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: 1 }}>
                                <FaShapes style={{ color: "#1976D2" }} />
                                <Typography variant="body1">
                                    <strong>Shape:</strong> {productDetails.imageDetails.shape}
                                </Typography>
                            </Box>
                        )}

                        {productDetails.imageDetails?.size && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: 1 }}>
                                <MdStraighten style={{ color: "#1976D2" }} />
                                <Typography variant="body1">
                                    <strong>Size:</strong> {productDetails.imageDetails.size}
                                </Typography>
                            </Box>
                        )}

                        {/* Display Border Color Box if Border Exists */}
                        {productDetails.imageDetails?.border && productDetails.imageDetails.border !== "none" && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: 1 }}>
                                <RxBorderWidth style={{ color: "#1976D2" }} />
                                <Typography variant="body1">
                                    <strong>Border:</strong>
                                </Typography>
                                <Box
                                    sx={{
                                        width: "20%",
                                        height: "10px",
                                        backgroundColor: productDetails.imageDetails?.border.split("solid ")[1],
                                    }}
                                />
                            </Box>
                        )}

                        {productDetails.imageDetails?.thickness && productDetails.imageDetails.thickness !== "none" && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: 1 }}>
                                <TbBrandDatabricks style={{ color: "#1976D2" }} />
                                <Typography variant="body1">
                                    <strong>Thickness:</strong> {productDetails.imageDetails.thickness}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ProductDetailsDialog;

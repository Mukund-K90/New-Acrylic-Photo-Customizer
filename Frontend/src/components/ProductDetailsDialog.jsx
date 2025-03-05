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
import StraightenIcon from "@mui/icons-material/Straighten"; // Size Icon
import CropSquareIcon from "@mui/icons-material/CropSquare"; // Shape Icon
import BorderColorIcon from "@mui/icons-material/BorderColor"; // Border Icon
import HeightIcon from "@mui/icons-material/Height"; // Height Icon
import WidthIcon from "@mui/icons-material/WidthFull"; // Width Icon

const ProductDetailsDialog = ({ open, onClose, item }) => {
    if (!item) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            {/* Dialog Title with Close Icon */}
            <DialogTitle
                sx={{
                    bgcolor: "#0056B3",
                    color: "white",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 24px",
                }}
            >
                {item.name} ({item.imageDetails.size})
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
                            src={item.image}
                            alt={item.name}
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
                        {/* <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                            {item.name} ({item.imageDetails.size})
                        </Typography> */}

                        <Typography
                            variant="h6"
                            sx={{ color: "#D32F2F", fontWeight: "bold", mb: 2 }}
                        >
                            Price: ₹{item.price.toLocaleString()}
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{ color: "#D32F2F", fontWeight: "bold", mb: 2 }}
                        >
                            Quty.: {item.quantity}
                        </Typography>


                        <Divider sx={{ mb: 2 }} />

                        {/* Product Details with Icons */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: 1 }}>
                            <WidthIcon sx={{ color: "#1976D2" }} />
                            <Typography variant="body1">
                                <strong>Width:</strong> {item.imageDetails.width}
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: 1 }}>
                            <HeightIcon sx={{ color: "#1976D2" }} />
                            <Typography variant="body1">
                                <strong>Height:</strong> {item.imageDetails.height}
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: 1 }}>
                            <CropSquareIcon sx={{ color: "#1976D2" }} />
                            <Typography variant="body1">
                                <strong>Shape:</strong> {item.imageDetails.shape}
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: 1 }}>
                            <StraightenIcon sx={{ color: "#1976D2" }} />
                            <Typography variant="body1">
                                <strong>Size:</strong> {item.imageDetails.size}
                            </Typography>
                        </Box>

                        {item.imageDetails.border && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: 1 }}>
                                <BorderColorIcon sx={{ color: "#1976D2" }} />
                                {/* <Typography variant="body1">
                                <strong>Border:</strong> {item.imageDetails.border}
                            </Typography> */}
                                <Box
                                    sx={{
                                        width: "5px",
                                        height: "5px",
                                        border: item.imageDetails.border,
                                        borderRadius: "4px",
                                    }}
                                />
                            </Box>
                        )}


                        {/* Added Text */}
                        {item.addedText?.length > 0 && (
                            <Typography variant="body1" sx={{ mt: 1 }}>
                                <strong>Added Text:</strong>{" "}
                                {item.addedText.map((textItem, index) => (
                                    <span key={index} style={{ color: textItem.color }}>
                                        {textItem.text}{" "}
                                    </span>
                                ))}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ProductDetailsDialog;

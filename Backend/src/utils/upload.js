const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "cart-images",
        format: async (req, file) => "png",
        public_id: (req, file) => `cart_${Date.now()}`,
    },
});

const upload = multer({ storage });

module.exports = upload;

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

const getCloudinaryPublicId = (imageUrl) => {
    const publicId = imageUrl.split("/upload/")[1].replace(/v\d+\//, "").replace(/\.[^/.]+$/, "");
    return publicId;
};

const destroyImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        
        if (result.result !== "ok") {
            console.error(`Failed to delete image: ${publicId}`);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error deleting Cloudinary image:", error);
        return false;
    }
};

const upload = multer({ storage });

module.exports = {
    upload,
    getCloudinaryPublicId,
    destroyImage
};

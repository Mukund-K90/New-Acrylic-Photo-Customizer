const multer = require('multer');
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, '..', "upload");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
// Configure Multer storage
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadDir); // Temporary folder for file storage
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Multer file filter (to validate file types)
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Unsupported file type!"), false);
    }
};

// Multer instance
exports.upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 },
})
    .fields(([
        { name: "image", maxCount: 1 },
    ]));

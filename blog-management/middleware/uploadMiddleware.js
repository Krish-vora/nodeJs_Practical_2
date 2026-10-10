const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { fileTypeFromBuffer } = require("file-type");

const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.memoryStorage();

const upload = multer({
    storage,

    limits: {
        fileSize: 2 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(
                new Error("Only JPEG, PNG and WEBP images are allowed")
            );
        }

        cb(null, true);
    }
});

const validateAndSaveImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image file is required"
            });
        }

        const detectedType = await fileTypeFromBuffer(req.file.buffer);

        const allowedTypes = {
            jpeg: "jpg",
            png: "png",
            webp: "webp"
        };

        if (
            !detectedType ||
            !allowedTypes[detectedType.ext]
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid image file"
            });
        }

        const extension = allowedTypes[detectedType.ext];

        const filename =
            crypto.randomUUID() + "." + extension;

        const filePath = path.join(uploadDir, filename);

        fs.writeFileSync(filePath, req.file.buffer);

        req.savedFile = `/uploads/${filename}`;

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    upload,
    validateAndSaveImage
};
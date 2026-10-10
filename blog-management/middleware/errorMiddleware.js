const errorHandler = (err, req, res, next) => {

    console.error(err);

    if (err instanceof SyntaxError) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON"
        });
    }

    if (err.message?.includes("Only JPEG")) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            success: false,
            message: "File size must not exceed 2MB"
        });
    }

    res.status(500).json({
        success: false,
        message: err.message || "Internal server error"
    });
};

module.exports = errorHandler;
const express = require("express");
const { body } = require("express-validator");

const {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    uploadPostImage
} = require("../controllers/postController");

const { protect } = require("../middleware/authMiddleware");

const validate = require("../middleware/validationMiddleware");

const {
    upload,
    validateAndSaveImage
} = require("../middleware/uploadMiddleware");

const router = express.Router();


// CREATE
router.post(
    "/",
    protect,

    [
        body("title")
            .trim()
            .isLength({ min: 3, max: 150 })
            .withMessage("Title must be between 3 and 150 characters"),

        body("content")
            .trim()
            .isLength({ min: 5 })
            .withMessage("Content is required")
    ],

    validate,
    createPost
);


// GET ALL
router.get(
    "/",
    protect,
    getPosts
);


// GET ONE
router.get(
    "/:id",
    protect,
    getPostById
);


// UPDATE
router.put(
    "/:id",
    protect,

    [
        body("title")
            .optional()
            .trim()
            .isLength({ min: 3, max: 150 })
            .withMessage("Invalid title"),

        body("content")
            .optional()
            .trim()
            .isLength({ min: 5 })
            .withMessage("Invalid content")
    ],

    validate,
    updatePost
);


// DELETE
router.delete(
    "/:id",
    protect,
    deletePost
);


// IMAGE
router.post(
    "/:id/image",
    protect,
    upload.single("image"),
    validateAndSaveImage,
    uploadPostImage
);

module.exports = router;
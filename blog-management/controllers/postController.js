const fs = require("fs");
const path = require("path");
const Post = require("../models/Post");

const deleteImageFile = (imagePath) => {
    if (!imagePath) {
        return;
    }

    const filename = path.basename(imagePath);
    const fullPath = path.join(
        __dirname,
        "..",
        "uploads",
        filename
    );

    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
    }
};

const canModifyPost = (post, user) => {
    return (
        post.author.toString() === user.id.toString() ||
        user.role === "admin"
    );
};


// CREATE
const createPost = async (req, res, next) => {
    try {
        let {
            title,
            content,
            tags,
            published
        } = req.body;

        if (typeof tags === "string") {
            tags = tags
                .split(",")
                .map(tag => tag.trim())
                .filter(Boolean);
        }

        const post = await Post.create({
            title,
            content,
            tags: tags || [],
            published: published === true || published === "true",
            author: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            post
        });
    } catch (error) {
        next(error);
    }
};


// GET ALL USER POSTS
const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find({
            author: req.user.id
        })
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: posts.length,
            posts
        });
    } catch (error) {
        next(error);
    }
};


// GET ONE
const getPostById = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("author", "name email");

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // User can see own post, admin can see everything
        if (
            post.author._id.toString() !== req.user.id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this post"
            });
        }

        res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        next(error);
    }
};


// UPDATE
const updatePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        if (!canModifyPost(post, req.user)) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this post"
            });
        }

        const {
            title,
            content,
            tags,
            published
        } = req.body;

        if (title !== undefined) {
            post.title = title;
        }

        if (content !== undefined) {
            post.content = content;
        }

        if (tags !== undefined) {
            post.tags =
                typeof tags === "string"
                    ? tags.split(",").map(t => t.trim()).filter(Boolean)
                    : tags;
        }

        if (published !== undefined) {
            post.published =
                published === true ||
                published === "true";
        }

        await post.save();

        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            post
        });
    } catch (error) {
        next(error);
    }
};


// DELETE
const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        if (!canModifyPost(post, req.user)) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this post"
            });
        }

        deleteImageFile(post.image);

        await post.deleteOne();

        res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};


// IMAGE UPLOAD
const uploadPostImage = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            if (req.savedFile) {
                deleteImageFile(req.savedFile);
            }

            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        if (!canModifyPost(post, req.user)) {
            if (req.savedFile) {
                deleteImageFile(req.savedFile);
            }

            return res.status(403).json({
                success: false,
                message: "You are not authorized to upload image"
            });
        }

        // Delete old image
        deleteImageFile(post.image);

        post.image = req.savedFile;

        await post.save();

        res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            image: post.image,
            post
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    uploadPostImage
};
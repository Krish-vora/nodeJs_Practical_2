const Post = require("../models/Post");

const showLogin = (req, res) => {
    res.render("login", {
        error: null
    });
};

const showPosts = async (req, res, next) => {
    try {
        const posts = await Post.find({
            published: true
        })
            .populate("author", "name")
            .sort({ createdAt: -1 });

        res.render("posts", {
            posts
        });
    } catch (error) {
        next(error);
    }
};

const showDashboard = async (req, res, next) => {
    try {
        const posts = await Post.find({
            author: req.user.id
        }).sort({ createdAt: -1 });

        res.render("dashboard", {
            posts,
            user: req.user
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    showLogin,
    showPosts,
    showDashboard
};
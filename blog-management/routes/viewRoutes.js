
const express = require("express");

const {
    showLogin,
    showPosts,
    showDashboard
} = require("../controllers/viewController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/login", showLogin);

router.get("/posts", showPosts);

router.get("/dashboard", protect, showDashboard);

module.exports = router;
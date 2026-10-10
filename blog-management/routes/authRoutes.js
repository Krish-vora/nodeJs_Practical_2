const express = require("express");
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");

const {
    register,
    login,
    profile
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");

const router = express.Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "Too many authentication attempts. Try again later."
    }
});


// REGISTER
router.post(
    "/register",
    authLimiter,

    [
        body("name")
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage("Name must be between 2 and 50 characters"),

        body("email")
            .trim()
            .isEmail()
            .withMessage("Valid email required")
            .normalizeEmail(),

        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must contain at least 6 characters")
    ],

    validate,
    register
);


// LOGIN
router.post(
    "/login",
    authLimiter,

    [
        body("email")
            .trim()
            .isEmail()
            .withMessage("Valid email required")
            .normalizeEmail(),

        body("password")
            .notEmpty()
            .withMessage("Password is required")
    ],

    validate,
    login
);


// PROFILE
router.get(
    "/profile",
    protect,
    profile
);

module.exports = router;
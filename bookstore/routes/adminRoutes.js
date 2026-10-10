
const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/roleMiddleware");

router.get(
    "/inventory",
    verifyToken,
    adminOnly,
    (req, res) => {
        res.json({
            message: "Welcome to the admin inventory dashboard.",
            inventory: []
        });
    }
);

module.exports = router;

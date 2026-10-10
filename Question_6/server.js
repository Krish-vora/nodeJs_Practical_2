
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const Order = require("./models/Order");
const verifyToken = require("./middleware/authMiddleware");

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB error:", err));

// Cancel an order: customer who owns it OR admin
app.delete("/api/orders/:id", verifyToken, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid order ID."
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found."
            });
        }

        const isOwner =
            order.customerId.toString() === req.user.id;

        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                message: "Forbidden. You cannot cancel this order."
            });
        }

        if (order.status === "shipped") {
            return res.status(400).json({
                message: "Shipped orders cannot be cancelled."
            });
        }

        if (order.status === "cancelled") {
            return res.status(400).json({
                message: "Order is already cancelled."
            });
        }

        order.status = "cancelled";
        await order.save();

        return res.json({
            message: "Order cancelled successfully.",
            order: {
                id: order._id,
                bookName: order.bookName,
                status: order.status
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error."
        });
    }
});

app.listen(process.env.PORT || 5000, () => {
    console.log("Server running on port 5000");
});

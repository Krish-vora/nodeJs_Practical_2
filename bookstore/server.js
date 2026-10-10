require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Customer = require("./models/Customer");
const verifyToken = require("./authMiddleware");

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB error:", err));

// Customer signup
app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        const existing = await Customer.findOne({ email });

        if (existing) {
            return res.status(409).json({
                message: "Email already registered."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await Customer.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Customer registered successfully."
        });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

// Customer login and JWT generation
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const customer = await Customer.findOne({ email });

        if (!customer ||
            !(await bcrypt.compare(password, customer.password))) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            {
                id: customer._id,
                email: customer.email
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
        );

        res.json({
            message: "Login successful.",
            token: token
        });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

// Protected route: view customer orders
app.get("/orders", verifyToken, (req, res) => {
    res.json({
        message: "Access granted. Customer orders can be viewed.",
        customerId: req.customer.id
    });
});

// Protected route: place an order
app.post("/orders", verifyToken, (req, res) => {
    res.json({
        message: "Token verified. Order request accepted.",
        customerId: req.customer.id
    });
});

app.listen(process.env.PORT || 5000, () => {
    console.log("Server running on port 5000");
});
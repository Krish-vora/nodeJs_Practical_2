
require("dotenv").config();

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Order = require("./models/Order");

const customer1 = "64b000000000000000000001";
const customer2 = "64b000000000000000000002";
const order1 = "65a000000000000000000001";
const order2 = "65a000000000000000000002";

async function setup() {
    await mongoose.connect(process.env.MONGO_URI);

    await Order.findOneAndUpdate(
        { _id: order1 },
        {
            $set: {
                customerId: new mongoose.Types.ObjectId(customer1),
                bookName: "Node.js Guide",
                quantity: 1,
                status: "pending"
            }
        },
        { upsert: true, new: true }
    );

    await Order.findOneAndUpdate(
        { _id: order2 },
        {
            $set: {
                customerId: new mongoose.Types.ObjectId(customer2),
                bookName: "Express.js Handbook",
                quantity: 2,
                status: "pending"
            }
        },
        { upsert: true, new: true }
    );

    console.log("Demo orders created/reset.");
    console.log("Order 1:", order1);
    console.log("Order 2:", order2);

    console.log("\nCustomer 1 token:\n", jwt.sign(
        { id: customer1, role: "customer" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    ));

    console.log("\nCustomer 2 token:\n", jwt.sign(
        { id: customer2, role: "customer" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    ));

    console.log("\nAdmin token:\n", jwt.sign(
        { id: "64b000000000000000000003", role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    ));

    await mongoose.disconnect();
}

setup().catch(async error => {
    console.error(error);
    await mongoose.disconnect();
    process.exitCode = 1;
});


const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    bookName: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        default: 1
    },

    status: {
        type: String,
        enum: ["pending", "shipped", "cancelled"],
        default: "pending"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);

const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 150
        },

        content: {
            type: String,
            required: true,
            trim: true
        },

        tags: {
            type: [String],
            default: []
        },

        published: {
            type: Boolean,
            default: false
        },

        image: {
            type: String,
            default: null
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Post", postSchema);
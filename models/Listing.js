const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
    {
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            default: ""
        },

        category: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        condition: {
            type: String,
            default: "Good"
        },

        image: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: ["available", "sold"],
            default: "available"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Listing", listingSchema);
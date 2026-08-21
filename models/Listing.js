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

        department: {
            type: String,
            default: "Any"
        },

        semester: {
            type: String,
            default: "Any"
        },

        price: {
            type: Number,
            required: true
        },

        condition: {
            type: String,
            enum: ["new", "good", "fair"],
            default: "good"
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
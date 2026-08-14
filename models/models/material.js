const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
    {
        uploader: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true
        },

        subject: {
            type: String,
            required: true
        },

        type: {
            type: String,
            default: "Notes"
        },

        link: {
            type: String,
            default: "#"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Material", materialSchema);
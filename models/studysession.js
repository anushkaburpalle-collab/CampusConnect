const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema(
    {
        creator: {
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

        description: {
            type: String,
            default: ""
        },

        date: {
            type: String,
            required: true
        },

        time: {
            type: String,
            required: true
        },

        location: {
            type: String,
            default: "Library"
        },

        maxMembers: {
            type: Number,
            default: 5
        },

        participants: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("StudySession", studySessionSchema);
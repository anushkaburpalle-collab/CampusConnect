const mongoose = require("mongoose");

const studyProfileSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        subjects: [{
            type: String
        }],

        department: {
            type: String,
            default: "Any"
        },

        semester: {
            type: String,
            default: "Any"
        },

        examDate: {
            type: Date
        },

        preparationLevel: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
            default: "Intermediate"
        },

        studyPace: {
            type: String,
            enum: ["Slow", "Medium", "Fast"],
            default: "Medium"
        },

        availability: {
            type: String,
            default: "Evenings"
        },

        studyMode: {
            type: String,
            default: "Offline"
        },

        matchScore: {
            type: Number,
            default: 0
        },

        sessionsCompleted: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("StudyProfile", studyProfileSchema);
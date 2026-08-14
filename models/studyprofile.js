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

        preparationLevel: {
            type: String,
            default: "Intermediate"
        },

        availability: {
            type: String,
            default: "Evenings"
        },

        studyMode: {
            type: String,
            default: "Offline"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("StudyProfile", studyProfileSchema);
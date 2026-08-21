const express = require("express");
const StudyProfile = require("../models/StudyProfile");

const router = express.Router();

// Calculate match score based on compatibility
function calculateMatchScore(userProfile, candidateProfile) {
    let score = 0;

    // Same subject: +40
    if (userProfile.subjects && candidateProfile.subjects) {
        const commonSubjects = userProfile.subjects.filter(s => candidateProfile.subjects.includes(s));
        if (commonSubjects.length > 0) {
            score += 40;
        }
    }

    // Same department: +20
    if (userProfile.department && candidateProfile.department && userProfile.department !== "Any" && candidateProfile.department !== "Any") {
        if (userProfile.department === candidateProfile.department) {
            score += 20;
        }
    }

    // Same semester: +15
    if (userProfile.semester && candidateProfile.semester && userProfile.semester !== "Any" && candidateProfile.semester !== "Any") {
        if (userProfile.semester === candidateProfile.semester) {
            score += 15;
        }
    }

    // Similar preparation level: +15
    if (userProfile.preparationLevel && candidateProfile.preparationLevel) {
        if (userProfile.preparationLevel === candidateProfile.preparationLevel) {
            score += 15;
        }
    }

    // Similar study pace: +10
    if (userProfile.studyPace && candidateProfile.studyPace) {
        if (userProfile.studyPace === candidateProfile.studyPace) {
            score += 10;
        }
    }

    return Math.min(score, 100); // Cap at 100
}

// GET /api/study-buddies/matches/:userId - Get compatible study buddies
router.get("/matches/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        // Get the user's study profile
        const userProfile = await StudyProfile.findOne({ student: userId }).populate("student", "name email");

        if (!userProfile) {
            return res.status(404).json({
                success: false,
                message: "Study profile not found for this user"
            });
        }

        // Get all other profiles
        const allProfiles = await StudyProfile.find({ student: { $ne: userId } }).populate("student", "name email");

        // Calculate match scores for each profile
        const matches = allProfiles.map(profile => {
            const matchScore = calculateMatchScore(userProfile, profile);
            return {
                _id: profile._id,
                student: profile.student,
                subjects: profile.subjects,
                department: profile.department,
                semester: profile.semester,
                preparationLevel: profile.preparationLevel,
                studyPace: profile.studyPace,
                sessionsCompleted: profile.sessionsCompleted,
                matchScore
            };
        });

        // Sort by match score (descending) and return top matches
        const topMatches = matches
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 10);

        res.json({
            success: true,
            data: topMatches
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;

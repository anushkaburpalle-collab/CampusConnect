const express = require("express");

const StudyProfile = require("../models/StudyProfile");
const StudySession = require("../models/StudySession");
const auth = require("../middleware/auth");

const router = express.Router();


// GET STUDY PROFILES
router.get("/profiles", async (req, res) => {
    try {

        const profiles = await StudyProfile.find()
            .populate("student", "name branch year");

        res.json(profiles);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// CREATE STUDY PROFILE
router.post("/profiles", auth, async (req, res) => {
    try {

        const profile = await StudyProfile.findOneAndUpdate(
            { student: req.user.id },
            {
                ...req.body,
                student: req.user.id
            },
            {
                new: true,
                upsert: true
            }
        );

        res.json(profile);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// GET STUDY SESSIONS
router.get("/sessions", async (req, res) => {
    try {

        const sessions = await StudySession.find()
            .populate("creator", "name branch")
            .populate("participants", "name")
            .sort({ createdAt: -1 });

        res.json(sessions);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// CREATE SESSION
router.post("/sessions", auth, async (req, res) => {
    try {

        const session = await StudySession.create({
            ...req.body,
            creator: req.user.id,
            participants: [req.user.id]
        });

        res.status(201).json(session);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// JOIN SESSION
router.post("/sessions/:id/join", auth, async (req, res) => {
    try {

        const session = await StudySession.findById(
            req.params.id
        );

        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        if (
            session.participants.some(
                id => id.toString() === req.user.id
            )
        ) {
            return res.json({
                message: "Already joined"
            });
        }

        if (
            session.participants.length >= session.maxMembers
        ) {
            return res.status(400).json({
                message: "Session is full"
            });
        }

        session.participants.push(req.user.id);

        await session.save();

        res.json({
            message: "Joined study session"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
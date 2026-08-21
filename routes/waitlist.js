const express = require("express");
const Waitlist = require("../models/Waitlist");

const router = express.Router();

// POST /api/waitlist - Submit email to waitlist
router.post("/", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        // Check if email already exists
        const existingEntry = await Waitlist.findOne({ email: email.toLowerCase() });
        if (existingEntry) {
            return res.status(400).json({
                success: false,
                message: "Email already on waitlist"
            });
        }

        // Add to waitlist
        const entry = await Waitlist.create({ email });

        res.status(201).json({
            success: true,
            message: "Successfully added to waitlist!",
            data: { email: entry.email, createdAt: entry.createdAt }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// GET /api/waitlist - Get waitlist count (optional, for stats)
router.get("/count", async (req, res) => {
    try {
        const count = await Waitlist.countDocuments();
        res.json({
            success: true,
            count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;

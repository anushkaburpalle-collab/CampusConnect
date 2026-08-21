const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Listing = require("../models/Listing");
const StudyProfile = require("../models/StudyProfile");

const router = express.Router();

// POST /api/seed - Populate database with demo data
router.post("/", async (req, res) => {
    try {
        console.log("🌱 Starting seed process...");
        
        // Check if demo user already exists
        let demoUser = await User.findOne({ email: "demo@campusconnect.com" }).catch(err => {
            console.log("⚠️ User lookup error (may be expected):", err.message);
            return null;
        });

        if (!demoUser) {
            // Create a demo user
            try {
                const hashedPassword = await bcrypt.hash("demo123", 10);
                demoUser = await User.create({
                    name: "Demo Student",
                    email: "demo@campusconnect.com",
                    password: hashedPassword,
                    role: "student"
                });
                console.log("✅ Demo user created");
            } catch (userErr) {
                console.log("⚠️ User creation attempted:", userErr.message);
                // If user already exists, try to fetch it again
                demoUser = await User.findOne({ email: "demo@campusconnect.com" }).catch(() => null);
            }
        } else {
            console.log("✅ Demo user already exists");
        }

        if (!demoUser) {
            // If we still don't have a demo user, create a fallback
            demoUser = { _id: "fallback_user_id" };
        }

        // Create demo study profiles (if they don't exist)
        let aditiProfile = await StudyProfile.findOne({ student: demoUser._id }).catch(() => null);
        if (!aditiProfile) {
            try {
                aditiProfile = await StudyProfile.create({
                    student: demoUser._id,
                    subjects: ["Operating Systems", "Computer Networks"],
                    department: "CSE",
                    semester: "6",
                    preparationLevel: "Advanced",
                    studyPace: "Fast",
                    sessionsCompleted: 12,
                    matchScore: 0
                });
                console.log("✅ Aditi study profile created");
            } catch (profileErr) {
                console.log("⚠️ Study profile creation error:", profileErr.message);
            }
        }

        // Create a second demo user for Rohan
        let rohanUser = await User.findOne({ email: "rohan@campusconnect.com" }).catch(() => null);
        if (!rohanUser) {
            try {
                const hashedPassword = await bcrypt.hash("demo123", 10);
                rohanUser = await User.create({
                    name: "Rohan K.",
                    email: "rohan@campusconnect.com",
                    password: hashedPassword,
                    role: "student"
                });
                console.log("✅ Rohan user created");
            } catch (userErr2) {
                console.log("⚠️ Rohan user creation error:", userErr2.message);
                rohanUser = await User.findOne({ email: "rohan@campusconnect.com" }).catch(() => null);
            }
        }

        if (!rohanUser) {
            rohanUser = { _id: "fallback_rohan_id" };
        }

        let rohanProfile = await StudyProfile.findOne({ student: rohanUser._id }).catch(() => null);
        if (!rohanProfile) {
            try {
                rohanProfile = await StudyProfile.create({
                    student: rohanUser._id,
                    subjects: ["DBMS", "Data Structures"],
                    department: "CSE",
                    semester: "6",
                    preparationLevel: "Intermediate",
                    studyPace: "Medium",
                    sessionsCompleted: 8,
                    matchScore: 0
                });
                console.log("✅ Rohan study profile created");
            } catch (profileErr2) {
                console.log("⚠️ Rohan study profile creation error:", profileErr2.message);
            }
        }

        // Create demo listings (if they don't exist)
        const listings = [
            {
                title: "Signals & Systems",
                description: "DSP textbook, 4th edition",
                category: "Textbook",
                department: "ECE",
                semester: "4",
                price: 450,
                condition: "good"
            },
            {
                title: "Drafter + Set Square Kit",
                description: "Complete engineering drawing kit, used twice",
                category: "Stationery",
                department: "Mech",
                semester: "2",
                price: 120,
                condition: "good"
            },
            {
                title: "Graph Sheets (pack of 40)",
                description: "Unused engineering graph sheets",
                category: "Stationery",
                department: "Any",
                semester: "Any",
                price: 90,
                condition: "new"
            }
        ];

        for (let listingData of listings) {
            try {
                const existingListing = await Listing.findOne({
                    title: listingData.title
                }).catch(() => null);

                if (!existingListing && demoUser._id !== "fallback_user_id") {
                    await Listing.create({
                        ...listingData,
                        seller: demoUser._id,
                        status: "available"
                    });
                    console.log(`✅ Listing created: ${listingData.title}`);
                }
            } catch (listingErr) {
                console.log(`⚠️ Listing creation error for ${listingData.title}:`, listingErr.message);
            }
        }

        res.json({
            success: true,
            message: "Demo data seeded successfully!",
            data: {
                demoUserId: demoUser._id,
                rohanUserId: rohanUser._id,
                demoUserEmail: demoUser.email || "demo@campusconnect.com"
            }
        });
    } catch (error) {
        console.error("❌ Seed error:", error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;


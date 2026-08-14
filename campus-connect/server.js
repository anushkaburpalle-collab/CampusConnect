const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
    path: path.join(__dirname, ".env")
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Check environment variables
console.log("Environment loaded");
console.log("PORT:", process.env.PORT);
console.log("MongoDB URI exists:", !!process.env.MONGO_URI);

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected successfully");

        // Start server only after MongoDB connects
        app.listen(process.env.PORT || 5000, () => {
            console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`);
        });
    })
    .catch((error) => {
        console.error("❌ MongoDB connection failed:");
        console.error(error.message);
    });

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "CampusConnect backend is running 🚀"
    });
});
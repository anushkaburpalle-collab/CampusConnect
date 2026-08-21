const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/test", (req, res) => {
    res.json({
        message: "Campus Connect API is working 🚀"
    });
});

let connected = false;

async function connectDB() {
    if (connected) return;

    await mongoose.connect(process.env.MONGO_URI);
    connected = true;
}

module.exports = async (req, res) => {
    try {
        await connectDB();
        return app(req, res);
    } catch (error) {
        console.error("MongoDB Error:", error.message);
        return res.status(500).json({
            error: "Database connection failed",
            message: error.message
        });
    }
};
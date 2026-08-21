const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({
    path: require("path").join(__dirname, ".env")
});
console.log("Environment loaded");
console.log("MongoDB URI exists:", !!process.env.MONGO_URI);

const connectDB = require("./config/db");
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/api/test", (req, res) => {
    res.json({
        message: "Campus Connect API is working 🚀"
    });
});

// Route mounting
app.use("/api/auth", require("./routes/auth"));
app.use("/api/listing", require("./routes/listing"));
app.use("/api/study", require("./routes/study"));
app.use("/api/study-buddies", require("./routes/matching"));
app.use("/api/waitlist", require("./routes/waitlist"));
app.use("/api/seed", require("./routes/seed"));

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error("❌ Error:", err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error"
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

const PORT = process.env.PORT || 5000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

module.exports = app;
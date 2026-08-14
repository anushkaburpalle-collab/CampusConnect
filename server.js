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

app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
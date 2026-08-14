const express = require("express");

const Material = require("../models/Material");
const auth = require("../middleware/auth");

const router = express.Router();


// GET MATERIALS
router.get("/", async (req, res) => {
    try {

        const materials = await Material.find()
            .populate("uploader", "name branch")
            .sort({ createdAt: -1 });

        res.json(materials);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// UPLOAD MATERIAL
router.post("/", auth, async (req, res) => {
    try {

        const material = await Material.create({
            ...req.body,
            uploader: req.user.id
        });

        res.status(201).json(material);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
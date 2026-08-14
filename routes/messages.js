const express = require("express");

const Message = require("../models/Message");
const auth = require("../middleware/auth");

const router = express.Router();


// SEND MESSAGE
router.post("/", auth, async (req, res) => {
    try {

        const message = await Message.create({
            sender: req.user.id,
            receiver: req.body.receiver,
            text: req.body.text
        });

        res.status(201).json(message);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// GET MY INBOX
router.get("/", auth, async (req, res) => {
    try {

        const messages = await Message.find({
            receiver: req.user.id
        })
            .populate("sender", "name email")
            .sort({ createdAt: -1 });

        res.json(messages);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
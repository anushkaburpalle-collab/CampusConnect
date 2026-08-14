const express = require("express");

const Listing = require("../models/Listing");
const auth = require("../middleware/auth");

const router = express.Router();


// GET ALL LISTINGS
router.get("/", async (req, res) => {
    try {
        const listings = await Listing.find({
            status: "available"
        })
            .populate("seller", "name branch year")
            .sort({ createdAt: -1 });

        res.json(listings);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// CREATE LISTING
router.post("/", auth, async (req, res) => {
    try {

        const listing = await Listing.create({
            ...req.body,
            seller: req.user.id
        });

        const populatedListing = await listing.populate(
            "seller",
            "name branch year"
        );

        res.status(201).json(populatedListing);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// DELETE LISTING
router.delete("/:id", auth, async (req, res) => {
    try {

        const listing = await Listing.findOne({
            _id: req.params.id,
            seller: req.user.id
        });

        if (!listing) {
            return res.status(404).json({
                message: "Listing not found"
            });
        }

        await listing.deleteOne();

        res.json({
            message: "Listing deleted"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
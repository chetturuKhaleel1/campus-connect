// backend/routes/adminAnnouncements.js
import express from "express";
import Announcement from "../models/Announcement.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// GET all announcements
router.get("/", authMiddleware, async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    console.error("Error fetching announcements:", err);
    res.status(500).json({ message: "Server error fetching announcements" });
  }
});

// POST create new announcement
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const newAnnouncement = await Announcement.create({
      title,
      content,
      createdBy: req.user._id,
    });

    res.status(201).json(newAnnouncement);
  } catch (err) {
    console.error("Error creating announcement:", err);
    res.status(500).json({ message: "Server error creating announcement" });
  }
});
// backend/routes/adminAnnouncements.js

// PATCH /api/admin/announcements/:id
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content)
      return res.status(400).json({ message: "Title and content required" });

    const updated = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Error updating announcement:", err);
    res.status(500).json({ message: "Server error updating announcement" });
  }
});


export default router;

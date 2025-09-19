// routes/publicAnnouncements.js
import express from "express";
import Announcement from "../models/Announcement.js";

const router = express.Router();

// Public GET announcements
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    console.error("Error fetching announcements:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

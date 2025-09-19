import express from "express";
import Announcement from "../models/Announcement.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Get all announcements for logged-in users
router.get("/", authMiddleware, async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

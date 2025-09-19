// routes/admin.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Student from "../models/Student.js";
import Faculty from "../models/Faculty.js";
import Project from "../models/Project.js";
import ForumPost from "../models/ForumPost.js";
import Event from "../models/Event.js";
import Announcement from "../models/Announcement.js"; // create model if not exists
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

/**
 * Middleware to allow only admin
 */
const adminMiddleware = async (req, res, next) => {
  await authMiddleware(req, res, async () => {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Admins only" });
    next();
  });
};

/**
 * Fetch all items for a section
 */
router.get("/:section", adminMiddleware, async (req, res) => {
  const { section } = req.params;
  try {
    let data = [];
    switch (section) {
      case "announcements":
        data = await Announcement.find();
        break;
      case "posts":
        data = await ForumPost.find();
        break;
      case "projects":
        data = await Project.find();
        break;
      case "events":
        data = await Event.find();
        break;
      case "faculty":
        data = await Faculty.find();
        break;
      case "students":
        data = await Student.find();
        break;
      default:
        return res.status(400).json({ message: "Invalid section" });
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Delete item
 */
router.delete("/:section/:id", adminMiddleware, async (req, res) => {
  const { section, id } = req.params;
  try {
    let model;
    switch (section) {
      case "announcements": model = Announcement; break;
      case "posts": model = ForumPost; break;
      case "projects": model = Project; break;
      case "events": model = Event; break;
      case "faculty": model = Faculty; break;
      case "students": model = Student; break;
      default: return res.status(400).json({ message: "Invalid section" });
    }
    await model.findByIdAndDelete(id);
    res.json({ message: `${section.slice(0, -1)} deleted successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});




// routes/admin.js
router.patch("/:section/:id/soft-delete", adminMiddleware, async (req, res) => {
  const { section, id } = req.params;
  try {
    let model;
    if (section === "faculty") model = Faculty;
    else if (section === "students") model = Student;
    else return res.status(400).json({ message: "Invalid section for soft delete" });

    await model.findByIdAndUpdate(id, { isDeleted: true });
    res.json({ message: `${section.slice(0, -1)} soft deleted successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
/**
 * Promote faculty to admin (fixed)
 */
router.post("/faculty/:id/promote", adminMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const faculty = await Faculty.findById(id);
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });

    // validate presence of required fields
    if (!faculty.name || !faculty.email_id) {
      return res.status(400).json({ message: "Faculty missing name or email" });
    }

    // check if already admin
    const existingAdmin = await Admin.findOne({ email: faculty.email_id });
    if (existingAdmin)
      return res.status(400).json({ message: "Already an admin" });

    // create new admin
    const admin = new Admin({
      name: faculty.name,
      email: faculty.email_id,
      password: faculty.password, // keep hashed password
      role: "admin",
    });

    await admin.save();

    await Faculty.findByIdAndUpdate(id, { isAdmin: true });
    res.json({ message: "Faculty promoted to Admin successfully", admin });
  } catch (err) {
    console.error("Promote faculty error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/**
 * Demote admin back to faculty
 */
router.post("/faculty/:id/demote", adminMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const faculty = await Faculty.findById(id);
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });

    // check if they are currently admin
    const admin = await Admin.findOne({ email: faculty.email_id });
    if (!admin)
      return res.status(400).json({ message: "This faculty is not an admin" });

    // delete from Admin collection
    await Admin.findByIdAndDelete(admin._id);
await Faculty.findByIdAndUpdate(id, { isAdmin: false });
    res.json({ message: "Faculty demoted to normal faculty successfully" });
  } catch (err) {
    console.error("Demote faculty error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

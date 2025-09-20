import express from "express";
import Faculty from "../models/Faculty.js";
import Student from "../models/Student.js";
import bcrypt from "bcryptjs";
import ForumPost from "../models/ForumPost.js";
import Project from "../models/Project.js";
import Event from "../models/Event.js";
import { authMiddleware } from "../middleware/auth.js";
import mongoose from "mongoose";

const router = express.Router();

/* ------------------------- Current User Profile ------------------------- */
// ✅ keep /me routes FIRST
// ✅ Current User Profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not found in token" });
    }

    const { role, _id: id } = req.user;

    let user;
    if (role === "faculty") {
      user = await Faculty.findById(id).select("-password");
      if (!user) return res.status(404).json({ message: "Faculty not found" });
    } else if (role === "student") {
      user = await Student.findById(id).select("-password");
      if (!user) return res.status(404).json({ message: "Student not found" });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Fetch related content safely
    const posts = await ForumPost.find({ user: id }).sort({ createdAt: -1 }).lean();
    const projects = await Project.find({ user: id }).sort({ createdAt: -1 }).lean();
    const events = await Event.find({ host: id }).sort({ date: 1 }).lean();

    res.json({
      profile: {
        _id: user._id,
        role,
        name: user.name || user.student_name,
        student_name: user.student_name,
        department: user.department,
        email: user.email || user.email_id,
        designation: user.designation,
        rollno: user.rollno,
        area_of_int1: user.area_of_int1,
        area_of_int2: user.area_of_int2,
        skills: user.skills,
      },
      posts,
      projects,
      events,
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { role, _id: id } = req.user;
    const updates = req.body;

    let user;
    if (role === "faculty") {
      user = await Faculty.findById(id);
    } else if (role === "student") {
      user = await Student.findById(id);
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    // Update fields dynamically (except password)
    for (let key in updates) {
      if (key !== "password" && updates[key] !== undefined) {
        user[key] = updates[key];
      }
    }

    // Hash password if provided
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(updates.password, salt);
    }

    await user.save();

    // Exclude password in response
    const userObj = user.toObject();
    delete userObj.password;

    res.json({ success: true, user: userObj });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* ------------------------- Forum: My Posts ------------------------- */
router.get("/my-posts", authMiddleware, async (req, res) => {
  try {
    const posts = await ForumPost.find({ user: req.user._id })
      .populate("user", "student_name name")
      .populate("replies.user", "student_name name")
      .sort({ createdAt: -1 })
      .lean();

    const postsWithCounts = posts.map(post => ({
      _id: post._id,
      title: post.title,
      content: post.content,
      category: post.category,
      tags: post.tags,
      likesCount: post.likes?.length || 0,
      commentsCount: post.replies?.length || 0,
      createdAt: post.createdAt,
    }));

    res.json(postsWithCounts);
  } catch (err) {
    console.error("Error fetching my posts:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ------------------------- Forum: Update Post ------------------------- */
router.put("/:postId", authMiddleware, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "You cannot edit this post" });

    const { title, content, category, tags } = req.body;

    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (category !== undefined) post.category = category;
    if (tags !== undefined) post.tags = tags;

    await post.save();

    const updatedPost = await ForumPost.findById(post._id)
      .populate("user", "student_name name")
      .populate("replies.user", "student_name name")
      .lean();

    res.json({ success: true, post: updatedPost });
  } catch (err) {
    console.error("Update post error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ------------------------- Public Profile by Role & ID ------------------------- */
router.get("/:role/:id", async (req, res) => {
  try {
    const { role, id } = req.params;
    let user;

    if (role === "faculty") {
      user = await Faculty.findById(id);
      if (!user) return res.status(404).json({ message: "Faculty not found" });
    } else if (role === "student") {
      user = await Student.findById(id);
      if (!user) return res.status(404).json({ message: "Student not found" });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    const posts = await ForumPost.find({ user: id }).sort({ createdAt: -1 });
    const projects = await Project.find({ user: id }).sort({ createdAt: -1 });

    let hostId;
    try {
      hostId = new mongoose.Types.ObjectId(id);
    } catch {
      hostId = null;
    }

    const events = hostId ? await Event.find({ host: hostId }).sort({ date: 1 }) : [];

    res.json({
      profile: {
        name: user.name || user.student_name,
        department: user.department,
        email: user.email_id || user.email,
        otherDetails:
          user.designation ||
          `Roll: ${user.rollno}, Sem: ${user.sem}, Skills: ${user.skills?.join(", ")}`,
      },
      posts,
      projects,
      events,
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

import express from "express";
import Project from "../models/Project.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// ================== CREATE PROJECT ==================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, techStack, githubLink, demoLink, status } = req.body;

    const project = new Project({
      user: req.user._id,
      userModel: req.user.userModel,
      title,
      description,
      techStack,
      githubLink,
      demoLink,
      category: "Projects", 
      likes: [],
      status: status || "Ongoing", // ✅ default to "Ongoing"
    });

    await project.save();

    const populatedProject = await Project.findById(project._id).populate(
      "user",
      "student_name name"
    );

    res.status(201).json({ success: true, project: populatedProject });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ================== GET ALL PROJECTS ==================
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("user", "student_name name")
      .sort({ createdAt: -1 });

    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================== GET MY PROJECTS ==================
router.get("/my-projects", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id })
      .populate("user", "student_name name")
      .sort({ createdAt: -1 });

    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================== UPDATE PROJECT ==================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, techStack, githubLink, demoLink, status } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    // Only creator can edit
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // ✅ update fields including status
    project.title = title ?? project.title;
    project.description = description ?? project.description;
    project.techStack = techStack ?? project.techStack;
    project.githubLink = githubLink ?? project.githubLink;
    project.demoLink = demoLink ?? project.demoLink;
    project.status = status ?? project.status; // ✅ allow updating status
    project.category = "Projects";

    await project.save();

    const updatedProject = await Project.findById(project._id).populate(
      "user",
      "student_name name"
    );

    res.json({ success: true, project: updatedProject });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================== DELETE PROJECT ==================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await project.deleteOne();

    res.json({ success: true, message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================== FIND PROJECTS ==================
router.post("/find", async (req, res) => {
  try {
    const { status, area, other } = req.body;

    let projects = await Project.find().populate("user", "student_name name");

    // Filter by status
    if (status && status !== "All") {
      projects = projects.filter((p) => p.status === status);
    }

    // Determine the tech to match
    const techToMatch = area === "Other" && other ? other.toLowerCase() : area.toLowerCase();

    // Filter by techStack
    if (techToMatch) {
      projects = projects.filter((p) =>
        p.techStack.some((tech) => tech.toLowerCase() === techToMatch)
      );
    }

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


// ================== GET PROJECT BY ID ==================
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "user",
      "student_name name"
    );

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json({ success: true, project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;

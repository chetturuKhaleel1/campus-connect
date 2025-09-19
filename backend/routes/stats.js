import express from "express";
import Project from "../models/Project.js";
import Student from "../models/Student.js";
import Faculty from "../models/Faculty.js";

const router = express.Router();

// GET /api/stats
// GET /api/stats
router.get("/", async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalFaculties = await Faculty.countDocuments({ isDeleted: false });

    const totalProjects = await Project.countDocuments();
    const ongoingProjects = await Project.countDocuments({ status: "Ongoing" });
    const completedProjects = await Project.countDocuments({ status: "Completed" });

    const studentsEngaged = await Project.distinct("user", { userModel: "Student" });
    const facultiesEngaged = await Project.distinct("user", { userModel: "Faculty" });
    const activeFacultiesEngaged = await Faculty.countDocuments({
      _id: { $in: facultiesEngaged },
      isDeleted: false,
    });

    res.json({
      totalStudents,
      totalFaculties,
      studentsEngaged: studentsEngaged.length,
      facultiesEngaged: activeFacultiesEngaged,
      ongoingProjects,
      completedProjects,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching stats" });
  }
});


export default router;

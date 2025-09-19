import express from "express";
import Faculty from "../models/Faculty.js";
import Student from "../models/Student.js";

const router = express.Router();

/**
 * POST /find_people
 * Body: { people: "FACULTY" | "STUDENT" | "ALL", area: "Web Development" | "AI" | ... }
 */
router.post("/find_people", async (req, res) => {
  try {
    const { people, area } = req.body;

    let facultyResults = [];
    let studentResults = [];

    // ---------- FACULTY ----------
    if (people === "FACULTY" || people === "ALL") {
      facultyResults = await Faculty.find({
        $or: [
          { department: { $regex: area, $options: "i" } },
          { designation: { $regex: area, $options: "i" } },
        ],
      }).select("name email_id department designation");
    }

    // ---------- STUDENT ----------
    if (people === "STUDENT" || people === "ALL") {
      studentResults = await Student.find({
        $or: [
          { area_of_int1: { $regex: area, $options: "i" } },
          { area_of_int2: { $regex: area, $options: "i" } },
          { skills: { $regex: area, $options: "i" } },
          { department: { $regex: area, $options: "i" } },
        ],
      }).select(
        "student_name email_id department rollno sem skills area_of_int1 area_of_int2"
      );
    }

    // ---------- Format unified results ----------
    const formattedFaculty = facultyResults.map(f => ({
      role: "Faculty",
       id: f._id,  
      name: f.name,
      department: f.department,
      email: f.email_id,                // ✅ consistent key
      otherDetails: f.designation,      // designation for faculty
    }));

    const formattedStudents = studentResults.map(s => ({
      role: "Student",
       id: s._id, 
      name: s.student_name,
      department: s.department,
      email: s.email_id,                // ✅ consistent key
      otherDetails: `Roll: ${s.rollno}, Sem: ${s.sem}, Skills: ${s.skills?.join(", ")}`,
    }));

    const results = [...formattedFaculty, ...formattedStudents];

    return res.json(results);
  } catch (err) {
    console.error("Error in /find_people:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

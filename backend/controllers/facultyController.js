import Faculty from "../models/Faculty.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// 🎓 Faculty Signup
export const registerFaculty = async (req, res) => {
  try {
    const { name, email_id, password, department, designation } = req.body;

    // check if faculty already exists
    const existingFaculty = await Faculty.findOne({ email_id });
    if (existingFaculty) {
      return res.status(400).json({ message: "Faculty already registered" });
    }

    const faculty = new Faculty({
      name,
      email_id,
      password,
      department,
      designation,
    });

    await faculty.save();

    res.status(201).json({
      success: true,
      message: "Faculty registered successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🎓 Faculty Login
export const loginFaculty = async (req, res) => {
  try {
    const { email_id, password } = req.body;

    const faculty = await Faculty.findOne({ email_id });
    if (!faculty) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, faculty.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // generate JWT
    const token = jwt.sign(
      { id: faculty._id, role: "faculty" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      faculty: {
        id: faculty._id,
        name: faculty.name,
        email_id: faculty.email_id,
        department: faculty.department,
        designation: faculty.designation,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

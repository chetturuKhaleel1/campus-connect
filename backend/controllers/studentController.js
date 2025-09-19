import Student from "../models/Student.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register student
export const registerStudent = async (req, res) => {
  try {
    const { student_name, rollno, email_id, department, area_of_int1, area_of_int2, sem, skills, password } = req.body;

    // Check duplicate
    const existing = await Student.findOne({ $or: [{ email_id }, { rollno }] });
    if (existing) return res.status(400).json({ message: "Student already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      student_name,
      rollno,
      email_id,
      department,
      area_of_int1,
      area_of_int2,
      sem,
      skills,
      password: hashedPassword,
    });

    await newStudent.save();
    res.status(201).json({ message: "Student registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering student", error: err.message });
  }
};

// Login student
export const loginStudent = async (req, res) => {
  try {
    const { email_id, password } = req.body;

    const student = await Student.findOne({ email_id });
    if (!student) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

// Logout student
export const logoutStudent = async (req, res) => {
  res.json({ message: "Logout successful" }); // frontend just clears token
};

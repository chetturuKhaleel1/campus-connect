import Faculty from "../models/Faculty.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Signup
export const signupFaculty = async (req, res) => {
  try {
    console.log("Body received:", req.body); // <--- log the request body

    const { name, email, department, designation, password } = req.body;

    const existing = await Faculty.findOne({ email });
    if (existing) {
      console.log("Duplicate email:", email);
      return res.status(400).json({ message: "Faculty already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newFaculty = new Faculty({
      name,
      email,
      department,
      designation,
      password: hashedPassword,
    });

    await newFaculty.save();
    console.log("Faculty saved:", newFaculty);
    res.status(201).json({ message: "Faculty registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);  // <--- log full error
    res.status(500).json({ message: "Error registering faculty", error: err.message });
  }
};

// Login
export const loginFaculty = async (req, res) => {
  try {
    const { email, password } = req.body;

    const faculty = await Faculty.findOne({ email });
    if (!faculty) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, faculty.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: faculty._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

// Logout
export const logoutFaculty = async (req, res) => {
  res.json({ message: "Logout successful" });
};

import Faculty from "../models/Faculty.js";
import Student from "../models/Student.js";
import Admin from "../models/Admin.js"; // ✅ add admin model
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Try admin first
    let user = await Admin.findOne({ email: email });
    let role = "admin";

    if (!user) {
      // Try faculty
      user = await Faculty.findOne({ email_id: email });
      role = "faculty";
    }

    if (!user) {
      // Try student
      user = await Student.findOne({ email_id: email });
      role = "student";
    }

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // JWT token
    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send user info (omit password)
    const userData =
      role === "admin"
        ? { id: user._id, name: user.name, email: user.email }
        : role === "faculty"
        ? {
            id: user._id,
            name: user.name,
            email_id: user.email_id,
            department: user.department,
            designation: user.designation,
          }
        : {
            id: user._id,
            student_name: user.student_name,
            email_id: user.email_id,
            rollno: user.rollno,
            department: user.department,
            area_of_int1: user.area_of_int1,
            area_of_int2: user.area_of_int2,
            skills: user.skills,
            sem: user.sem,
          };

    res.json({ token, user: { ...userData, role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

import Student from "./models/Student.js";
import Faculty from "./models/Faculty.js"; 
import forumRoutes from "./routes/forum.js";
import eventsRoutes from "./routes/event.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import statsRoutes from "./routes/stats.js";
import findPeopleRoutes from "./routes/findPeople.js";
import profileRoutes from "./routes/profile.js";
import adminRoutes from "./routes/admin.js";
import adminAnnouncementsRoutes from "./routes/adminAnnouncements.js";
import publicAnnouncementsRouter from "./routes/publicAnnouncements.js";
// import Admin from "./models/Admin.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/events", eventsRoutes);
// app.use("/api/faculty", facultyRoutes);
app.use("/api", authRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api", findPeopleRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/announcements", adminAnnouncementsRoutes);
app.use("/api/announcements", publicAnnouncementsRouter);

// Root route
app.get("/", (req, res) => {
  res.send("Campus Connect Backend Running 🚀");
});

// --- Student Signup ---
app.post("/api/create_student", async (req, res) => {
  try {
    const {
      student_name,
      rollno,
      email,
      department,
      area_of_int1,
      area_of_int2,
      sem,
      skills,
      password,
    } = req.body;

    const existingStudent = await Student.findOne({ email});
    if (existingStudent) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      student_name,
      rollno,
      email,
      department,
      area_of_int1,
      area_of_int2,
      sem,
      skills,
      password: hashedPassword,
    });

    await newStudent.save();

    res.status(201).json({
      success: true,
      message: "Student registered successfully 🎉",
      student: newStudent,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});



//facluty signup route
// --- Faculty Signup ---
app.post("/api/create_faculty", async (req, res) => {
  try {
    const { name, email, password, department, designation } = req.body;

    const existingFaculty = await Faculty.findOne({ email });
    if (existingFaculty) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newFaculty = new Faculty({
      name,
      email,
      password: hashedPassword,
      department,
      designation,
    });

    await newFaculty.save();

    res.status(201).json({
      success: true,
      message: "Faculty registered successfully 🎉",
      faculty: newFaculty,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});





//use postman to crate a admin and then delete this route
// --- Admin Creation (Temporary) ---
// // --- Admin Creation (Temporary) ---
// app.post("/api/create_admin", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // check if already exists in Admin collection
//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin) {
//       return res.status(400).json({ success: false, message: "Admin already exists" });
//     }

//     // hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // create new admin
//     const newAdmin = new Admin({
//       name,
//       email,
//       password: hashedPassword,
//       role: "admin"
//     });

//     await newAdmin.save();

//     res.status(201).json({
//       success: true,
//       message: "Admin created successfully 🎉",
//       admin: {
//         id: newAdmin._id,
//         name: newAdmin.name,
//         email: newAdmin.email,
//         role: newAdmin.role,
//       }
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });





// --- Profile Update ---



app.put("/api/profile/update", async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      student_name,
      rollno,
      department,
      designation,
      area_of_int1,
      area_of_int2,
      skills,
    } = req.body;

    let user = await Student.findOne({ email_id: email });
    let role = "student";

    if (!user) {
      user = await Faculty.findOne({ email: email });
      role = "faculty";
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (role === "faculty") {
      if (name) user.name = name;
      if (department) user.department = department;
      if (designation) user.designation = designation;
    } else {
      if (student_name) user.student_name = student_name;
      if (rollno) user.rollno = rollno;
      if (department) user.department = department;
      if (area_of_int1) user.area_of_int1 = area_of_int1;
      if (area_of_int2) user.area_of_int2 = area_of_int2;
      if (skills) user.skills = skills.split(",").map((s) => s.trim());
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully!",
      user: {
        email_id: user.email_id,
        name: role === "faculty" ? user.name : user.student_name,
        student_name: user.student_name,
        department: user.department,
        designation: user.designation,
        rollno: user.rollno,
        area_of_int1: user.area_of_int1,
        area_of_int2: user.area_of_int2,
        skills: user.skills,
        role,
      },
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// --- MongoDB Atlas Connection ---
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB Atlas connected");
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
});

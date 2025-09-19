// routes/facultyRoutes.js
import express from "express";
import { registerFaculty, loginFaculty } from "../controllers/facultyController.js";

const router = express.Router();

// 🎓 Faculty Signup (Register)
router.post("/signup", registerFaculty);

// 🎓 Faculty Login
router.post("/login", loginFaculty);

export default router;

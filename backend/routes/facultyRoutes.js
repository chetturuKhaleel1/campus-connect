// routes/facultyRoutes.js
import express from "express";
import { signupFaculty } from "../controllers/facultyController.js";

const router = express.Router();

// Faculty signup
router.post("/create_faculty", signupFaculty);

export default router;

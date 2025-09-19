import express from "express";
import { registerStudent, loginStudent, logoutStudent } from "../controllers/studentController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/create_student", registerStudent);
router.post("/login_student", loginStudent);
router.post("/logout_student", authMiddleware, logoutStudent);

export default router;

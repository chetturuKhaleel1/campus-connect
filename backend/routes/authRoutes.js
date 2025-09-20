import express from "express";
import { login } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login); // ✅ single login for all roles

export default router;

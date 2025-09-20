import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    student_name: { type: String, required: true },
    rollno: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    area_of_int1: { type: String },
    area_of_int2: { type: String },
    sem: { type: Number },
    skills: [{ type: String }],
    password: { type: String, required: true },
    isDeleted: { type: Boolean, default: false }, // ✅ Soft delete flag
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);

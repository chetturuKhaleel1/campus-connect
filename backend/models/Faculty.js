import mongoose from "mongoose";
const facultySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // <- use 'email' instead of 'email_id'
    department: { type: String, required: true },
    designation: { type: String, required: true },
    password: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);


export default mongoose.model("Faculty", facultySchema);

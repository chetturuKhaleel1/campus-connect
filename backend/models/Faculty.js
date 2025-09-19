import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const facultySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email_id: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    isDeleted: { type: Boolean, default: false }, // ✅ Soft delete flag
    isAdmin: { type: Boolean, default: false }, // ✅ Track admin promotion
  },
  { timestamps: true }
);

// 🔑 Hash password before saving
facultySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Faculty = mongoose.model("Faculty", facultySchema);
export default Faculty;

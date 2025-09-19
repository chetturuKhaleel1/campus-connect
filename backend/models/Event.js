// models/Event.js
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String },
  joinLink: { type: String }, // link to Google Form
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  interestedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);
export default Event;

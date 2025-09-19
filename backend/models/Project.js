import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "userModel",
    },
    userModel: {
      type: String,
      required: true,
      enum: ["Student", "Faculty"],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    techStack: [
      {
        type: String,
      },
    ],
    githubLink: {
      type: String,
    },
    demoLink: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "userModel",
      },
    ],

    // 👇 Add this for Forum category mapping
    category: {
      type: String,
      default: "Projects",
    },

    // 👇 New field: project status
    status: {
      type: String,
      enum: ["Ongoing", "Completed"],
      default: "Ongoing",  // all new projects are ongoing by default
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);

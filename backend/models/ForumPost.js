import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    text: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    replies: [], // temporary placeholder
  },
  { _id: true } // ensure every reply has _id
);

// Now define replies as array of replySchema (recursive) safely
replySchema.add({ replies: [replySchema] });

const forumPostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  tags: { type: [String], default: [] },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  replies: { type: [replySchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

const ForumPost = mongoose.model("ForumPost", forumPostSchema);
export default ForumPost;

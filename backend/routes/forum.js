import express from "express";
import mongoose from "mongoose";
import ForumPost from "../models/ForumPost.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// ================== CREATE POST ==================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const post = new ForumPost({
      user: req.user._id,
      title,
      content,
      category,
      tags,
      likes: [],
      dislikes: [],
      replies: [],
    });
    await post.save();

    const populatedPost = await ForumPost.findById(post._id).populate(
      "user",
      "student_name"
    );
    res.status(201).json({ success: true, post: populatedPost });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ================== GET ALL POSTS ==================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const posts = await ForumPost.find()
      .populate("user", "student_name")
      .populate("replies.user", "student_name")
      .sort({ createdAt: -1 });

    const addVoteCounts = (replies) =>
      Array.isArray(replies)
        ? replies
            .filter((r) => r)
            .map((r) => ({
              _id: r._id,
              user: r.user,
              text: r.text,
              likes: r.likes,
              dislikes: r.dislikes,
              likeCount: (r.likes || []).length,
              dislikeCount: (r.dislikes || []).length,
              replies: addVoteCounts(r.replies || []),
            }))
        : [];

    const formattedPosts = posts.map((post) => ({
      _id: post._id,
      user: post.user,
      title: post.title,
      content: post.content,
      category: post.category,
      tags: post.tags,
      likes: post.likes,
      dislikes: post.dislikes,
      likeCount: (post.likes || []).length,
      dislikeCount: (post.dislikes || []).length,
      replies: addVoteCounts(post.replies || []),
      createdAt: post.createdAt,
    }));

    res.json(formattedPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================== ADD REPLY ==================
router.post("/reply/:postId", authMiddleware, async (req, res) => {
  try {
    const { text, parentReplyId } = req.body;
    const post = await ForumPost.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const newReply = {
      _id: new mongoose.Types.ObjectId(), // ensure reply has _id
      user: req.user._id,
      text,
      likes: [],
      dislikes: [],
      replies: [],
    };

    if (parentReplyId) {
      const addNestedReply = (replies) => {
        replies.forEach((r) => {
          if (!r || !r._id) return;
          if (r._id.toString() === parentReplyId) {
            r.replies.push(newReply);
          } else if (Array.isArray(r.replies) && r.replies.length) {
            addNestedReply(r.replies);
          }
        });
      };
      addNestedReply(post.replies);
    } else {
      post.replies.push(newReply);
    }

    await post.save();

    const updatedPost = await ForumPost.findById(req.params.postId)
      .populate("user", "student_name")
      .populate("replies.user", "student_name");

    res.json({ success: true, post: updatedPost });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================== VOTE POST / REPLY ==================
router.post("/vote/:postId", authMiddleware, async (req, res) => {
  try {
    const { type, replyId } = req.body;
    const post = await ForumPost.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id.toString();

    const handleVote = (item) => {
      if (!item) return;
      item.likes = Array.isArray(item.likes) ? item.likes : [];
      item.dislikes = Array.isArray(item.dislikes) ? item.dislikes : [];

      if (type === "like") {
        if (item.likes.map((id) => id?.toString()).includes(userId)) {
          item.likes = item.likes.filter((id) => id?.toString() !== userId);
        } else {
          item.likes.push(userId);
          item.dislikes = item.dislikes.filter((id) => id?.toString() !== userId);
        }
      } else if (type === "dislike") {
        if (item.dislikes.map((id) => id?.toString()).includes(userId)) {
          item.dislikes = item.dislikes.filter((id) => id?.toString() !== userId);
        } else {
          item.dislikes.push(userId);
          item.likes = item.likes.filter((id) => id?.toString() !== userId);
        }
      }
    };

    const voteReply = (replies) => {
      if (!Array.isArray(replies)) return;
      replies.forEach((r) => {
        if (!r || !r._id) return;
        if (r._id.toString() === replyId) {
          handleVote(r);
        } else if (Array.isArray(r.replies) && r.replies.length) {
          voteReply(r.replies);
        }
      });
    };

    if (replyId) {
      voteReply(post.replies);
    } else {
      handleVote(post);
    }

    await post.save();

    const updatedPost = await ForumPost.findById(req.params.postId)
      .populate("user", "student_name")
      .populate("replies.user", "student_name");

    const addVoteCounts = (replies) => {
      if (!Array.isArray(replies)) return [];
      return replies
        .filter((r) => r)
        .map((r) => {
          const base = r?.toObject ? r.toObject() : r;
          return {
            ...base,
            likeCount: Array.isArray(r.likes) ? r.likes.length : 0,
            dislikeCount: Array.isArray(r.dislikes) ? r.dislikes.length : 0,
            replies: addVoteCounts(r.replies || []),
          };
        });
    };

    const formattedPost = {
      ...(updatedPost?.toObject ? updatedPost.toObject() : updatedPost),
      likeCount: Array.isArray(updatedPost.likes) ? updatedPost.likes.length : 0,
      dislikeCount: Array.isArray(updatedPost.dislikes)
        ? updatedPost.dislikes.length
        : 0,
      replies: addVoteCounts(updatedPost.replies || []),
    };

    res.json({ success: true, post: formattedPost });
  } catch (err) {
    console.error("Vote error:", err);
    res.status(500).json({ message: err.message });
  }
});


// ================== GET MY POSTS ==================
router.get("/my-posts", authMiddleware, async (req, res) => {
  try {
    const posts = await ForumPost.find({ user: req.user._id })
      .populate("user", "student_name")
      .populate("replies.user", "student_name")
      .sort({ createdAt: -1 });

    const addVoteCounts = (replies) =>
      Array.isArray(replies)
        ? replies.map((r) => ({
            _id: r._id,
            user: r.user,
            text: r.text,
            likes: r.likes,
            dislikes: r.dislikes,
            likeCount: (r.likes || []).length,
            dislikeCount: (r.dislikes || []).length,
            replies: addVoteCounts(r.replies || []),
          }))
        : [];

    const formattedPosts = posts.map((post) => ({
      _id: post._id,
      user: post.user,
      title: post.title,
      content: post.content,
      category: post.category,
      tags: post.tags,
      likes: post.likes,
      dislikes: post.dislikes,
      likeCount: (post.likes || []).length,
      dislikeCount: (post.dislikes || []).length,
      replies: addVoteCounts(post.replies || []),
      createdAt: post.createdAt,
    }));

    res.json({ success: true, posts: formattedPosts });
  } catch (err) {
    console.error("My-posts error:", err);
    res.status(500).json({ message: err.message });
  }
});
// ================== UPDATE POST ==================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const post = await ForumPost.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Only the creator can update
    if (post.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    post.title = title ?? post.title;
    post.content = content ?? post.content;
    post.category = category ?? post.category;
    post.tags = tags ?? post.tags;

    await post.save();

    const updatedPost = await ForumPost.findById(post._id).populate(
      "user",
      "student_name"
    );

    res.json({ success: true, post: updatedPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


export default router;

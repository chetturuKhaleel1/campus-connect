// src/pages/Forum.jsx
import React, { useState, useEffect } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Send,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Events from "../pages/Events";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
const baseURL = import.meta.env.VITE_API_URL;

const categories = ["All", "Tech", "Freelancers", "Events", "Campus", "Projects"];

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "Tech",
    tags: "",
  });
  const [activeCategory, setActiveCategory] = useState("All");
  const [replyText, setReplyText] = useState({});
  const [collapsedReplies, setCollapsedReplies] = useState({});

  const userId = localStorage.getItem("userId");

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
     const res = await axios.get(
  `${baseURL}/api/forum`,
  { headers: { Authorization: `Bearer ${token}` } }
);
      setPosts(res.data);
    } catch (err) {
      console.error("Fetch posts error:", err);
    }
  };
const fetchProjects = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/projects`);
    setProjects(res.data.projects || []);
  } catch (err) {
    console.error("Fetch projects error:", err);
  }
};


  useEffect(() => {
    fetchPosts();
    fetchProjects();
  }, []);

  const handleVote = async (postId, type, replyId = null) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login first.");


    const res = await axios.post(
  `${baseURL}/api/forum/vote/${postId}`,
  { type, replyId },
  { headers: { Authorization: `Bearer ${token}` } }
);



      setPosts(posts.map((p) => (p._id === postId ? res.data.post : p)));
    } catch (err) {
      console.error("Voting error:", err);
    }
  };

  const handlePost = async () => {
    if (!newPost.title || !newPost.content) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login first.");

const res = await axios.post(
  `${baseURL}/api/forum`,
  { ...newPost, tags: newPost.tags.split(",").map((t) => t.trim()) },
  { headers: { Authorization: `Bearer ${token}` } }
);



      setPosts([res.data.post, ...posts]);
      setNewPost({ title: "", content: "", category: "Tech", tags: "" });
    } catch (err) {
      console.error("Post creation error:", err);
    }
  };

  const handleReply = async (postId, parentReplyId = null) => {
    if (!replyText[postId]) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login first.");


     const res = await axios.post(
  `${baseURL}/api/forum/reply/${postId}`,
  { text: replyText[postId], parentReplyId },
  { headers: { Authorization: `Bearer ${token}` } }
);



      setPosts(posts.map((p) => (p._id === postId ? res.data.post : p)));
      setReplyText({ ...replyText, [postId]: "" });
    } catch (err) {
      console.error("Reply error:", err);
    }
  };

  const toggleCollapse = (replyId) =>
    setCollapsedReplies((prev) => ({ ...prev, [replyId]: !prev[replyId] }));

  const filteredPosts =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  const renderReplies = (postId, replies, level = 1) =>
    replies.map((reply) => (
      <motion.div
        key={reply._id}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
        style={{ marginLeft: level * 24 }}
        className="mt-3"
      >
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border p-3 rounded-xl text-gray-800 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium">{reply.text}</span>
            <span className="text-xs text-gray-500 ml-2 italic">
              {reply.user?.student_name || "Anonymous"}
            </span>
            {reply.replies?.length > 0 && (
              <button
                onClick={() => toggleCollapse(reply._id)}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                {collapsedReplies[reply._id] ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>
            )}
          </div>
          <div className="flex gap-3 mt-2 text-xs">
            <button
              onClick={() => handleVote(postId, "like", reply._id)}
              className={`flex items-center gap-1 ${
                reply.likes?.map((id) => id.toString()).includes(userId)
                  ? "text-green-600 font-bold"
                  : "text-gray-500 hover:text-green-600"
              }`}
            >
              <ThumbsUp size={14} /> {reply.likeCount || 0}
            </button>
            <button
              onClick={() => handleVote(postId, "dislike", reply._id)}
              className={`flex items-center gap-1 ${
                reply.dislikes?.map((id) => id.toString()).includes(userId)
                  ? "text-red-600 font-bold"
                  : "text-gray-500 hover:text-red-600"
              }`}
            >
              <ThumbsDown size={14} /> {reply.dislikeCount || 0}
            </button>
            <button
              onClick={() => handleReply(postId, reply._id)}
              className="ml-2 text-blue-600 hover:underline"
            >
              Reply
            </button>
          </div>

          {!collapsedReplies[reply._id] && reply.replies?.length > 0 && renderReplies(postId, reply.replies, level + 1)}
        </div>
      </motion.div>
    ));

  return (
    <div className="p-6 bg-gradient-to-b from-indigo-50 to-white min-h-screen">
      {/* Categories */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition ${
              activeCategory === cat
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:scale-105"
                : "bg-white border border-gray-300 hover:bg-gray-100 text-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events */}
      {activeCategory === "Events" ? (
        <Events />
      ) : activeCategory === "Projects" ? (
        <div className="space-y-6">
          {projects.length > 0 ? (
            projects.map((project) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
                <p className="text-gray-600 mt-1">{project.description}</p>
                <p className="text-xs italic text-gray-500 mt-1">
                  By {project.user?.student_name || project.user?.name || "Anonymous"}
                </p>
                {project.techStack?.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {project.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-2 py-1 rounded-full text-xs font-semibold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 mt-3 text-sm">
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      GitHub
                    </a>
                  )}
                  {project.demoLink && (
                    <a
                      href={project.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline font-medium"
                    >
                      Demo
                    </a>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No projects yet.</p>
          )}
        </div>
      ) : (
        <>
          {/* Create Post */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-md mb-8"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Start a Discussion</h2>
            <select
              value={newPost.category}
              onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
              className="border rounded-xl p-2 mb-3 w-full focus:ring-2 focus:ring-purple-500 outline-none"
            >
              {categories.filter((c) => c !== "All" && c !== "Projects").map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Title"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="border rounded-xl p-2 mb-3 w-full focus:ring-2 focus:ring-pink-500 outline-none"
            />
            <textarea
              placeholder="What's on your mind?"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              className="border rounded-xl p-2 mb-3 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newPost.tags}
              onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
              className="border rounded-xl p-2 mb-3 w-full focus:ring-2 focus:ring-cyan-500 outline-none"
            />
            <button
              onClick={handlePost}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-xl shadow-lg hover:scale-105 transition transform font-semibold"
            >
              Post
            </button>
          </motion.div>

          {/* Forum Posts */}
          <div className="space-y-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold px-3 py-1 bg-gradient-to-r from-blue-300 to-blue-500 text-white rounded-full">
                      {post.category}
                    </span>
                    <div className="flex gap-2 text-xs">
                      {post.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-2 py-1 rounded-full text-xs font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mt-2 text-gray-800">{post.title}</h3>
                  <p className="text-gray-600 mt-1">{post.content}</p>
                  <p className="text-xs italic text-gray-500 mt-1">
                    Posted by {post.user?.student_name || "Anonymous"}
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-gray-500">
                    <button
                      onClick={() => handleVote(post._id, "like")}
                      className={`flex items-center gap-1 ${
                        post.likes?.map((id) => id.toString()).includes(userId)
                          ? "text-green-600 font-bold"
                          : "text-gray-500 hover:text-green-600"
                      }`}
                    >
                      <ThumbsUp size={18} /> {post.likeCount || 0}
                    </button>
                    <button
                      onClick={() => handleVote(post._id, "dislike")}
                      className={`flex items-center gap-1 ${
                        post.dislikes?.map((id) => id.toString()).includes(userId)
                          ? "text-red-600 font-bold"
                          : "text-gray-500 hover:text-red-600"
                      }`}
                    >
                      <ThumbsDown size={18} /> {post.dislikeCount || 0}
                    </button>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={18} /> {post.replies?.length || 0} Replies
                    </span>
                  </div>

                  <div className="mt-4">{renderReplies(post._id, post.replies || [])}</div>

                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      value={replyText[post._id] || ""}
                      onChange={(e) =>
                        setReplyText({ ...replyText, [post._id]: e.target.value })
                      }
                      className="flex-1 border rounded-xl p-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                    />
                    <button
                      onClick={() => handleReply(post._id)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-2 rounded-xl shadow hover:scale-105 transition transform"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No posts in this category yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Forum;

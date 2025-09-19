// client/src/pages/CreateProject.jsx
import React, { useState } from "react";
import axios from "axios";

export default function CreateProject() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    githubLink: "",
    demoLink: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

     await axios.post(
  `${import.meta.env.VITE_API_URL}/api/projects`,
  { ...formData, category: "Projects" },
  { headers: { Authorization: `Bearer ${token}` } }
);


      setMessage("Project created successfully!");
      setFormData({
        title: "",
        description: "",
        techStack: "",
        githubLink: "",
        demoLink: "",
      });
    } catch (err) {
      console.error("Error creating project:", err);
      setMessage("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-100">
        Post a Project
      </h2>

      {message && (
        <p
          className={`text-center mb-5 font-medium ${
            message.includes("successfully") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Project Title */}
        <div>
          <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
            Project Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter project title"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            placeholder="Describe your project"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
            Tech Stack
          </label>
          <input
            type="text"
            name="techStack"
            value={formData.techStack}
            onChange={handleChange}
            placeholder="e.g. MERN, Python, etc."
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* GitHub Link */}
        <div>
          <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
            GitHub Repository
          </label>
          <input
            type="url"
            name="githubLink"
            value={formData.githubLink}
            onChange={handleChange}
            placeholder="https://github.com/your-repo"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Live Demo Link */}
        <div>
          <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
            Live Demo
          </label>
          <input
            type="url"
            name="demoLink"
            value={formData.demoLink}
            onChange={handleChange}
            placeholder="https://your-demo-link.com"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow transition-all duration-300"
        >
          {loading ? "Posting..." : "Post Project"}
        </button>
      </form>
    </div>
  );
}

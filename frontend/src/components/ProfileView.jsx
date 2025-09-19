// src/components/ProfileView.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { User, FileText, FolderKanban } from "lucide-react";

export default function ProfileView() {
  const { role, id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/profile/${role}/${id}`
        );
        setProfileData(res.data);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile data");
      }
      setIsLoading(false);
    };
    fetchProfileData();
  }, [role, id]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );

  if (error)
    return (
      <p className="text-center py-10 text-red-500 font-medium">{error}</p>
    );

  if (!profileData)
    return <p className="text-center py-10 text-gray-600">Profile not found</p>;

  const { profile, posts, projects } = profileData;

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl transition-colors duration-300">
      {/* PROFILE HEADER */}
      <div className="flex items-center gap-6 mb-12">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-md">
          {profile.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            {profile.name}
            <span className="ml-2 text-lg font-medium text-blue-600 dark:text-blue-400">
              ({role})
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            <strong className="text-gray-800 dark:text-gray-100">
              Department:
            </strong>{" "}
            {profile.department}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            <strong className="text-gray-800 dark:text-gray-100">Email:</strong>{" "}
            {profile.email}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            <strong className="text-gray-800 dark:text-gray-100">
              Other Details:
            </strong>{" "}
            {profile.otherDetails || "—"}
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex space-x-8 border-b border-gray-200 dark:border-gray-700 mb-8">
        {[
          { key: "posts", label: "Posts", icon: <FileText size={16} /> },
          { key: "projects", label: "Projects", icon: <FolderKanban size={16} /> },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`relative flex items-center gap-2 py-2 px-4 text-sm font-semibold tracking-wide transition-colors duration-300 ${
              activeTab === tab.key
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-[slideIn_0.3s_ease-in-out]"></span>
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="space-y-6">
        {activeTab === "posts" &&
          (posts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 italic">
              No posts yet 😔
            </p>
          ) : (
            <ul className="space-y-5">
              {posts.map((post) => (
                <li
                  key={post._id}
                  className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-700 hover:shadow-md transition-all duration-300"
                >
                  <h2 className="font-semibold text-xl text-blue-600 dark:text-blue-400">
                    {post.title}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-200 mt-2 leading-relaxed">
                    {post.content}
                  </p>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-3 flex gap-4">
                    <span>📂 {post.category}</span>
                    <span>👍 {post.likesCount || 0}</span>
                    <span>💬 {post.commentsCount || 0}</span>
                  </div>
                </li>
              ))}
            </ul>
          ))}

        {activeTab === "projects" &&
          (projects.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 italic">
              No projects yet 😔
            </p>
          ) : (
            <ul className="space-y-5">
              {projects.map((proj) => (
                <li
                  key={proj._id}
                  className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-700 hover:shadow-md transition-all duration-300"
                >
                  <h2 className="font-semibold text-xl text-green-600 dark:text-green-400">
                    {proj.title}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-200 mt-2 leading-relaxed">
                    {proj.description}
                  </p>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                    📅 Created on:{" "}
                    {new Date(proj.createdAt).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          ))}
      </div>
    </div>
  );
}

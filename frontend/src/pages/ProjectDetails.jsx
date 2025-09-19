import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading";
const baseURL = import.meta.env.VITE_API_URL;
export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");
       const res = await axios.get(`${baseURL}/api/projects/${id}`, {
  headers: { Authorization: `Bearer ${token}` },
});
        setProject(res.data.project);
      } catch (err) {
        console.error("Error fetching project:", err);
        alert("Project not found!");
        navigate("/find_projects");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 py-20 px-5">
      {project ? (
        <div className="max-w-5xl mx-auto">
          {/* Banner */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {project.title}
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
              {project.description}
            </p>
          </div>

          {/* Details Card */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl shadow-2xl p-10 space-y-8 border border-slate-200 dark:border-slate-700 backdrop-blur">
            {/* Tech Stack */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-3">
                {project.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-4 py-1.5 text-sm font-medium rounded-full bg-gradient-to-r from-teal-500/10 to-blue-500/10 text-slate-700 dark:text-slate-200 border border-slate-300/40 dark:border-slate-600/40 shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Status
              </h3>
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide shadow-sm ${
                  project.status === "Completed"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-800 dark:text-amber-200"
                }`}
              >
                {project.status}
              </span>
            </div>

            {/* Creator */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Created by
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-base">
                {project.user?.student_name || project.user?.name || "Unknown"}
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-4 pt-2">
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-lg bg-slate-900 text-white font-medium shadow-md hover:bg-slate-700 hover:shadow-lg transition-transform transform hover:-translate-y-0.5"
                >
                  GitHub Repository
                </a>
              )}
              {project.demoLink && (
                <a
                  href={project.demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium shadow-md hover:bg-indigo-500 hover:shadow-lg transition-transform transform hover:-translate-y-0.5"
                >
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-slate-700 dark:text-slate-300 text-lg">
          Project not found.
        </p>
      )}
    </div>
  );
}

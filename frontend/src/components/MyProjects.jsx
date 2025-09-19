import React from "react";

export default function MyProjects({ projects, setEditingProject, deleteProject }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">My Projects</h2>
      {projects.length === 0 ? (
        <p>No projects yet.</p>
      ) : (
        projects.map((project) => (
          <div
            key={project._id}
            className="bg-gray-50 dark:bg-gray-700 p-4 rounded mb-3 shadow"
          >
            <p className="font-semibold">{project.title}</p>
            <p>{project.description}</p>
            <p className="text-sm text-gray-500">
              Tech: {project.techStack?.join(", ")}
            </p>
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 underline text-sm"
              >
                GitHub
              </a>
            )}
            {project.demoLink && (
              <a
                href={project.demoLink}
                target="_blank"
                rel="noreferrer"
                className="ml-4 text-green-500 underline text-sm"
              >
                Demo
              </a>
            )}
            <p className="text-sm mt-2">👍 {project.likes?.length || 0}</p>

            {/* Edit/Delete buttons inside the map */}
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => setEditingProject(project)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deleteProject(project._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

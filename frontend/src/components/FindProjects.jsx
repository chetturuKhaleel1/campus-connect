import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

export default function FindProjects() {
  const [formData, setFormData] = useState({ status: "", area: "", other: "" });
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const navigate = useNavigate();

  const areaOptions = [
    "MERN",
    "Python",
    "Java",
    "AIML",
    "Frontend",
    "Backend",
    "Fullstack",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "area") setShowOtherInput(value === "Other");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/projects/find", formData);
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl px-6 py-24 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold sm:text-5xl tracking-tight bg-gradient-to-r from-blue-500 via-teal-400 to-green-400 bg-clip-text text-transparent">
          Find Projects Suited For You 👩‍💻
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">
          Discover ongoing and completed projects in your campus that match your interests.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mx-auto mb-0 mt-12 max-w-xl space-y-6 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
      >
        <div>
          <label className="block font-medium text-gray-800 dark:text-gray-200" htmlFor="status">
            Status of project
          </label>
          <select
            required
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-900 p-4 text-sm shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
          >
            <option value="">Select status</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="All">All</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-800 dark:text-gray-200" htmlFor="area">
            Area of interest
          </label>
          <select
            required
            name="area"
            value={formData.area}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-900 p-4 text-sm shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
          >
            <option value="">Select area of interest</option>
            {areaOptions.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {showOtherInput && (
          <div>
            <label className="block font-medium text-gray-800 dark:text-gray-200" htmlFor="other">
              Enter custom tech
            </label>
            <input
              type="text"
              name="other"
              value={formData.other}
              onChange={handleChange}
              placeholder="Type technology here"
              className="mt-2 w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-900 p-4 text-sm shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-green-500 px-6 py-3 rounded-lg text-white font-semibold text-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300"
        >
          🔍 Find Projects
        </button>
      </form>

      {/* Results */}
      {isLoading ? (
        <Loading />
      ) : projects.length > 0 ? (
        <div className="mx-auto max-w-screen-xl text-center mt-16">
          <h2 className="text-3xl font-bold sm:text-4xl bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-10">
            Results
          </h2>
          <div className="overflow-x-auto shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full border-collapse text-left bg-white dark:bg-slate-900">
              <thead className="bg-gray-100 dark:bg-slate-800">
                <tr>
                  <th className="border-b-2 text-amber-600 dark:text-amber-400 px-6 py-4 font-semibold">
                    Title
                  </th>
                  <th className="border-b-2 text-amber-600 dark:text-amber-400 px-6 py-4 font-semibold">
                    Areas of Interest
                  </th>
                  <th className="border-b-2 text-amber-600 dark:text-amber-400 px-6 py-4 font-semibold">
                    Description
                  </th>
                  <th className="border-b-2 text-amber-600 dark:text-amber-400 px-6 py-4 font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <td
                      className="border-b px-6 py-4 font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      onClick={() => navigate(`/project/${p._id}`)}
                    >
                      {p.title}
                    </td>
                    <td className="border-b px-6 py-4 text-gray-700 dark:text-gray-200">
                      <ul className="list-disc list-inside">
                        {p.techStack.map((tech, idx) => (
                          <li key={idx}>{tech}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="border-b px-6 py-4 text-gray-700 dark:text-gray-200">
                      {p.description}
                    </td>
                    <td className="border-b px-6 py-4 font-semibold text-green-600 dark:text-green-400">
                      {p.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-center mt-12 text-gray-500 dark:text-gray-400 text-lg">
          No projects found 😔
        </p>
      )}
    </div>
  );
}

import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

export default function FindPeople() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    people: "",
    area: "",
    customArea: "",
  });

  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Default AOI list
  const defaultAreas = [
    "Web Development",
    "AI & Machine Learning",
    "Freelancing",
    "UI/UX",
    "Cloud Computing",
    "Cybersecurity",
    "Entrepreneurship",
    "Other",
  ];

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      let selectedArea = formData.area;
      if (selectedArea === "Other") {
        selectedArea = formData.customArea;
      }
const r = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/find_people`,
  {
    people: formData.people,
    area: selectedArea,
  }
);

      setResponse(r.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-6 py-20">
      <div className="w-full max-w-4xl">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Find People with Similar Interests 🚀
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Connect with students or faculty who share your passions and start collaborating today!
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 space-y-6 border border-slate-200 dark:border-slate-700 transition"
        >
          {/* Person Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Who are you looking for?
            </label>
            <select
              required
              name="people"
              value={formData.people}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 p-4 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="">Select the person type</option>
              <option value="FACULTY">Faculty</option>
              <option value="STUDENT">Student</option>
              <option value="ALL">All</option>
            </select>
          </div>

          {/* Area of Interest */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Area of Interest
            </label>
            <select
              required
              name="area"
              value={formData.area}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 p-4 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="">Select area of interest</option>
              {defaultAreas.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {formData.area === "Other" && (
              <input
                type="text"
                name="customArea"
                value={formData.customArea}
                onChange={handleChange}
                placeholder="Enter your interest"
                className="mt-3 w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 p-4 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
              />
            )}
          </div>

          {/* Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              🔍 Find People
            </button>
          </div>
        </form>

        {/* RESULTS */}
        <div className="mt-12 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700 transition">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 text-center">
            Results
          </h2>

          {isLoading ? (
            <Loading />
          ) : response.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-center">
              No one found for this interest 😔
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-700">
                    <th className="border-b border-slate-300 dark:border-slate-600 text-blue-600 px-4 py-3 font-semibold">
                      Name
                    </th>
                    <th className="border-b border-slate-300 dark:border-slate-600 text-blue-600 px-4 py-3 font-semibold">
                      Department
                    </th>
                    <th className="border-b border-slate-300 dark:border-slate-600 text-blue-600 px-4 py-3 font-semibold">
                      Other Details
                    </th>
                    <th className="border-b border-slate-300 dark:border-slate-600 text-blue-600 px-4 py-3 font-semibold">
                      Contact
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {response.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-700 transition ${
                        idx % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-slate-50 dark:bg-slate-700"
                      }`}
                    >
                      <td
                        onClick={() =>
                          navigate(`/profile/${item.role.toLowerCase()}/${item.id}`)
                        }
                        className="px-4 py-3 text-blue-500 font-medium cursor-pointer hover:underline"
                      >
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                        {item.department}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {item.otherDetails}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {item.email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

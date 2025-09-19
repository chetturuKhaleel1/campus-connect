import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import axios from "axios";
import Loading from "./Loading";

export default function StudentSignUp() {
  const [areaOfInt, setAreaOfInt] = useState([]);
  const [skillsList, setSkillsList] = useState([
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "Java",
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");

  const [formData, setFormData] = useState({
    student_name: "",
    rollno: "",
    email_id: "",
    department: "",
    area_of_int1: "",
    area_of_int2: "",
    sem: "",
    skills: [],
    password: "",
  });

  useEffect(() => {
    // Hardcoded Areas of Interest
    setAreaOfInt([
      "Web Development",
      "AI & Machine Learning",
      "Freelancing",
      "UI/UX",
      "Cloud Computing",
      "Cybersecurity",
      "Entrepreneurship",
    ]);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillsChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const newSkills = checked
        ? [...prev.skills, value]
        : prev.skills.filter((skill) => skill !== value);
      return { ...prev, skills: newSkills };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse("");

    try {
      const payload = { ...formData, sem: Number(formData.sem) };


    const res = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/create_student`,
  payload
);


      if (res.data.success) {
        setResponse("🎉 Student registered successfully!");
        setFormData({
          student_name: "",
          rollno: "",
          email_id: "",
          department: "",
          area_of_int1: "",
          area_of_int2: "",
          sem: "",
          skills: [],
          password: "",
        });
      } else {
        setResponse("⚠️ Registration failed: " + res.data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
      setResponse(
        "⚠️ Registration failed: " + (error.response?.data?.message || "Server error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <div className="dark:bg-slate-700 flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
          <h2 className="text-center text-2xl font-bold leading-tight text-black dark:text-white">
            Sign up to create student account
          </h2>

          <form onSubmit={handleSubmit} className="mt-8 text-gray-900 dark:text-slate-200 space-y-5">
            {/* Name */}
            <div>
              <label className="text-base font-medium">Full Name</label>
              <input
                required
                type="text"
                name="student_name"
                value={formData.student_name}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                placeholder="Full Name"
              />
            </div>

            {/* Roll No */}
            <div>
              <label className="text-base font-medium">Roll No</label>
              <input
                required
                type="text"
                name="rollno"
                value={formData.rollno}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                placeholder="Roll No"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-base font-medium">Email</label>
              <input
                required
                type="email"
                name="email_id"
                value={formData.email_id}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                placeholder="Email"
              />
            </div>

            {/* Department */}
            <div>
              <label className="text-base font-medium">Department</label>
              <select
                required
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Science">Information Science</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>

            {/* Area of Interest 1 */}
            <div>
              <label className="text-base font-medium">First Area of Interest</label>
              <select
                required
                name="area_of_int1"
                value={formData.area_of_int1}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              >
                <option value="">Select Area</option>
                {areaOfInt.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            {/* Area of Interest 2 */}
            <div>
              <label className="text-base font-medium">Second Area of Interest</label>
              <select
                required
                name="area_of_int2"
                value={formData.area_of_int2}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              >
                <option value="">Select Area</option>
                {areaOfInt.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="text-base font-medium">Semester</label>
              <select
                required
                name="sem"
                value={formData.sem}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              >
                <option value="">Select Semester</option>
                {[...Array(8)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>

            {/* Skills - checkboxes */}
            <div>
              <label className="text-base font-medium mb-2 block">Skills</label>
              <div className="flex flex-wrap gap-2">
                {skillsList.map((skill) => (
                  <label key={skill} className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      value={skill}
                      checked={formData.skills.includes(skill)}
                      onChange={handleSkillsChange}
                      className="accent-teal-500"
                    />
                    {skill}
                  </label>
                ))}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-base font-medium">Password</label>
              <input
                required
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                placeholder="Password"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center bg-black px-3.5 py-2.5 font-semibold rounded text-white hover:bg-green-500"
            >
              Create Account <ArrowRight className="ml-2" size={16} />
            </button>
          </form>

          {/* Response */}
          {isLoading ? (
            <Loading />
          ) : (
            response && (
              <p
                className={`p-5 text-center font-semibold text-lg ${
                  response.includes("Successfully") ? "text-green-500" : "text-red-500"
                }`}
              >
                {response}
              </p>
            )
          )}
        </div>
      </div>
    </section>
  );
}

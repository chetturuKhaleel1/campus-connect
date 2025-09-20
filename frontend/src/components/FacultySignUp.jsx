import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import axios from "axios";
import Loading from "./Loading";
const baseURL = import.meta.env.VITE_API_URL;
export default function FacultySignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email_id: "",
    department: "",
    designation: "",
    password: "",   // ✅ new field
  });

  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault();

    try {
     const r = await axios.post(
  `${baseURL}/api/faculty/signup`, 
  formData
);


      if (r.data.success) {
        setResponse("Successful");
      } else {
        setResponse("Unsuccessful");
      }
    } catch (error) {
      setResponse("Error");
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      {/* form section */}
      <div className="dark:bg-slate-700 flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
          <h2 className="text-center text-2xl font-bold leading-tight text-black dark:text-white">
            Sign up to create faculty account
          </h2>
          <form
            onSubmit={handleSubmit}
            method="POST"
            className="mt-8 text-gray-900 dark:text-slate-200"
          >
            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="text-base font-medium">Full Name</label>
                <input
                  required
                  onChange={handleChange}
                  value={formData.name}
                  className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                  type="text"
                  placeholder="Full Name"
                  name="name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-base font-medium">Email address</label>
                <input
                  required
                  onChange={handleChange}
                  value={formData.email_id}
                  className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                  type="email"
                  placeholder="Email"
                  name="email_id"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-base font-medium">Password</label>
                <input
                  required
                  onChange={handleChange}
                  value={formData.password}
                  className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                  type="password"
                  placeholder="Password"
                  name="password"
                />
              </div>

              {/* Department */}
              <div>
                <label className="text-base font-medium">Department</label>
                <select
                  required
                  onChange={handleChange}
                  value={formData.department}
                  name="department"
                  className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                >
                  <option value="">Select your department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Science">Information Science</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                </select>
              </div>

              {/* Designation */}
              <div>
                <label className="text-base font-medium">Designation</label>
                <select
                  required
                  name="designation"
                  onChange={handleChange}
                  value={formData.designation}
                  className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                >
                  <option value="">Select your designation</option>
                  <option value="Professor">Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                </select>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center px-3.5 py-2.5 font-semibold rounded bg-green-500 hover:bg-green-600 text-white"
                >
                  Create Account <ArrowRight className="ml-2" size={16} />
                </button>
              </div>
            </div>
          </form>

          {/* Message */}
          {isLoading ? (
            <Loading />
          ) : (
            response && (
              <p
                className={`p-5 text-center font-semibold text-lg ${
                  response === "Successful" ? "text-green-500" : "text-red-500"
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
// Note: This form includes fields for name, email, department, designation, and password.
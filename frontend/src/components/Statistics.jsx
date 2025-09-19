import { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  GraduationCap,
  Briefcase,
  UserCheck,
  FolderOpen,
  CheckCircle,
} from "lucide-react";

export default function Statistics() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculties: 0,
    studentsEngaged: 0,
    facultiesEngaged: 0,
    ongoingProjects: 0,
    completedProjects: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

       const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/stats`, {
  headers: { Authorization: `Bearer ${token}` },
});


        setStats(res.data);
      } catch (err) {
        console.error("Error fetching statistics:", err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: <GraduationCap className="w-12 h-12" />,
      colors: "from-pink-500 via-rose-500 to-red-500",
    },
    {
      title: "Total Faculties",
      value: stats.totalFaculties,
      icon: <Users className="w-12 h-12" />,
      colors: "from-indigo-500 via-blue-500 to-cyan-500",
    },
    {
      title: "Students Engaged",
      value: stats.studentsEngaged,
      icon: <UserCheck className="w-12 h-12" />,
      colors: "from-emerald-500 via-green-500 to-lime-500",
    },
    {
      title: "Faculties Engaged",
      value: stats.facultiesEngaged,
      icon: <Briefcase className="w-12 h-12" />,
      colors: "from-amber-500 via-orange-500 to-red-400",
    },
    {
      title: "Ongoing Projects",
      value: stats.ongoingProjects,
      icon: <FolderOpen className="w-12 h-12" />,
      colors: "from-purple-500 via-fuchsia-500 to-pink-500",
    },
    {
      title: "Completed Projects",
      value: stats.completedProjects,
      icon: <CheckCircle className="w-12 h-12" />,
      colors: "from-teal-500 via-cyan-500 to-sky-500",
    },
  ];

  return (
    <div className="py-20 px-6 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <h2 className="mb-16 text-center text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        📊 Statistics Dashboard
      </h2>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`relative overflow-hidden p-8 rounded-3xl shadow-2xl bg-gradient-to-br ${card.colors} text-white group transform transition-all duration-500 hover:scale-105`}
          >
            {/* Glow background effect */}
            <div className="absolute -inset-0.5 bg-white/10 opacity-0 group-hover:opacity-100 blur-2xl rounded-3xl transition-opacity duration-500"></div>

            <div className="relative flex items-center justify-between mb-6">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-md">
                {card.icon}
              </div>
              <p className="text-6xl font-extrabold drop-shadow-md">
                {card.value}
              </p>
            </div>
            <h3 className="relative text-2xl font-semibold tracking-wide">
              {card.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}

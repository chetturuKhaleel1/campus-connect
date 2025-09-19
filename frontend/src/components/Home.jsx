// src/components/Home.jsx
import { useNavigate } from "react-router-dom";

import React from "react";
import {
  AcademicCapIcon,
  UsersIcon,
  ClipboardDocumentIcon,
  BoltIcon,
  ChartBarIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const categories = [
  { name: "Tech", icon: ComputerDesktopIcon, color: "from-indigo-500 via-purple-500 to-fuchsia-500" },
  { name: "Freelancers", icon: UsersIcon, color: "from-emerald-400 via-teal-500 to-cyan-500" },
  { name: "Events", icon: BoltIcon, color: "from-amber-400 via-orange-500 to-red-500" },
  { name: "Projects", icon: ClipboardDocumentIcon, color: "from-pink-500 via-rose-500 to-red-400" },
];

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white overflow-hidden">
        {/* Animated Background Glow */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-32 left-1/4 w-80 h-80 bg-emerald-500/25 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 7, repeat: Infinity }}
            className="absolute bottom-20 right-1/4 w-[28rem] h-[28rem] bg-indigo-500/25 rounded-full blur-3xl"
          />
        </div>

        <div className="mx-auto max-w-screen-xl px-6 py-32 lg:flex lg:h-screen lg:items-center">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="max-w-4xl text-center lg:text-left"
          >
            <h1 className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 bg-clip-text text-transparent text-5xl sm:text-7xl font-extrabold leading-tight drop-shadow-xl tracking-tight">
              Campus Connect
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Empowering collaboration in academia through innovation, connection, and insights.
            </p>
            <div className="mt-10 flex gap-5 justify-center lg:justify-start">
              <a
                href="#categories"
                className="rounded-2xl px-7 py-3 font-semibold text-white 
                  bg-gradient-to-r from-emerald-400 to-teal-600 
                  shadow-lg hover:shadow-emerald-500/30 hover:scale-105 active:scale-95
                  transition-all duration-300"
              >
                Explore Categories
              </a>
              <a
                href="#features"
                className="rounded-2xl px-7 py-3 font-semibold 
                  bg-white/10 backdrop-blur-md border border-white/20 text-gray-200 
                  hover:bg-white/20 hover:text-white
                  transition-all duration-300"
              >
                Learn More
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="relative bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-black py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center text-slate-900 dark:text-white mb-14 tracking-tight">
            Explore Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                whileHover={{ scale: 1.08, rotate: -1 }}
                className="flex flex-col items-center gap-4 p-8 rounded-2xl 
                  bg-white/80 dark:bg-gray-800/70 
                  backdrop-blur-lg border border-white/10 
                  shadow-md hover:shadow-2xl cursor-pointer
                  transition-all duration-300"
              >
                <div
  onClick={() => navigate(`/forum?category=${cat.name}`)}
  className={`p-5 rounded-2xl bg-gradient-to-r ${cat.color} text-white shadow-lg cursor-pointer`}
>
  <cat.icon className="h-12 w-12" />
</div>

                <h3 className="font-bold text-lg text-slate-800 dark:text-white tracking-wide">
                  {cat.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative py-24 bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-gray-900 dark:via-gray-950 dark:to-black"
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center text-slate-900 dark:text-white mb-16 tracking-tight">
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <FeatureCard
              icon={AcademicCapIcon}
              title="Student & Faculty Data"
              desc="Maintain detailed profiles including skills, interests, and projects."
            />
            <FeatureCard
              icon={ClipboardDocumentIcon}
              title="Project Management"
              desc="Create and manage project records, track participation and status."
            />
            <FeatureCard
              icon={UsersIcon}
              title="Interests & Skills Matching"
              desc="Discover common skills and interests among students and faculty."
            />
            <FeatureCard
              icon={BoltIcon}
              title="Dynamic Querying"
              desc="Find students or faculty with specific skills or project involvement."
            />
            <FeatureCard
              icon={ChartBarIcon}
              title="Statistics & Insights"
              desc="View metrics like number of projects, students, and faculty."
            />
          </div>
        </div>
      </section>
    </>
  );
}

// Feature Card Component
function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-start gap-4 p-7 rounded-2xl 
        bg-white/80 dark:bg-gray-800/70 
        backdrop-blur-lg border border-white/10
        shadow-md hover:shadow-xl 
        transition-all duration-300"
    >
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-lg">
        <Icon className="h-9 w-9" />
      </div>
      <h3 className="font-bold text-lg text-slate-900 dark:text-white tracking-wide">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import { Megaphone } from "lucide-react";
const baseURL = import.meta.env.VITE_API_URL;

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(
  `${baseURL}/api/announcements`
);
      setAnnouncements(res.data);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    const interval = setInterval(fetchAnnouncements, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-6">
        <h1 className="text-4xl font-extrabold mb-8 text-slate-900 dark:text-white flex items-center gap-3">
          <Megaphone className="w-8 h-8 text-indigo-600" />
          Announcements
        </h1>
        <div className="space-y-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded-lg bg-gray-200 dark:bg-slate-700 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-extrabold mb-8 text-slate-900 dark:text-white flex items-center gap-3">
        <Megaphone className="w-8 h-8 text-indigo-600" />
        Announcements
      </h1>

      {announcements.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No announcements yet.
        </p>
      ) : (
        <ul className="space-y-6">
          {announcements.map((a) => (
            <li
              key={a._id}
              className="relative overflow-hidden border rounded-xl shadow-sm bg-white dark:bg-slate-800 hover:shadow-lg transition transform hover:-translate-y-1"
            >
              {/* Gradient accent bar */}
              <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-l-xl"></div>

              <div className="p-6 pl-7">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {a.title}
                </h2>
                <p className="text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                  {a.content}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
                  Posted on {new Date(a.createdAt).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

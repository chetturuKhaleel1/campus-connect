import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Home, BarChart2, Users, FilePlus, MessageCircle, Calendar, Bell } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
    setIsOpen(false);
  };

  // Sidebar link configuration
  const links = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    { name: "Statistics", path: "/statistics", icon: <BarChart2 size={18} /> },
    { name: "Find Projects", path: "/find_projects", icon: <FilePlus size={18} /> },
    { name: "Find People", path: "/find_people", icon: <Users size={18} /> },
    { name: "Create Project", path: "/create-project", icon: <FilePlus size={18} /> },
    { name: "Forum", path: "/forum", icon: <MessageCircle size={18} /> },
    { name: "Events", path: "/events", icon: <Calendar size={18} /> },
    { name: "Announcements", path: "/announcements", icon: <Bell size={18} /> },
  ];

  const authLinks = user
    ? [{ name: "Logout", action: handleLogout, color: "red" }]
    : [
        { name: "Login", path: "/login", color: "blue" },
        { name: "Student Sign Up", path: "/student_signup", color: "green" },
        { name: "Faculty Sign Up", path: "/faculty_signup", color: "green" },
      ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 transition-opacity duration-300"
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="p-5 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-teal-600 dark:text-teal-400 tracking-wide">
            CampusConnect
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors duration-200"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <ul className="p-5 space-y-4">
          {links.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-800 transition-all duration-200 font-medium text-gray-800 dark:text-gray-100"
              >
                {link.icon}
                <span className="text-sm md:text-base">{link.name}</span>
              </Link>
            </li>
          ))}

          {/* Auth Links */}
          {authLinks.map((link) => (
            <li key={link.name}>
              {link.action ? (
                <button
                  onClick={link.action}
                  className={`flex items-center gap-3 p-2 rounded-lg w-full font-medium text-${link.color}-600 hover:text-${link.color}-800 hover:bg-${link.color}-100 dark:hover:bg-${link.color}-800 transition-all duration-200`}
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 p-2 rounded-lg font-medium text-${link.color}-600 hover:text-${link.color}-800 hover:bg-${link.color}-100 dark:hover:bg-${link.color}-800 transition-all duration-200`}
                >
                  {link.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Hidden Toggle Button (can be triggered via navbar) */}
      <button onClick={() => setIsOpen(true)} className="hidden" id="sidebar-toggle"></button>
    </>
  );
};

export default Sidebar;

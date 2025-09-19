import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const openSidebar = () => {
    document.getElementById("sidebar-toggle")?.click();
  };

  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [signupOpen, setSignupOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef();
  const signupRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
    setProfileOpen(false);
  };

  const getInitial = (name) => (name && name.length ? name[0].toUpperCase() : "?");
  const displayName = user?.name || user?.student_name || "";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (signupRef.current && !signupRef.current.contains(e.target)) setSignupOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 z-30 w-full">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div
          className="flex h-16 items-center justify-between rounded-2xl 
          bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90 
          dark:from-gray-900 dark:to-black
          backdrop-blur-lg border border-white/10 
          shadow-[0_8px_30px_rgb(0,0,0,0.12)]
          transition-all duration-500 ease-out"
        >
          {/* Sidebar Hamburger */}
          <button
            onClick={openSidebar}
            className="ml-3 inline-flex items-center justify-center rounded-lg p-2 
              text-gray-300 hover:text-white
              hover:bg-white/10 focus:outline-none 
              transition-all duration-300 ease-out"
            aria-label="Open sidebar"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Title */}
          <p className="font-extrabold text-xl tracking-wider 
            bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 
            bg-clip-text text-transparent select-none animate-gradient-x">
            CampusConnect
          </p>

          {/* Auth/Profile */}
          <div className="flex items-center gap-4 relative">
            {!user ? (
              <>
                {/* Login */}
                <button
                  onClick={() => navigate("/login")}
                  className="px-5 py-2 text-sm font-medium rounded-xl 
                    text-gray-200 
                    border border-white/10
                    bg-white/5 hover:bg-white/10 
                    shadow-md hover:shadow-lg 
                    transition-all duration-300 ease-out"
                >
                  Login
                </button>

                {/* Signup Dropdown */}
                <div ref={signupRef} className="relative">
                  <button
                    onClick={() => setSignupOpen(!signupOpen)}
                    className="px-5 py-2 text-sm font-semibold rounded-xl 
                      bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-500 
                      text-white shadow-lg 
                      hover:scale-105 hover:shadow-indigo-500/30 
                      active:scale-95 transition-transform duration-300"
                  >
                    Signup
                  </button>
                  {signupOpen && (
                    <div
                      className="absolute right-0 mt-3 w-48 rounded-xl 
                      bg-slate-900/90 text-gray-100
                      backdrop-blur-xl border border-white/10
                      shadow-2xl overflow-hidden z-50 animate-fade-in"
                    >
                      <button
                        onClick={() => navigate("/student_signup")}
                        className="block w-full text-left px-4 py-3 text-sm 
                          hover:bg-white/10 transition"
                      >
                        Student Signup
                      </button>
                      <button
                        onClick={() => navigate("/faculty_signup")}
                        className="block w-full text-left px-4 py-3 text-sm 
                          hover:bg-white/10 transition"
                      >
                        Faculty Signup
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Profile Circle Dropdown
              <div ref={profileRef} className="relative">
                <div
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="h-11 w-11 rounded-full 
                    bg-gradient-to-br from-cyan-500 to-indigo-600 
                    text-white flex items-center justify-center cursor-pointer select-none 
                    text-lg font-bold shadow-lg hover:scale-110 active:scale-95 
                    transition-transform duration-300"
                >
                  {getInitial(displayName)}
                </div>
                {profileOpen && (
                  <div
                    className="absolute right-0 mt-3 w-52 rounded-xl 
                    bg-slate-900/95 text-gray-100 
                    backdrop-blur-xl border border-white/10
                    shadow-2xl overflow-hidden z-50 animate-fade-in"
                  >
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setProfileOpen(false);
                      }}
                      className="block w-full text-left px-5 py-3 text-sm 
                        hover:bg-white/10 transition"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-5 py-3 text-sm 
                        text-red-400 hover:bg-red-500/10 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

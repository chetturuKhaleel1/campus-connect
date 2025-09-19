// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Megaphone,
  FileText,
  Folder,
  Calendar,
  Users,
  UserCog,
  Trash2,
  Edit,
  ArrowUpCircle,
} from "lucide-react";

const sections = [
  { key: "announcements", label: "Announcements", icon: Megaphone },
  { key: "posts", label: "Forum Posts", icon: FileText },
  { key: "projects", label: "Projects", icon: Folder },
  { key: "events", label: "Events", icon: Calendar },
  { key: "faculty", label: "Faculty", icon: UserCog },
  { key: "students", label: "Students", icon: Users },
];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("announcements");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Create announcement
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "" });

  // Edit announcement
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  // Fetch data
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const res = await axios.get(`/api/admin/${activeSection}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filtered = res.data.filter(item => !item.isDeleted);
      setData(filtered || []);
    } catch (err) {
      console.error("Error fetching:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert("Session expired or unauthorized. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeSection]);

  // Delete item
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const isSoftDelete = activeSection === "faculty" || activeSection === "students";
      if (isSoftDelete) {
        await axios.patch(`/api/admin/${activeSection}/${id}/soft-delete`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.delete(`/api/admin/${activeSection}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setData(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  // Promote faculty
// Promote faculty
const handlePromote = async (id) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    await axios.post(`/api/admin/faculty/${id}/promote`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("✅ Faculty promoted to Admin");
    fetchData(); // refresh list
  } catch (err) {
    console.error("Error promoting:", err);
  }
};


  // Create announcement
  const handleCreateAnnouncement = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!newAnnouncement.title || !newAnnouncement.content) {
      alert("Please fill both title and content");
      return;
    }

    try {
      const res = await axios.post("/api/admin/announcements", newAnnouncement, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(prev => [res.data, ...prev]);
      setNewAnnouncement({ title: "", content: "" });
    } catch (err) {
      console.error("Error creating announcement:", err);
      alert("Failed to create announcement");
    }
  };
const handleDemote = async (id) => {
  const token = localStorage.getItem("token");
  if (!token) return;
  try {
    await axios.post(`/api/admin/faculty/${id}/demote`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("✅ Faculty demoted to normal faculty");
    fetchData(); // refresh list
  } catch (err) {
    console.error("Error demoting:", err);
  }
};

  // Edit announcement
  const handleEditAnnouncement = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!editingAnnouncement.title || !editingAnnouncement.content) {
      alert("Please fill both title and content");
      return;
    }

    try {
      const res = await axios.patch(
        `/api/admin/announcements/${editingAnnouncement._id}`,
        { title: editingAnnouncement.title, content: editingAnnouncement.content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(prev => prev.map(a => (a._id === res.data._id ? res.data : a)));
      setEditingAnnouncement(null);
    } catch (err) {
      console.error("Error updating announcement:", err);
      alert("Failed to update announcement");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col justify-between border-r">
        <div>
          <h1 className="text-2xl font-bold p-4 border-b">Admin Panel</h1>
          <nav className="flex flex-col p-3 space-y-2">
            {sections.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  activeSection === key
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <motion.h2
          key={activeSection}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-bold mb-6 text-gray-800"
        >
          {sections.find(s => s.key === activeSection)?.label}
        </motion.h2>

        {/* Announcement forms */}
        {activeSection === "announcements" && (
          <>
            <div className="mb-6 p-5 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Create Announcement</h3>
              <input
                type="text"
                placeholder="Title"
                className="w-full p-3 border rounded mb-2 focus:ring-2 focus:ring-blue-400 outline-none"
                value={newAnnouncement.title}
                onChange={e =>
                  setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))
                }
              />
              <textarea
                placeholder="Content"
                className="w-full p-3 border rounded mb-2 focus:ring-2 focus:ring-blue-400 outline-none"
                value={newAnnouncement.content}
                onChange={e =>
                  setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))
                }
              />
              <button
                onClick={handleCreateAnnouncement}
                className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Create
              </button>
            </div>

            {editingAnnouncement && (
              <div className="mb-6 p-5 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Edit Announcement</h3>
                <input
                  type="text"
                  placeholder="Title"
                  className="w-full p-3 border rounded mb-2 focus:ring-2 focus:ring-yellow-400 outline-none"
                  value={editingAnnouncement.title}
                  onChange={e =>
                    setEditingAnnouncement(prev => ({ ...prev, title: e.target.value }))
                  }
                />
                <textarea
                  placeholder="Content"
                  className="w-full p-3 border rounded mb-2 focus:ring-2 focus:ring-yellow-400 outline-none"
                  value={editingAnnouncement.content}
                  onChange={e =>
                    setEditingAnnouncement(prev => ({ ...prev, content: e.target.value }))
                  }
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleEditAnnouncement}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingAnnouncement(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Data list */}
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : data.length === 0 ? (
          <p className="text-gray-500">No {activeSection} found.</p>
        ) : (
          <div className="space-y-4">
            {data.map(item => (
  <motion.div
    key={item._id || Math.random()}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    className="p-4 bg-white shadow rounded-lg flex justify-between items-start hover:shadow-md transition-shadow"
  >
    <div>
    {activeSection === "students" && (
  <>
    <h3 className="text-lg font-semibold text-gray-800">{item.student_name || "Untitled"}</h3>
    <p className="text-gray-700 mt-1">Department: {item.department || "N/A"}</p>
    <p className="text-gray-700 mt-1">Email: {item.email_id || "N/A"}</p>
    
  </>
)}


      {activeSection === "faculty" && (
  <>
    <h3 className="text-lg font-semibold text-gray-800">
      
          {item.name || "Untitled"} 
    {item.isAdmin && (
      <span className="ml-2 text-sm text-white bg-green-500 px-2 py-0.5 rounded">Admin</span>
   )}


    </h3>
    <p className="text-gray-700 mt-1">Department: {item.department || "N/A"}</p>
    <p className="text-gray-700 mt-1">Email: {item.email_id || "N/A"}</p>
  </>
)}

      {activeSection === "announcements" && (
        <>
          <h3 className="text-lg font-semibold text-gray-800">{item.title || "Untitled"}</h3>
          <p className="text-gray-700 mt-1">{item.content || "No content"}</p>
        </>
      )}

      {activeSection === "projects" && (
        <>
          <h3 className="text-lg font-semibold text-gray-800">{item.title || "Untitled"}</h3>
          <p className="text-gray-700 mt-1">{item.description || "No content"}</p>
        </>
      )}

      {activeSection === "posts" && (
        <>
          <h3 className="text-lg font-semibold text-gray-800">{item.title || "Untitled"}</h3>
          <p className="text-gray-700 mt-1">{item.content || "No content"}</p>
        </>
      )}

      {activeSection === "events" && (
        <>
          <h3 className="text-lg font-semibold text-gray-800">{item.title || "Untitled"}</h3>
          <p className="text-gray-700 mt-1">{item.description || "No content"}</p>
        </>
      )}

      {/* Common createdAt */}
      <p className="text-sm text-gray-400 mt-1">
        {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
      </p>
    </div>

    <div className="flex space-x-2">
      {activeSection === "faculty" && (
     <button
   onClick={() =>
    item.isAdmin
      ? handleDemote(item._id)
       : handlePromote(item._id)
   }
   className={`p-2 rounded transition-colors ${
    item.isAdmin
      ? "bg-red-100 text-red-700 hover:bg-red-200"
      : "bg-green-100 text-green-700 hover:bg-green-200"
  }`}
>
   <ArrowUpCircle className="w-5 h-5" />
 </button>
      )}
      {activeSection === "announcements" && (
        <button
          onClick={() => setEditingAnnouncement(item)}
          className="p-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
        >
          <Edit className="w-5 h-5" />
        </button>
      )}
      <button
        onClick={() => handleDelete(item._id)}
        className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  </motion.div>
))}

          </div>
        )}
      </main>
    </div>
  );
}

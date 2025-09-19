import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import MyProjects from "../components/MyProjects";

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);

  // const [formData, setFormData] = useState({});

  const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  student_name: "",
  rollno: "",
  department: "",
  designation: "",
  area_of_int1: "",
  area_of_int2: "",
  skills: "",
});

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [myPosts, setMyPosts] = useState([]);
  const [myEvents, setMyEvents] = useState([]);

  const [editingPost, setEditingPost] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
const [myProjects, setMyProjects] = useState([]);
const [editingProject, setEditingProject] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch posts & events on load
useEffect(() => {
  const fetchData = async () => {
    if (!token) return;

    try {
      const [postsRes, eventsRes, projectsRes] = await Promise.all([
        fetch("http://localhost:5000/api/forum/my-posts", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/events/my-events", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/projects/my-projects", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const postsData = await postsRes.json();
      const eventsData = await eventsRes.json();
      const projectsData = await projectsRes.json();

      if (postsRes.ok) setMyPosts(postsData.posts || []);
      if (eventsRes.ok) setMyEvents(eventsData || []);
     if (projectsRes.ok) setMyProjects(projectsData.projects || []);
    } catch (err) {
      console.error("Error loading profile data", err);
    }
  };

  fetchData();
}, [token]);




useEffect(() => {
  const fetchProfile = async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

     if (res.ok) {
  const p = data.profile;
  console.log("Profile data:", p);  // ✅ check if role is there

  setFormData({
    name: p.name || "",
    student_name: p.student_name || "",
    email: p.email || "",
    password: "",
    rollno: p.rollno || "",
    department: p.department || "",
    designation: p.designation || "",
    area_of_int1: p.area_of_int1 || "",
    area_of_int2: p.area_of_int2 || "",
    skills: p.skills ? p.skills.join(", ") : "",
  });

  setUser(p); // ✅ make sure p includes `role`
}
    } catch (err) {
      console.error("Failed to load profile", err);
    }
  };

  fetchProfile();
}, [token, setUser]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };






  // Update a project
const updateProject = async (id) => {
  try {
 const payload = {
  title: editingProject.title,
  description: editingProject.description,
  techStack: editingProject.techStack,
  githubLink: editingProject.githubLink,
  demoLink: editingProject.demoLink,
  status: editingProject.status, // <-- add this
};


    const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json();
      console.error("Update failed:", errData.message);
      return;
    }

    setEditingProject(null);

    // Refresh projects list
    const refreshed = await fetch("http://localhost:5000/api/projects/my-projects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const refreshedData = await refreshed.json();
    setMyProjects(refreshedData.projects || []);
  } catch (err) {
    console.error(err);
  }
};

// Delete a project
const deleteProject = async (id) => {
  try {
    await fetch(`http://localhost:5000/api/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setMyProjects(myProjects.filter((p) => p._id !== id));
  } catch (err) {
    console.error(err);
  }
};

  // Profile update
  const handleUpdate = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    const payload = {
      email: formData.email,
      password: formData.password || undefined,
      name: formData.name || undefined,
      student_name: formData.student_name || undefined,
      department: formData.department || undefined,
      designation: formData.designation || undefined,
      rollno: formData.rollno || undefined,
      area_of_int1: formData.area_of_int1 || undefined,
      area_of_int2: formData.area_of_int2 || undefined,
      skills: formData.skills || undefined,
    };

   const res = await fetch("http://localhost:5000/api/profile/me", {

      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      setUser(data.user);
      setMessage("✅ Profile updated successfully!");
    } else {
      setMessage(`⚠️ ${data.message || "Update failed"}`);
    }
  } catch (err) {
    console.error(err);
    setMessage("⚠️ Something went wrong!");
  } finally {
    setLoading(false);
  }
};


  // --- POSTS handlers ---
  const updatePost = async (id) => {
    try {
      const payload = {
        title: editingPost.title,
        content: editingPost.content,
        category: editingPost.category,
        tags: editingPost.tags,
      };

      const res = await fetch(`http://localhost:5000/api/forum/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("Update failed:", errData.message);
        return;
      }
setEditingPost(null);
const refreshed = await fetch("http://localhost:5000/api/forum/my-posts", {
  headers: { Authorization: `Bearer ${token}` },
});
const refreshedData = await refreshed.json();
setMyPosts(refreshedData.posts || []); // ✅ correct shape

    } catch (err) {
      console.error(err);
    }
  };

  const deletePost = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/forum/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyPosts(myPosts.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // --- EVENTS handlers ---
  const updateEvent = async (id) => {
    try {
      const payload = {
        title: editingEvent.title,
        description: editingEvent.description,
        date: editingEvent.date,
        location: editingEvent.location,
      };

      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("Update failed:", errData.message);
        return;
      }

      setEditingEvent(null);
      const refreshed = await fetch("http://localhost:5000/api/events/my-events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyEvents(await refreshed.json());
    } catch (err) {
      console.error(err);
    }
  };

  const deleteEvent = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyEvents(myEvents.filter((e) => e._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

return (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
         Welcome, {formData.name || formData.student_name || "User"}
      </h1>

      {message && (
        <p className="mb-4 text-center text-sm text-green-600 dark:text-green-400">
          {message}
        </p>
      )}

      {/* --- PROFILE FORM --- */}
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            readOnly
            className="w-full p-2 border rounded cursor-not-allowed"
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter new password"
            className="w-full p-2 border rounded"
          />
        </div>

        {user?.role === "faculty" && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="designation"
              placeholder="Designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </>
        )}

        {user?.role === "student" && (
          <>
            <input
              type="text"
              name="student_name"
              placeholder="Full Name"
              value={formData.student_name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="rollno"
              placeholder="Roll Number"
              value={formData.rollno}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="area_of_int1"
              placeholder="Area of Interest 1"
              value={formData.area_of_int1}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="area_of_int2"
              placeholder="Area of Interest 2"
              value={formData.area_of_int2}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="skills"
              placeholder="Skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>

      {/* --- Edit Post Form --- */}
      {editingPost && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4">
          <h3 className="font-semibold mb-2">Edit Post</h3>
          <input
            type="text"
            placeholder="Title"
            value={editingPost.title}
            onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            placeholder="Content"
            value={editingPost.content}
            onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Category"
            value={editingPost.category || ""}
            onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Tags"
            value={editingPost.tags?.join(", ") || ""}
            onChange={(e) =>
              setEditingPost({ ...editingPost, tags: e.target.value.split(",").map(t => t.trim()) })
            }
            className="w-full p-2 border rounded mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={() => updatePost(editingPost._id)}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditingPost(null)}
              className="bg-gray-500 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* --- My Posts --- */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">My Posts</h2>
        {myPosts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          myPosts.map((post) => (
            <div key={post._id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded mb-3 shadow">
              <p className="font-semibold">{post.title}</p>
              <p>{post.content}</p>
              <p className="text-sm text-gray-500 mt-1">
                Category: {post.category} | Tags: {post.tags?.join(", ")}
              </p>
             <div className="text-sm mt-2 flex gap-4">
  <span>👍 {post.likeCount || 0}</span>      {/* backend gives likeCount */}
  <span>👎 {post.dislikeCount || 0}</span>  {/* show dislikes too */}
  <span>💬 {post.replies?.length || 0}</span> {/* comments count */}
</div>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => setEditingPost(post)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePost(post._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- Edit Event Form --- */}
      {editingEvent && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4">
          <h3 className="font-semibold mb-2">Edit Event</h3>
          <input
            type="text"
            placeholder="Title"
            value={editingEvent.title}
            onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            placeholder="Description"
            value={editingEvent.description}
            onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="date"
            value={editingEvent.date?.split("T")[0] || ""}
            onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Location"
            value={editingEvent.location || ""}
            onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={() => updateEvent(editingEvent._id)}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditingEvent(null)}
              className="bg-gray-500 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* --- My Events --- */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">My Events</h2>
        {myEvents.length === 0 ? (
          <p>No events yet.</p>
        ) : (
          myEvents.map((event) => (
            <div key={event._id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded mb-3 shadow">
              <p className="font-semibold">{event.title}</p>
              <p className="text-sm">{event.description}</p>
             <p className="text-sm text-gray-500">Date: {event.date?.split("T")[0]}</p>
<p className="text-sm text-gray-500">Location: {event.location}</p>
<p className="text-sm text-gray-500">👍 Interested: {event.interestedCount || 0}</p>

              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => setEditingEvent(event)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteEvent(event._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}

    

      </div>

      {editingProject && (
  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4">
    <h3 className="font-semibold mb-2">Edit Project</h3>
    <input
      type="text"
      placeholder="Title"
      value={editingProject.title}
      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
      className="w-full p-2 border rounded mb-2"
    />
    <textarea
      placeholder="Description"
      value={editingProject.description}
      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
      className="w-full p-2 border rounded mb-2"
    />
    <input
      type="text"
      placeholder="Tech Stack (comma separated)"
      value={editingProject.techStack?.join(", ") || ""}
      onChange={(e) =>
        setEditingProject({ ...editingProject, techStack: e.target.value.split(",").map(t => t.trim()) })
      }
      className="w-full p-2 border rounded mb-2"
    />
    <input
      type="text"
      placeholder="GitHub Link"
      value={editingProject.githubLink || ""}
      onChange={(e) => setEditingProject({ ...editingProject, githubLink: e.target.value })}
      className="w-full p-2 border rounded mb-2"
    />
    <input
      type="text"
      placeholder="Demo Link"
      value={editingProject.demoLink || ""}
      onChange={(e) => setEditingProject({ ...editingProject, demoLink: e.target.value })}
      className="w-full p-2 border rounded mb-2"
    />
    <select
  value={editingProject.status || "Ongoing"}
  onChange={(e) =>
    setEditingProject({ ...editingProject, status: e.target.value })
  }
  className="w-full p-2 border rounded mb-2"
>
  <option value="Ongoing">Ongoing</option>
  <option value="Completed">Completed</option>
</select>

    <div className="flex gap-2">
      <button
        onClick={() => updateProject(editingProject._id)}
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        Save
      </button>
      <button
        onClick={() => setEditingProject(null)}
        className="bg-gray-500 text-white px-3 py-1 rounded"
      >
        Cancel
      </button>
    </div>
  </div>
)}


      {/* --- My Projects --- */}
  <MyProjects
  projects={myProjects}
  setEditingProject={setEditingProject}
  deleteProject={deleteProject}
/>

    </div>
  </div>
);

}    


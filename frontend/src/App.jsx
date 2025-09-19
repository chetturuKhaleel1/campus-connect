import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Context & Protected Route
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

// Layout
import Layout from "./components/Layout";

// Pages
import Login from "./pages/Login";
import Home from "./components/Home";
import StudentSignUp from "./components/StudentSignUp";
import FacultySignUp from "./components/FacultySignUp";
import FindPeople from "./components/FindPeople";
import FindProjects from "./components/FindProjects";
import FindStudents from "./components/FindStudents";
import KnowTeamMembers from "./components/KnowTeamMembers";
import Statistics from "./components/Statistics";
import Forum from "./components/Forum";
import Events from "./pages/Events";
import Announcements from "./components/Announcements";
import Profile from "./pages/Profile";
import CreateProject from "./pages/CreateProject";
import ProjectDetails from "./pages/ProjectDetails";
import ProfileView from "./components/ProfileView";
import AdminDashboard from "./pages/AdminDashboard"; // ✅ Admin Dashboard

// Helper to wrap protected pages with Layout
const withLayout = (Component) => (
  <ProtectedRoute>
    <Layout>
      <Component />
    </Layout>
  </ProtectedRoute>
);

const router = createBrowserRouter([
  // Public
  { path: "/login", element: <Login /> },
  { path: "/student_signup", element: <StudentSignUp /> },
  { path: "/faculty_signup", element: <FacultySignUp /> },

  // Home
  { path: "/", element: <Layout><Home /></Layout> },
  { path: "/profile", element: withLayout(Profile) },
  { path: "/profile/:role/:id", element: withLayout(ProfileView) },

  // Protected routes
  { path: "/create-project", element: withLayout(CreateProject) },
  { path: "/find_people", element: withLayout(FindPeople) },
  { path: "/find_projects", element: withLayout(FindProjects) },
  { path: "/project/:id", element: withLayout(ProjectDetails) }, 
  { path: "/find_students", element: withLayout(FindStudents) },
  { path: "/know_team_members", element: withLayout(KnowTeamMembers) },
  { path: "/statistics", element: withLayout(Statistics) },
  { path: "/forum", element: withLayout(Forum) },
  { path: "/events", element: withLayout(Events) },
  { path: "/announcements", element: withLayout(Announcements) },

  // ✅ Admin Dashboard (protected route)
  { 
    path: "/admin/dashboard", 
    element: (
      <AdminProtectedRoute>
        <AdminDashboard />
      </AdminProtectedRoute>
    )
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

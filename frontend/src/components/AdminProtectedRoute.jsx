import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Not logged in
    return <Navigate to="/login" />;
  }

  if (user.role !== "admin") {
    // Logged in but not admin
    return <Navigate to="/" />;
  }

  // Admin allowed
  return children;
}

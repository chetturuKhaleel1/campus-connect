// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ named import


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

 useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);

      // ✅ check expiration
      if (decoded.exp * 1000 < Date.now()) {
        console.log("Token expired, logging out...");
        localStorage.removeItem("token");
        setUser(null);
      } else {
        setUser(decoded); // still valid
      }
    } catch (err) {
      console.error("Invalid token in localStorage:", err);
      localStorage.removeItem("token");
      setUser(null);
    }
  }
}, []);


  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

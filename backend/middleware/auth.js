import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Normalize so req.user._id always exists
    const userId = decoded._id || decoded.id || decoded.userId;
    const role = decoded.role; // "student" or "faculty"

    if (!userId) {
      return res.status(401).json({ message: "Invalid token payload: missing user id" });
    }

    // ✅ Map role to correct Mongoose model name
    let userModel;
    if (role === "student") userModel = "Student";
    else if (role === "faculty") userModel = "Faculty";
    else userModel = "Student"; // fallback if role missing

    req.user = {
      _id: userId, // backend routes depend on this
      role,
      userModel,   // ✅ for Project schema
      ...decoded,  // keep other fields (email, etc.)
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};

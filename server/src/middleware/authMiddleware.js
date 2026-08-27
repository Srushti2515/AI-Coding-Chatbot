import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Optional protect middleware: Attaches req.user if token is valid, otherwise allows guest access
export const optionalProtect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "codesphere_secret_key_2026");
      req.user = await User.findById(decoded.id).select("-password");
    } catch (error) {
      console.warn("Optional auth token invalid, continuing as guest:", error.message);
      req.user = null;
    }
  } else {
    req.user = null;
  }

  next();
};

// Strict protect middleware: Requires valid JWT token
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "codesphere_secret_key_2026");

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ success: false, message: "User not found. Token invalid." });
      }

      return next();
    } catch (error) {
      console.error("Auth middleware error:", error.message);
      return res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token provided" });
  }
};


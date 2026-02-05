import jwt from "jsonwebtoken";
import User from "../modules/auth/user.model.js";
import Responder from "../modules/responders/responder.model.js";

function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return null;
}

export async function requireAuth(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.status === "SUSPENDED") {
      return res.status(403).json({ message: "Account suspended" });
    }

    // 🔥 PHASE 13: BIND RESPONDER
    if (user.role === "OPERATOR") {
      let responder = await Responder.findOne({ user: user._id });

      if (!responder) {
        responder = await Responder.create({
          name: user.name || user.email,
          role: "POLICE", // default (can expand later)
          user: user._id,
          isActive: true,
        });
      }

      user.responderId = responder._id;
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

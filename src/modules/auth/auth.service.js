import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./user.model.js";

/* ================= TOKEN HELPERS ================= */

function signAccessToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
}

/* ================= REGISTER ================= */

export async function registerUser({ email, password, role, name, city }) {
  const exists = await User.findOne({ email });
  if (exists) throw new Error("User already exists");

  const hashed = await bcrypt.hash(password, 12);

  const user = await User.create({
    email,
    password: hashed,
    role: role || "CITIZEN",
    name,
    city,
  });

  return {
    id: user._id,
    email: user.email,
    role: user.role,
    name: user.name,
    city: user.city,
  };
}

/* ================= LOGIN ================= */

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Invalid credentials");

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      city: user.city,
    },
  };
}

/* ================= REFRESH ================= */

export async function refreshAccessToken(token) {
  const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(payload.id);
  if (!user || user.refreshToken !== token) {
    throw new Error("Invalid refresh token");
  }

  return {
    accessToken: signAccessToken(user),
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      city: user.city,
    },
  };
}

/* ================= ADMIN ================= */

export async function suspendUser(userId) {
  await User.findByIdAndUpdate(userId, {
    status: "SUSPENDED",
    refreshToken: null,
  });
}

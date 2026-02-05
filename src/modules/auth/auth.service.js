import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./user.model.js";

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

export async function registerUser({ email, password, role }) {
  const exists = await User.findOne({ email });
  if (exists) throw new Error("User already exists");

  const hashed = await bcrypt.hash(password, 12);

  return User.create({
    email,
    password: hashed,
    role: role || "CITIZEN",
  });
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Invalid credentials");

  return {
    accessToken: signAccessToken(user),
    refreshToken: signRefreshToken(user),
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  };
}

export async function refreshAccessToken(token) {
  const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(payload.id);
  if (!user) throw new Error("User not found");

  return signAccessToken(user);
}

export async function suspendUser(userId) {
  await User.findByIdAndUpdate(userId, {
    status: "SUSPENDED",
    refreshToken: null,
  });
}

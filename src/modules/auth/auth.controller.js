import {
  registerUser,
  loginUser,
  refreshAccessToken,
} from "./auth.service.js";

export async function register(req, res) {
  try {
    await registerUser(req.body);
    res.status(201).json({ message: "Registered successfully" });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

// src/modules/auth/auth.controller.js
export async function login(req, res) {
  try {
    const { accessToken, refreshToken, user } = await loginUser(req.body);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,          // ✅ MUST be false on localhost
        sameSite: "lax",        // ✅ REQUIRED for localhost
        path: "/",
      })
      .json({ accessToken, user });
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
}



export async function refresh(req, res) {
  try {
    console.log("🍪 Cookies:", req.cookies); // TEMP DEBUG

    const token = req.cookies.refreshToken;
    if (!token) throw new Error("No refresh token");

    const accessToken = await refreshAccessToken(token);
    res.json({ accessToken });
  } catch {
    res.status(401).json({ error: "Session expired" });
  }
}


export function logout(req, res) {
  res
    .clearCookie("refreshToken", {
      path: "/",
    })
    .json({ message: "Logged out" });
}



export async function me(req, res) {
  res.json({
    id: req.user._id,
    email: req.user.email,
    role: req.user.role,
    status: req.user.status,
  });
}

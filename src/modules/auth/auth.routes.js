import { Router } from "express";
import { login, register, refresh, logout } from "./auth.controller.js";
import { requireAuth,requireRole } from "../../middlewares/auth.middleware.js";
import { me } from "./auth.controller.js";

const router = Router();

router.get("/me", requireAuth, (req, res) => {
  const user = req.user;

  res.json({
  id: user._id,
  email: user.email,
  role: user.role,
  name: user.name,
  city: user.city,
  status: user.status,
});

});
router.post("/login", login);
router.post("/register", register);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.patch(
  "/users/:id/suspend",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res) => {
    await suspendUser(req.params.id);

    // notify via socket
    req.io.emit("user:suspended", { userId: req.params.id });

    res.json({ success: true });
  }
);

export default router;

import { Router } from "express";
import { getAnalytics } from "./analytics.controller.js";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";

const router = Router();

/* 🔐 ADMIN ONLY */
router.get(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  getAnalytics
);

export default router;

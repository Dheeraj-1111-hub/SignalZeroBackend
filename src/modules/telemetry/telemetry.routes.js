import { Router } from "express";
import { getSystemHealth } from "./telemetry.service.js";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/health",
  requireAuth,
  requireRole("ADMIN"),
  getSystemHealth
);

export default router;

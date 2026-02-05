import { Router } from "express";
import {
  verifyIncident,
  rejectIncident,
} from "./verification.service.js";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/:id/verify",
  requireAuth,
  requireRole("OPERATOR", "ADMIN"),
  verifyIncident
);

router.post(
  "/:id/reject",
  requireAuth,
  requireRole("OPERATOR", "ADMIN"),
  rejectIncident
);

export default router;

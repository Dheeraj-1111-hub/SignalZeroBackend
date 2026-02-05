import { Router } from "express";
import {
  getIncidents,
  getIncidentById,
  createIncident,
  updateIncidentStatus,
  addIncidentTimeline,
} from "./incident.service.js";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { assignResponderManually } from "./incident.service.js";

const router = Router();

router.post("/", requireAuth, requireRole("CITIZEN"), createIncident);
router.get("/", requireAuth, getIncidents);
router.get("/:id", requireAuth, getIncidentById);

router.patch(
  "/:id/status",
  requireAuth,
  requireRole("OPERATOR", "ADMIN"),
  updateIncidentStatus
);

router.post(
  "/:id/timeline",
  requireAuth,
  requireRole("OPERATOR", "ADMIN"),
  addIncidentTimeline
);



router.post(
  "/:id/assign",
  requireAuth,
  requireRole("OPERATOR", "ADMIN"),
  assignResponderManually
);


export default router;

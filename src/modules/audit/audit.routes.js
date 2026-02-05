import { Router } from "express";
import { getAuditLogs } from "./audit.service.js";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, requireRole("ADMIN"), getAuditLogs);

export default router;

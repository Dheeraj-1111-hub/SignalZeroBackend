import { Router } from "express";
import { getSettings, updateSettings } from "./settings.service.js";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, requireRole("ADMIN"), getSettings);
router.patch("/", requireAuth, requireRole("ADMIN"), updateSettings);

export default router;

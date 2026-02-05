import { Router } from "express";
import { enqueueDispatch } from "./dispatch.controller.js";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/:id",
  requireAuth,
  requireRole("OPERATOR", "ADMIN"),
  enqueueDispatch
);

export default router;

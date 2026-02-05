import { Router } from "express";
import Responder from "./responder.model.js";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { startShift, endShift } from "./responder.service.js";
import {
  getAllResponders,
  createResponder,
  updateResponder,
  disableResponder,
} from "./responder.service.js";

const router = Router();

/**
 * Get available responders
 */
router.get(
  "/available",
  requireAuth,
  requireRole("OPERATOR", "ADMIN"),
  async (req, res) => {
    const responders = await Responder.find({
      isActive: true,
      currentIncident: null,
    }).select("_id name role");

    res.json(responders);
  }
);


router.post("/shift/start", requireAuth, requireRole("OPERATOR"), startShift);
router.post("/shift/end", requireAuth, requireRole("OPERATOR"), endShift);
router.get("/", requireAuth, requireRole("ADMIN"), getAllResponders);
router.post("/", requireAuth, requireRole("ADMIN"), createResponder);
router.patch("/:id", requireAuth, requireRole("ADMIN"), updateResponder);
router.delete("/:id", requireAuth, requireRole("ADMIN"), disableResponder);
export default router;




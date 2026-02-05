import { Router } from "express";
import { getTelemetry } from "../telemetry/telemetry.service.js";

const router = Router();

router.get("/health", async (req, res) => {
  const data = await getTelemetry();
  res.json(data);
});

export default router;

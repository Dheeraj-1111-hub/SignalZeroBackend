// src/app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/auth.routes.js";
import incidentRoutes from "./modules/incidents/incident.routes.js";
import dispatchRoutes from "./modules/dispatch/dispatch.routes.js";
import responderRoutes from "./modules/responders/responder.routes.js";
import verificationRoutes from "./modules/verification/verification.routes.js";
import analyticsRoutes from "./modules/analytics/analytics.routes.js";
import systemRoutes from "./modules/system/system.routes.js";
import telemetryRoutes from "./modules/telemetry/telemetry.routes.js";
import settingsRoutes from "./modules/settings/settings.routes.js";
import auditRoutes from "./modules/audit/audit.routes.js";

import notFound from "./middlewares/notFound.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";
import { latencyMiddleware } from "./middlewares/latency.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(latencyMiddleware);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/dispatch", dispatchRoutes);
app.use("/api/responders", responderRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/system", systemRoutes);
app.use("/api/telemetry", telemetryRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/audit", auditRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

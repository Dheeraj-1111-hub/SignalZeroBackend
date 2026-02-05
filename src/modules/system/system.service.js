import mongoose from "mongoose";
import Incident from "../incidents/incident.model.js";
import { getIO } from "../../socket.js";

export async function getSystemHealth(req, res, next) {
  try {
    const dbConnected = mongoose.connection.readyState === 1;

    const totalIncidents = await Incident.countDocuments();
    const openIncidents = await Incident.countDocuments({
      status: { $ne: "RESOLVED" },
    });

    const slaBreaches = await Incident.countDocuments({
      "sla.breached": true,
    });

    const io = getIO();
    const socketClients = io.engine.clientsCount;

    /* ---- MOCKED INFRA (can be replaced later with real metrics) ---- */
    const services = [
      { name: "API Gateway", status: "operational", latency: 42, uptime: 99.99 },
      { name: "Incident Engine", status: "operational", latency: 25, uptime: 99.98 },
      { name: "AI Classifier", status: "operational", latency: 150, uptime: 99.95 },
      { name: "Notification Service", status: "operational", latency: 15, uptime: 100 },
      {
        name: "Database",
        status: dbConnected ? "operational" : "down",
        latency: 8,
        uptime: 99.99,
      },
      {
        name: "Cache Layer",
        status: openIncidents > 50 ? "degraded" : "operational",
        latency: 85,
        uptime: 99.85,
      },
    ];

    const queues = [
      { name: "Incident Queue", current: openIncidents, max: 100, processing: 12 },
      { name: "Notification Queue", current: socketClients * 2, max: 500, processing: 45 },
      { name: "AI Processing Queue", current: 8, max: 50, processing: 3 },
    ];

    res.json({
      status: slaBreaches === 0 ? "OK" : "ATTENTION",
      uptimeSeconds: Math.floor(process.uptime()),
      services,
      queues,
      ai: {
        avgLatency: 156,
        accuracy7d: 94.8,
        predictionsToday: 1247,
        drift: -0.2,
      },
      dataFreshness: [
        { source: "Traffic Sensors", age: "2s ago" },
        { source: "Weather Data", age: "1m ago" },
        { source: "Camera Feeds", age: "500ms ago" },
        { source: "Social Media", age: "30s ago" },
        { source: "Citizen Reports", age: "5s ago" },
        { source: "Responder GPS", age: "1s ago" },
      ],
    });
  } catch (err) {
    next(err);
  }
}

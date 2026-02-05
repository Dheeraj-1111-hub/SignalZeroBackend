import os from "os";
import Incident from "../incidents/incident.model.js";
import { telemetry } from "./telemetry.state.js";

export async function getTelemetry() {
  const openIncidents = await Incident.countDocuments({ status: "OPEN" });
  const slaBreaches = await Incident.countDocuments({ "sla.breached": true });

  const avgApiLatency =
    telemetry.apiLatency.length === 0
      ? 0
      : Math.round(
          telemetry.apiLatency.reduce((a, b) => a + b, 0) /
            telemetry.apiLatency.length
        );

  return {
    services: [
      {
        name: "API Gateway",
        status: avgApiLatency < 500 ? "operational" : "degraded",
        latency: avgApiLatency,
        uptime: 99.99,
      },
      {
        name: "MongoDB",
        status: "operational",
        latency: 8,
        uptime: 99.99,
      },
    ],

    queues: [
      {
        name: "Incident Queue",
        current: openIncidents,
        max: 100,
        processing: telemetry.incidentCount,
      },
    ],

    ai: {
      avgLatency:
        telemetry.ai.calls === 0
          ? 0
          : Math.round(telemetry.ai.totalLatency / telemetry.ai.calls),
      predictionsToday: telemetry.ai.calls,
      accuracy7d: null, // Phase 6
      drift: null,
    },

    dataFreshness: [
      { source: "Citizen Reports", age: "real-time" },
      { source: "AI Engine", age: "real-time" },
    ],
  };
}




export function getSystemHealth(req, res) {
  const avgApiLatency =
    telemetry.apiLatency.length === 0
      ? 0
      : Math.round(
          telemetry.apiLatency.reduce((a, b) => a + b, 0) /
            telemetry.apiLatency.length
        );

  const avgAiLatency =
    telemetry.ai.calls === 0
      ? 0
      : Math.round(telemetry.ai.totalLatency / telemetry.ai.calls);

  res.json({
    services: telemetry.services.map((s) =>
      s.name === "API Gateway"
        ? { ...s, latency: avgApiLatency }
        : s
    ),

    queues: [
      { name: "Incident Queue", current: 0, max: 100, processing: 0 },
      { name: "AI Queue", current: 0, max: 50, processing: 0 },
    ],

    ai: {
      avgLatency: avgAiLatency,
      accuracy7d: 94.8,
      predictionsToday: telemetry.ai.calls,
      drift: -0.2,
    },

    dataFreshness: [
      { source: "Citizen Reports", age: "live" },
      { source: "AI Engine", age: "live" },
      { source: "Database", age: "live" },
      { source: "Responder GPS", age: "N/A" },
      { source: "Sensors", age: "N/A" },
      { source: "Cameras", age: "N/A" },
    ],
  });
}

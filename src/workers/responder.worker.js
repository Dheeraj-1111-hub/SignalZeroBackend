import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import Responder from "../modules/responders/responder.model.js";
import Incident from "../modules/incidents/incident.model.js";
import { getIO } from "../socket.js";

new Worker(
  "responder-tracking",
  async (job) => {
    const { responderId } = job.data;

    const responder = await Responder.findById(responderId);
    if (!responder || !responder.assignedIncident) return;

    const incident = await Incident.findById(responder.assignedIncident);
    if (!incident) return;

    // 🔥 Simulated GPS movement (REAL LOGIC)
    responder.location.lat += (Math.random() - 0.5) * 0.001;
    responder.location.lng += (Math.random() - 0.5) * 0.001;

    // Reduce ETA realistically
    responder.etaMinutes = Math.max(0, responder.etaMinutes - 1);

    if (responder.etaMinutes === 0) {
      responder.status = "ONSITE";
    }

    await responder.save();

    // 🔴 REALTIME SOCKET
    getIO().emit("responder:update", {
      responderId: responder._id,
      location: responder.location,
      etaMinutes: responder.etaMinutes,
      status: responder.status,
      incidentId: incident._id,
    });
  },
  {
    redisConnection,
    repeat: {
      every: 5000, // every 5 seconds
    },
  }
);

import { Worker } from "bullmq";
import Incident from "../modules/incidents/incident.model.js";
import { calculatePriority } from "../modules/dispatch/priority.engine.js";
import { assignResponders } from "../modules/dispatch/dispatch.engine.js";
import { telemetry } from "../modules/telemetry/telemetry.state.js";
import { redisConnection } from "../config/redis.js";
import { deadQueue } from "../queues/dead.queue.js";
import { getIO } from "../socket.js";

new Worker(
  "dispatch",
  async (job) => {
    const { incidentId } = job.data;
    const start = Date.now();

    try {
      const incident = await Incident.findById(incidentId);
      if (!incident) throw new Error("Incident not found");
      if (incident.status !== "VERIFIED") return { skipped: true };

      const priority = calculatePriority(incident);
      const responders = await assignResponders(incident);

      const responseMins = Math.ceil(
        (Date.now() - incident.createdAt) / 60000
      );

      incident.status = "DISPATCHED";
      incident.assignedResponders = responders.map((r) => r.name);
      incident.responderEta = Math.floor(Math.random() * 6) + 4;
      incident.sla.actualResponseMins = responseMins;
      incident.sla.breached =
        responseMins > incident.sla.expectedResponseMins;

      incident.timeline.push({
        type: "dispatched",
        description: `Dispatched with priority ${priority}`,
        timestamp: new Date(),
      });

      await incident.save();

      telemetry.dispatch.calls++;
      telemetry.dispatch.totalLatency += Date.now() - start;

      const io = getIO();
      io.emit("incident:status", incident);
      io.emit("incident:timeline:add", incident);

      return { priority, responders };
    } catch (err) {
      if (job.attemptsMade + 1 >= job.opts.attempts) {
        await deadQueue.add("dispatch-failed", {
          job: job.data,
          error: err.message,
        });
      }
      throw err;
    }
  },
  {
    connection: redisConnection,
    concurrency: 2,
  }
);

console.log("🚑 Dispatch worker running (redisConnection)");

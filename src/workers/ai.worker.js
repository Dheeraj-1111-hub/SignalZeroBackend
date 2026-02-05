import { Worker } from "bullmq";
import Incident from "../modules/incidents/incident.model.js";
import { calculateAIConfidence } from "../modules/ai/confidence.engine.js";
import { telemetry } from "../modules/telemetry/telemetry.state.js";
import { redisConnection } from "../config/redis.js";
import { deadQueue } from "../queues/dead.queue.js";

new Worker(
  "ai-confidence",
  async (job) => {
    const { incidentId, payload } = job.data;
    const start = Date.now();

    try {
      const confidence = await calculateAIConfidence(payload);

      await Incident.findByIdAndUpdate(incidentId, { confidence });

      telemetry.ai.calls++;
      telemetry.ai.totalLatency += Date.now() - start;

      return { confidence };
    } catch (err) {
      if (job.attemptsMade + 1 >= job.opts.attempts) {
        await deadQueue.add("ai-confidence-failed", {
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

console.log("🧠 AI Worker running (redisConnection)");

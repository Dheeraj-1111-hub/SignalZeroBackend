import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

export const aiDLQ = new Queue("ai-confidence-dlq", {
  redisConnection,
});

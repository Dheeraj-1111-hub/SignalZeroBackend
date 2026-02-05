import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

export const aiQueue = new Queue("ai-confidence", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

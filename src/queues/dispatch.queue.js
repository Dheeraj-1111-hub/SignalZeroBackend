import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

export const dispatchQueue = new Queue("dispatch", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "fixed",
      delay: 3000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

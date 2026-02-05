import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

export const responderQueue = new Queue("responder-tracking", {
  redisConnection,
});

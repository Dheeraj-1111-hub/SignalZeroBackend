import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

export const deadQueue = new Queue("dead-letter", {
  connection: redisConnection,
});

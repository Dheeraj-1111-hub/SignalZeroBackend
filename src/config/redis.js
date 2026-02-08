import IORedis from "ioredis";

/**
 * 🔥 Single source of truth
 * Used by Queue + Worker
 */

export const redisConnection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  tls: {}, // REQUIRED for Upstash
};

export const redis = new IORedis(redisConnection);

redis.on("connect", () => {
  console.log("🟢 Redis connected");
});

redis.on("error", (err) => {
  console.error("🔴 Redis error", err);
});

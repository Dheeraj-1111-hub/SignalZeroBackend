import IORedis from "ioredis";

/**
 * 🔥 Single source of truth
 * Used by Queue + Worker
 */
export const redisConnection = {
  host: "127.0.0.1",
  port: 6379,
};

export const redis = new IORedis(redisConnection);

redis.on("connect", () => {
  console.log("🟢 Redis connected");
});

redis.on("error", (err) => {
  console.error("🔴 Redis error", err);
});

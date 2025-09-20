import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

redis.on("connect", () => {
  strapi.log.info("✅ Redis connected");
});

redis.on("error", (err) => {
  strapi.log.error("❌ Redis error", err);
});

export default redis;

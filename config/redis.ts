import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  db: Number(process.env.REDIS_DB) || 0,
});

redis.on("connect", () => {
  strapi.log.info("✅ Redis connected");
});

redis.on("error", (err) => {
  strapi.log.error("❌ Redis error", err);
});

export default redis;

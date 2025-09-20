import Redis from "ioredis";

// Read environment variables
const host = process.env.REDIS_HOST;
const port = Number(process.env.REDIS_PORT);
const password = process.env.REDIS_PASSWORD;
const db = Number(process.env.REDIS_DB) || 0;

// Validate Redis configuration
if (!host) {
  throw new Error("REDIS_HOST environment variable is missing");
}
if (isNaN(port) || port <= 0 || port >= 65536) {
  throw new Error("REDIS_PORT environment variable is missing or invalid");
}

// Create Redis client
const redis = new Redis({
  host,
  port,
  password: password || undefined,
  db,
});

// Event listeners
redis.on("connect", () => {
  strapi.log.info(`✅ Redis connected to ${host}:${port}`);
});

redis.on("error", (err) => {
  strapi.log.error("❌ Redis error", err);
});

export default redis;

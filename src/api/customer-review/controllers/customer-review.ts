/**
 * customer-review controller
 */

import { factories } from "@strapi/strapi";
import redis from "../../../../config/redis";

export default factories.createCoreController(
  "api::customer-review.customer-review",
  ({ strapi }) => ({
    async find(ctx) {
      const cacheKey = "customer-reviews";

      // ✅ Check Redis cache first
      if (redis) {
        const cached = await redis.get(cacheKey);
        if (cached) {
          strapi.log.info("⚡ Serving reviews from Redis cache");
          return JSON.parse(cached);
        }
      }

      // ❌ Not cached → fetch from DB
      const response = await super.find(ctx);

      // ✅ Save to Redis with 60s expiry
      if (redis) {
        await redis.set(cacheKey, JSON.stringify(response), "EX", 60);
      }

      return response;
    },

    async findOne(ctx) {
      const { id } = ctx.params;
      const cacheKey = `customer-review:${id}`;

      // ✅ Check cache
      if (redis) {
        const cached = await redis.get(cacheKey);
        if (cached) {
          strapi.log.info(`⚡ Serving review ${id} from Redis cache`);
          return JSON.parse(cached);
        }
      }

      // ❌ Not cached → fetch from DB
      const response = await super.findOne(ctx);

      // ✅ Save to Redis
      if (redis) {
        await redis.set(cacheKey, JSON.stringify(response), "EX", 60);
      }

      return response;
    },

    async create(ctx) {
      const response = await super.create(ctx);

      // 🗑 Clear cache when a new review is added
      if (redis) {
        await redis.del("customer-reviews");
        strapi.log.info("🗑 Cache cleared for customer-reviews");
      }

      return response;
    },

    async update(ctx) {
      const response = await super.update(ctx);
      const { id } = ctx.params;

      // 🗑 Invalidate cache for list + specific review
      if (redis) {
        await redis.del("customer-reviews");
        await redis.del(`customer-review:${id}`);
        strapi.log.info(`🗑 Cache cleared for review ${id}`);
      }

      return response;
    },

    async delete(ctx) {
      const response = await super.delete(ctx);
      const { id } = ctx.params;

      // 🗑 Invalidate cache for list + specific review
      if (redis) {
        await redis.del("customer-reviews");
        await redis.del(`customer-review:${id}`);
        strapi.log.info(`🗑 Cache cleared for review ${id}`);
      }

      return response;
    },
  })
);

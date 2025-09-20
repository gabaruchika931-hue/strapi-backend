/**
 * review controller
 */

import { factories } from '@strapi/strapi';
import redis from '../../../../config/redis'; // adjust path if needed

export default factories.createCoreController('api::review.review', ({ strapi }) => ({
  // GET /api/reviews
  async find(ctx) {
    const cacheKey = 'reviews_cache';

    const cached = await redis.get(cacheKey);
    if (cached) {
      strapi.log.info('⚡ Serving reviews from Redis cache');
      return JSON.parse(cached);
    }

    const response = await super.find(ctx);

    await redis.set(cacheKey, JSON.stringify(response), 'EX', 60 * 5);
    return response;
  },

  // GET /api/reviews/:id
  async findOne(ctx) {
    const { id } = ctx.params;
    const cacheKey = `review_cache:${id}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      strapi.log.info(`⚡ Serving review ${id} from Redis cache`);
      return JSON.parse(cached);
    }

    const response = await super.findOne(ctx);

    await redis.set(cacheKey, JSON.stringify(response), 'EX', 60 * 5);
    return response;
  },

  // POST /api/reviews
  async create(ctx) {
    const response = await super.create(ctx);

    await redis.del('reviews_cache');
    strapi.log.info('🗑 Cache cleared for reviews');

    return response;
  },

  // PUT /api/reviews/:id
  async update(ctx) {
    const response = await super.update(ctx);
    const { id } = ctx.params;

    await redis.del('reviews_cache');
    await redis.del(`review_cache:${id}`);
    strapi.log.info(`🗑 Cache cleared for review ${id}`);

    return response;
  },

  // DELETE /api/reviews/:id
  async delete(ctx) {
    const response = await super.delete(ctx);
    const { id } = ctx.params;

    await redis.del('reviews_cache');
    await redis.del(`review_cache:${id}`);
    strapi.log.info(`🗑 Cache cleared for review ${id}`);

    return response;
  },
}));

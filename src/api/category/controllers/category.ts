/**
 * category controller
 */

import { factories } from '@strapi/strapi';
import redis from '../../..//../config/redis'; // adjust path if needed

export default factories.createCoreController('api::category.category', ({ strapi }) => ({
  // GET /api/categories
  async find(ctx) {
    const cacheKey = 'categories_cache';

    // Check Redis cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      strapi.log.info('⚡ Serving categories from Redis cache');
      return JSON.parse(cached);
    }

    // Not cached → fetch from DB
    const response = await super.find(ctx);

    // Save to Redis (expires in 5 mins)
    await redis.set(cacheKey, JSON.stringify(response), 'EX', 60 * 5);

    return response;
  },

  // GET /api/categories/:id
  async findOne(ctx) {
    const { id } = ctx.params;
    const cacheKey = `category_cache:${id}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      strapi.log.info(`⚡ Serving category ${id} from Redis cache`);
      return JSON.parse(cached);
    }

    const response = await super.findOne(ctx);

    await redis.set(cacheKey, JSON.stringify(response), 'EX', 60 * 5);

    return response;
  },

  // POST /api/categories
  async create(ctx) {
    const response = await super.create(ctx);

    // Clear list cache
    await redis.del('categories_cache');
    strapi.log.info('🗑 Cache cleared for categories');

    return response;
  },

  // PUT /api/categories/:id
  async update(ctx) {
    const response = await super.update(ctx);
    const { id } = ctx.params;

    await redis.del('categories_cache');
    await redis.del(`category_cache:${id}`);
    strapi.log.info(`🗑 Cache cleared for category ${id}`);

    return response;
  },

  // DELETE /api/categories/:id
  async delete(ctx) {
    const response = await super.delete(ctx);
    const { id } = ctx.params;

    await redis.del('categories_cache');
    await redis.del(`category_cache:${id}`);
    strapi.log.info(`🗑 Cache cleared for category ${id}`);

    return response;
  },
}));

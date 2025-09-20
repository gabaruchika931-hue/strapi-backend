/**
 * product controller
 */

import { factories } from '@strapi/strapi';
import redis from '../../../../config/redis'; // adjust path if needed

export default factories.createCoreController('api::product.product', ({ strapi }) => ({
  // GET /api/products
  async find(ctx) {
    const cacheKey = 'products_cache:/api/products';

    // Check Redis cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      strapi.log.info('⚡ Serving products from Redis cache');
      return JSON.parse(cached);
    }

    // If not cached, fetch from DB
    const response = await super.find(ctx);

    // Cache the response for 5 minutes
    await redis.set(cacheKey, JSON.stringify(response), 'EX', 60 * 5);

    return response;
  },

  // GET /api/products/:id
  async findOne(ctx) {
    const { id } = ctx.params;
    const cacheKey = `products_cache:/api/products/${id}`;

    // Check Redis cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      strapi.log.info(`⚡ Serving product ${id} from Redis cache`);
      return JSON.parse(cached);
    }

    // Fetch from DB
    const response = await super.findOne(ctx);

    // Cache the response for 5 minutes
    await redis.set(cacheKey, JSON.stringify(response), 'EX', 60 * 5);

    return response;
  },
}));

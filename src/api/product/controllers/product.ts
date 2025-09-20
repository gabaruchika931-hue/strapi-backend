import { factories } from '@strapi/strapi';
import redis from '../../../../config/redis';

export default factories.createCoreController('api::product.product', ({ strapi }) => ({
  async find(ctx) {
    const cacheKey = 'products_cache:/api/products';
    const cached = await redis.get(cacheKey);

    if (cached) {
      strapi.log.info('⚡ Serving products from Redis cache');
      return JSON.parse(cached);
    }

    const response = await super.find(ctx);
    await redis.set(cacheKey, JSON.stringify(response), 'EX', 60 * 5);
    return response;
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const cacheKey = `products_cache:/api/products/${id}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      strapi.log.info(`⚡ Serving product ${id} from Redis cache`);
      return JSON.parse(cached);
    }

    const response = await super.findOne(ctx);
    await redis.set(cacheKey, JSON.stringify(response), 'EX', 60 * 5);
    return response;
  },
}));

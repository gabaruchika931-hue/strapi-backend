import redis from '../../../../../config/redis';

export default {
  async afterCreate() {
    // Refresh the full products cache
    const products = await strapi.db.query('api::product.product').findMany();
    await redis.set('products_cache:/api/products', JSON.stringify({ data: products }), 'EX', 60 * 5);
  },

  async afterUpdate({ result }) {
    // Refresh full cache
    const products = await strapi.db.query('api::product.product').findMany();
    await redis.set('products_cache:/api/products', JSON.stringify({ data: products }), 'EX', 60 * 5);

    // Refresh single product cache
    await redis.set(`products_cache:/api/products/${result.id}`, JSON.stringify({ data: result }), 'EX', 60 * 5);
  },

  async afterDelete({ result }) {
    // Refresh full cache
    const products = await strapi.db.query('api::product.product').findMany();
    await redis.set('products_cache:/api/products', JSON.stringify({ data: products }), 'EX', 60 * 5);

    // Delete single product cache
    await redis.del(`products_cache:/api/products/${result.id}`);
  },
};

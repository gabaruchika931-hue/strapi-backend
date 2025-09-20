import redis from '../../../../../config/redis';

export default {
  afterCreate() {
    redis.del('products_cache:/api/products');
  },
  afterUpdate({ result }) {
    redis.del('products_cache:/api/products');
    redis.del(`products_cache:/api/products/${result.id}`);
  },
  afterDelete({ result }) {
    redis.del('products_cache:/api/products');
    redis.del(`products_cache:/api/products/${result.id}`);
  },
};

import redis from '../../../../../config/redis';

export default {
  afterCreate() {
    if (redis) {
      redis.del('categories_cache');
    }
  },

  afterUpdate({ result }) {
    if (redis) {
      redis.del('categories_cache');
      redis.del(`category_cache:${result.id}`);
    }
  },

  afterDelete({ result }) {
    if (redis) {
      redis.del('categories_cache');
      redis.del(`category_cache:${result.id}`);
    }
  },
};

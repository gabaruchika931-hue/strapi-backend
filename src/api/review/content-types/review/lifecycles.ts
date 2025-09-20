import redis from '../../../../../config/redis';

export default {
  afterCreate() {
    if (redis) {
      redis.del('reviews_cache');
    }
  },

  afterUpdate({ result }) {
    if (redis) {
      redis.del('reviews_cache');
      redis.del(`review_cache:${result.id}`);
    }
  },

  afterDelete({ result }) {
    if (redis) {
      redis.del('reviews_cache');
      redis.del(`review_cache:${result.id}`);
    }
  },
};

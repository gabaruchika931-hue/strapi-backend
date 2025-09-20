import redis from '../../../../../config/redis';

export default {
  // After a new review is created
  afterCreate() {
    if (redis) {
      redis.del('customer-reviews');
    }
  },

  // After a review is updated
  afterUpdate({ result }) {
    if (redis) {
      redis.del('customer-reviews');
      redis.del(`customer-review:${result.id}`);
    }
  },

  // After a review is deleted
  afterDelete({ result }) {
    if (redis) {
      redis.del('customer-reviews');
      redis.del(`customer-review:${result.id}`);
    }
  },
};

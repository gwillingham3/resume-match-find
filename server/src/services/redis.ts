import redisClient from '../config/redis';

export const cacheService = {
  async get(key: string): Promise<string | null> {
    if (!redisClient) return null;
    try {
      return await redisClient.get(key);
    } catch (err) {
      console.warn('Error getting from cache:', err);
      return null;
    }
  },

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (!redisClient) return;
    try {
      if (ttl) {
        await redisClient.setex(key, ttl, value);
      } else {
        await redisClient.set(key, value);
      }
    } catch (err) {
      console.warn('Error setting cache:', err);
    }
  },

  async del(key: string): Promise<void> {
    if (!redisClient) return;
    try {
      await redisClient.del(key);
    } catch (err) {
      console.warn('Error deleting from cache:', err);
    }
  },

  async exists(key: string): Promise<boolean> {
    if (!redisClient) return false;
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (err) {
      console.warn('Error checking cache existence:', err);
      return false;
    }
  }
};

export default redisClient;

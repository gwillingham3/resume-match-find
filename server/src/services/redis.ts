import Redis from 'ioredis';
require('dotenv').config();

let redis: Redis | null = null;

try {
  redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  });

  redis.on('error', (err) => {
    console.warn('Redis connection error:', err);
    redis = null;
  });
} catch (err) {
  console.warn('Failed to initialize Redis:', err);
  redis = null;
}

export const cacheService = {
  async get(key: string): Promise<string | null> {
    if (!redis) return null;
    try {
      return await redis.get(key);
    } catch (err) {
      console.warn('Error getting from cache:', err);
      return null;
    }
  },

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (!redis) return;
    try {
      if (ttl) {
        await redis.setex(key, ttl, value);
      } else {
        await redis.set(key, value);
      }
    } catch (err) {
      console.warn('Error setting cache:', err);
    }
  },

  async del(key: string): Promise<void> {
    if (!redis) return;
    try {
      await redis.del(key);
    } catch (err) {
      console.warn('Error deleting from cache:', err);
    }
  },

  async exists(key: string): Promise<boolean> {
    if (!redis) return false;
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (err) {
      console.warn('Error checking cache existence:', err);
      return false;
    }
  }
};

export default redis;

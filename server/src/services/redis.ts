import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});

export const cacheService = {
  async get(key: string): Promise<string | null> {
    return redis.get(key);
  },

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await redis.setex(key, ttl, value);
    } else {
      await redis.set(key, value);
    }
  },

  async del(key: string): Promise<void> {
    await redis.del(key);
  },

  async exists(key: string): Promise<boolean> {
    const result = await redis.exists(key);
    return result === 1;
  }
};

export default redis; 
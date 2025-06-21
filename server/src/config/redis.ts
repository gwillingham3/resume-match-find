import Redis from 'ioredis';
require('dotenv').config();

let redisClient: Redis | null = null;

try {
  redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    username: process.env.REDIS_USERNAME || undefined,
    password: process.env.REDIS_PASSWORD || undefined,
  });

  redisClient.on('error', (err: Error) => {
    console.warn('Redis Client Error:', err);
    redisClient = null;
  });

} catch (err) {
  console.warn('Failed to initialize Redis client:', err);
  redisClient = null;
}

export default redisClient;

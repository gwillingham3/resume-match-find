import Redis from 'ioredis';
require('dotenv').config();

let redisClient: Redis | null = null;

try {
  const redisUrl = `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

  /*redisClient = new Redis({
    host: process.env.REDIS_HOST || 'NOT SET',
    port: parseInt(process.env.REDIS_PORT || 'NOT SET'),
    username: process.env.REDIS_USERNAME || undefined,
    password: process.env.REDIS_PASSWORD || undefined,
  });*/
  
  redisClient = new Redis(redisUrl);

  redisClient.on('error', (err: Error) => {
    console.warn('Redis Client Error:', err);
    redisClient = null;
  });

} catch (err) {
  console.warn('Failed to initialize Redis client:', err);
  redisClient = null;
}

export default redisClient;

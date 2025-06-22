import Redis from 'ioredis';
require('dotenv').config();

let redisClient: Redis | null = null;

try {
  redisClient = new Redis({
    host: process.env.REDIS_HOST || 'NOT SET',
    port: parseInt(process.env.REDIS_PORT || 'NOT SET'),
    username: process.env.REDIS_USERNAME || undefined,
    password: process.env.REDIS_PASSWORD || undefined,
  });

  console.log('All env vars starting with REDIS:');
  Object.keys(process.env)
    .filter(key => key.startsWith('REDIS'))
    .forEach(key => {
      console.log(`${key}:`, process.env[key] ? process.env[key] : '[NOT SET]');
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

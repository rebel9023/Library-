import Redis from 'ioredis';
import { env } from './env';

export const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  lazyConnect: true,
  retryStrategy(times) {
    if (times > 3) {
      console.warn('Redis reconnection limit reached, using memory cache fallback.');
      return null;
    }
    return Math.min(times * 100, 2000);
  }
});

redis.on('connect', () => {
  console.log('Connected to Redis Cache successfully');
});

redis.on('error', (err) => {
  console.warn('Redis Connection Warning:', err.message);
});

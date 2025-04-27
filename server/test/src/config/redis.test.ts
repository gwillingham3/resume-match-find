// server/test/src/config/redis.test.ts
import { describe, it, expect } from 'vitest';
import * as redisConfig from '../../../src/config/redis';

describe('redis config', () => {
  it('should import without errors', () => {
    expect(redisConfig).toBeDefined();
  });
});

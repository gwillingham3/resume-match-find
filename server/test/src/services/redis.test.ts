// server/test/src/services/redis.test.ts
import { describe, it, expect } from 'vitest';
import * as redisService from '../../../src/services/redis';

describe('redis service', () => {
  it('should import without errors', () => {
    expect(redisService).toBeDefined();
  });
});

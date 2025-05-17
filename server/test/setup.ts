// server/test/setup.ts
import { vi } from 'vitest';

vi.mock('ioredis', async () => {
  const RedisMock = await import('ioredis-mock');
  return {
    default: RedisMock.default || RedisMock,
  };
});
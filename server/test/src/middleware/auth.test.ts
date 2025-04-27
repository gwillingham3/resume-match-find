// server/src/middleware/auth.test.ts
import { describe, it, expect } from 'vitest';
import * as authMiddleware from '../../../src/middleware/auth';

describe('auth middleware', () => {
  it('should import without errors', () => {
    expect(authMiddleware).toBeDefined();
  });
});

// server/test/src/routes/auth.test.ts
import { describe, it, expect } from 'vitest';
import * as authRoutes from '../../../src/routes/auth';

describe('auth routes', () => {
  it('should import without errors', () => {
    expect(authRoutes).toBeDefined();
  });
});

// src/test/services/auth.test.ts
import { describe, it, expect } from 'vitest';
import * as authService from '@/services/auth';

describe('auth service', () => {
  it('should import without errors', () => {
    expect(authService).toBeDefined();
  });
});

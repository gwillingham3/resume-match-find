// server/test/src/middleware/methodRestriction.test.ts
import { describe, it, expect } from 'vitest';
import * as methodRestrictionMiddleware from '../../../src/middleware/methodRestriction';

describe('methodRestriction middleware', () => {
  it('should import without errors', () => {
    expect(methodRestrictionMiddleware).toBeDefined();
  });
});

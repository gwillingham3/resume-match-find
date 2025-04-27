// server/test/src/middleware/compose.test.ts
import { describe, it, expect } from 'vitest';
import * as composeMiddleware from '../../../src/middleware/compose';

describe('compose middleware', () => {
  it('should import without errors', () => {
    expect(composeMiddleware).toBeDefined();
  });
});

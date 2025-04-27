// server/test/src/middleware/contentType.test.ts
import { describe, it, expect } from 'vitest';
import * as contentTypeMiddleware from '../../../src/middleware/contentType';

describe('contentType middleware', () => {
  it('should import without errors', () => {
    expect(contentTypeMiddleware).toBeDefined();
  });
});

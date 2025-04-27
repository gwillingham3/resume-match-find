// server/test/src/utils/validation.test.ts
import { describe, it, expect } from 'vitest';
import * as validationUtils from '../../../src/utils/validation';

describe('validation utils', () => {
  it('should import without errors', () => {
    expect(validationUtils).toBeDefined();
  });
});

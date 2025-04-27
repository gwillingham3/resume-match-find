// src/test/lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('utils', () => {
  it('should import without errors', () => {
    expect(cn).toBeDefined();
  });
});

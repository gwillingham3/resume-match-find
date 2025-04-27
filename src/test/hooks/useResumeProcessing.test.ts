// src/test/hooks/useResumeProcessing.test.ts
import { describe, it, expect } from 'vitest';
import { useResumeProcessing } from '@/hooks/useResumeProcessing';

describe('useResumeProcessing hook', () => {
  it('should import without errors', () => {
    expect(useResumeProcessing).toBeDefined();
  });
});

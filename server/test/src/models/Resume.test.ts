// server/test/src/models/Resume.test.ts
import { describe, it, expect } from 'vitest';
import * as ResumeModel from '../../../src/models/Resume';

describe('Resume model', () => {
  it('should import without errors', () => {
    expect(ResumeModel).toBeDefined();
  });
});

// server/test/src/services/matchScore.test.ts
import { describe, it, expect } from 'vitest';
import * as matchScoreService from '../../../src/services/matchScore';

describe('matchScore service', () => {
  it('should import without errors', () => {
    expect(matchScoreService).toBeDefined();
  });
});

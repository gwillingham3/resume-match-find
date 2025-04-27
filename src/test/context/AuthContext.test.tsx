// src/test/context/AuthContext.test.tsx
import { describe, it, expect } from 'vitest';
import * as AuthContext from '../../../src/context/AuthContext';

describe('AuthContext', () => {
  it('should import without errors', () => {
    expect(AuthContext).toBeDefined();
  });
});

// src/test/services/auth.test.ts
import { describe, it, expect } from 'vitest';
import * as authService from '@/services/auth';

describe('auth service', () => {
  it('should import without errors', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const credentials = { email: 'test@example.com', password: 'password' };
      const response = await authService.authService.login(credentials);

      expect(response).toEqual({
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        token: 'test_token',
      });
    });

    it('should handle login failure with invalid credentials', async () => {
      // Define a mock for the failed login scenario in src/mocks/handlers.ts
      const credentials = { email: 'test@example.com', password: 'wrong_password' };

      await expect(authService.authService.login(credentials)).rejects.toThrow('Request failed with status code 401');
    });
  });

});

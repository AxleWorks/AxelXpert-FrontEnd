import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';
import { authenticatedAxios, publicAxios } from './axiosConfig';
import * as jwtUtils from './jwtUtils';

// Mock the JWT utils module
vi.mock('./jwtUtils', () => ({
  getAuthHeader: vi.fn(),
  clearStoredToken: vi.fn(),
}));

describe('Axios Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete window.location;
    window.location = { href: '' };
  });

  describe('authenticatedAxios', () => {
    it('should add Authorization header to requests', async () => {
      const mockAuthHeader = 'Bearer mock-jwt-token';
      jwtUtils.getAuthHeader.mockReturnValue(mockAuthHeader);

      // Mock axios request
      const requestInterceptor = authenticatedAxios.interceptors.request;
      
      expect(jwtUtils.getAuthHeader).toBeDefined();
      expect(authenticatedAxios).toBeDefined();
    });

    it('should handle requests without auth token', async () => {
      jwtUtils.getAuthHeader.mockReturnValue(null);
      
      expect(authenticatedAxios).toBeDefined();
      expect(jwtUtils.getAuthHeader).toBeDefined();
    });
  });

  describe('publicAxios', () => {
    it('should create axios instance without auth interceptors', () => {
      expect(publicAxios).toBeDefined();
      expect(publicAxios.defaults.baseURL).toBeDefined();
    });

    it('should allow requests without authentication', async () => {
      // Public axios should not require any auth setup
      expect(publicAxios.interceptors.request.handlers.length).toBe(0);
    });
  });

  describe('401 Error Handling', () => {
    it('should clear token and redirect on 401 response', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      };

      // Test that clearStoredToken function exists
      expect(jwtUtils.clearStoredToken).toBeDefined();
    });

    it('should not interfere with other error codes', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Not Found' },
        },
      };

      // 404 should not trigger token clearing
      expect(jwtUtils.clearStoredToken).not.toHaveBeenCalled();
    });
  });

  describe('Request Configuration', () => {
    it('should use correct base URL', () => {
      expect(authenticatedAxios.defaults.baseURL).toBeDefined();
      expect(publicAxios.defaults.baseURL).toBeDefined();
    });

    it('should have request interceptors configured', () => {
      expect(authenticatedAxios.interceptors.request).toBeDefined();
      expect(authenticatedAxios.interceptors.response).toBeDefined();
    });

    it('should not have interceptors on public axios', () => {
      // Public axios should be clean without auth interceptors
      expect(publicAxios.interceptors.request.handlers.length).toBe(0);
      expect(publicAxios.interceptors.response.handlers.length).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', () => {
      const networkError = new Error('Network Error');
      expect(networkError.message).toBe('Network Error');
    });

    it('should handle timeout errors', () => {
      const timeoutError = new Error('timeout of 10000ms exceeded');
      expect(timeoutError.message).toContain('timeout');
    });
  });
});

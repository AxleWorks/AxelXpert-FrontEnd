/**
 * Axios utility for authenticated API requests
 */
import axios from 'axios';
import { getAuthHeader, clearStoredToken } from './jwtUtils.js';

// Create an axios instance with authentication interceptors
const createAuthenticatedAxios = () => {
  const instance = axios.create();

  // Request interceptor to add authorization header
  instance.interceptors.request.use(
    (config) => {
      const authHeader = getAuthHeader();
      if (authHeader) {
        config.headers.Authorization = authHeader;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle 401 errors
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid, clear stored token and redirect to login
        clearStoredToken();
        window.location.href = '/signin';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Export configured axios instance
export const authenticatedAxios = createAuthenticatedAxios();

// Export regular axios for public endpoints (login, signup, etc.)
export const publicAxios = axios;
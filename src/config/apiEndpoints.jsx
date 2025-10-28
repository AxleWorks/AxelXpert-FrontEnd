// Base API configuration for the application
export const API_BASE = "http://localhost:8080";
export const API_PREFIX = "/api";

// Centralized API endpoints for reuse across the app
export const EMPLOYEES_URL = `${API_BASE}${API_PREFIX}/users/employees`;
export const BOOKINGS_URL = `${API_BASE}${API_PREFIX}/bookings/all`;
export const BRANCHES_URL = `${API_BASE}${API_PREFIX}/branches`;
export const USERS_URL = `${API_BASE}${API_PREFIX}/users`;
export const VEHICLES_URL = `${API_BASE}${API_PREFIX}/vehicles`;
export const SERVICES_URL = `${API_BASE}${API_PREFIX}/services`;
export const AUTH_URL = `${API_BASE}${API_PREFIX}/auth`;
export const PROFILE_IMAGE_URL = `${API_BASE}${API_PREFIX}/users/{id}/profile-image`;

export default {
  API_BASE,
  API_PREFIX,
  EMPLOYEES_URL,
  BOOKINGS_URL,
  BRANCHES_URL,
  USERS_URL,
  VEHICLES_URL,
  SERVICES_URL,
  AUTH_URL,
  PROFILE_IMAGE_URL,
};

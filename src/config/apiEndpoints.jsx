// Centralized API endpoints for reuse across the app
export const API_BASE = "http://localhost:8080";

// Endpoints
export const EMPLOYEES_URL = `${API_BASE}/api/users/employees`;
export const BOOKINGS_URL = `${API_BASE}/api/bookings/all`;
export const BRANCHES_URL = `${API_BASE}/api/branches`;
export const USERS_URL = `${API_BASE}/api/users`;

export default {
  API_BASE,
  EMPLOYEES_URL,
  BOOKINGS_URL,
  BRANCHES_URL,
  USERS_URL,
};

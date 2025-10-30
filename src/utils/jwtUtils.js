/**
 * JWT Token utility functions for handling JWT tokens and authentication
 */

/**
 * Decode JWT token payload without verification
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload or null if invalid
 */
export const decodeJWTToken = (token) => {
  try {
    if (!token || typeof token !== "string") return null;

    // JWT has 3 parts separated by dots: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Decode the payload (second part)
    const payload = parts[1];

    // Add padding if needed (base64url might not have padding)
    const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);

    // Decode base64url to JSON
    const decoded = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));

    return JSON.parse(decoded);
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
};

/**
 * Check if JWT token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if expired, false otherwise
 */
export const isTokenExpired = (token) => {
  try {
    const payload = decodeJWTToken(token);
    if (!payload || !payload.exp) return true;

    // exp is in seconds, Date.now() is in milliseconds
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
};

/**
 * Get user data from JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} User data from token or null
 */
export const getUserDataFromToken = (token) => {
  try {
    const payload = decodeJWTToken(token);
    if (!payload) return null;

    return {
      id: payload.id,
      username: payload.sub, // JWT standard field for subject (username)
      email: payload.email,
      role: payload.role?.toLowerCase(), // Normalize role to lowercase
      branchId: payload.branchId,
      iat: payload.iat, // Issued at
      exp: payload.exp, // Expiration
    };
  } catch (error) {
    console.error("Error extracting user data from token:", error);
    return null;
  }
};

/**
 * Get stored access token from localStorage
 * @returns {string|null} Access token or null if not found
 */
export const getStoredAccessToken = () => {
  try {
    const authUser = localStorage.getItem("authUser");
    if (!authUser) return null;

    const userData = JSON.parse(authUser);
    return userData.accessToken || null;
  } catch (error) {
    console.error("Error getting stored access token:", error);
    return null;
  }
};

/**
 * Store access token in localStorage
 * @param {string} accessToken - JWT access token
 */
export const storeAccessToken = (accessToken) => {
  try {
    // Get current auth user data or create new
    let authUser = {};
    try {
      const stored = localStorage.getItem("authUser");
      if (stored) authUser = JSON.parse(stored);
    } catch (e) {
      // ignore parsing errors
    }

    // Add access token to auth user data
    authUser.accessToken = accessToken;

    // Store back to localStorage
    localStorage.setItem("authUser", JSON.stringify(authUser));
  } catch (error) {
    console.error("Error storing access token:", error);
  }
};

/**
 * Remove access token and clear auth data
 */
export const clearStoredToken = () => {
  try {
    localStorage.removeItem("authUser");
  } catch (error) {
    console.error("Error clearing stored token:", error);
  }
};

/**
 * Get Authorization header value for API requests
 * @returns {string|null} Bearer token header value or null
 */
export const getAuthHeader = () => {
  const token = getStoredAccessToken();
  return token ? `Bearer ${token}` : null;
};

/**
 * Get current user data from stored token
 * @returns {Object|null} User data from token or null
 */
export const getCurrentUser = () => {
  const token = getStoredAccessToken();
  if (!token || isTokenExpired(token)) {
    return null;
  }
  return getUserDataFromToken(token);
};

/**
 * Check if user is authenticated (has valid token)
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  const token = getStoredAccessToken();
  return token && !isTokenExpired(token);
};

/**
 * Create authenticated fetch options with Bearer token
 * @param {Object} options - Additional fetch options
 * @returns {Object} Fetch options with Authorization header
 */
export const createAuthenticatedFetchOptions = (options = {}) => {
  const authHeader = getAuthHeader();

  return {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(authHeader && { Authorization: authHeader }),
      ...options.headers,
    },
  };
};

/**
 * Validate token and return user data if valid
 * @param {string} token - JWT token to validate
 * @returns {Object|null} User data if token is valid, null otherwise
 */
export const validateToken = (token) => {
  if (!token || isTokenExpired(token)) {
    return null;
  }

  return getUserDataFromToken(token);
};

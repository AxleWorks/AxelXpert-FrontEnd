import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getCurrentUser,
  isAuthenticated as checkTokenAuth,
  storeAccessToken,
  clearStoredToken,
} from "../utils/jwtUtils";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Get user data from JWT token instead of directly from localStorage
    return getCurrentUser();
  });

  const [loading, setLoading] = useState(false);

  // Monitor token changes and update user accordingly
  useEffect(() => {
    const checkAuth = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    };

    // Check auth status on mount and periodically
    checkAuth();

    // Optional: Set up interval to check token expiration periodically
    const interval = setInterval(checkAuth, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const setAuthUser = (accessToken) => {
    try {
      // Store the access token
      storeAccessToken(accessToken);

      // Get user data from the token and update state
      const userData = getCurrentUser();
      setUser(userData);
      setLoading(false);
    } catch (error) {
      console.error("Error setting auth user:", error);
      setUser(null);
      setLoading(false);
    }
  };

  const clearAuthUser = () => {
    setUser(null);
    setLoading(false);
    clearStoredToken();
  };

  const isAuthenticated = checkTokenAuth();

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, setAuthUser, clearAuthUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

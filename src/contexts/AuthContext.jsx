import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    // Authentication logic
    let userData = null;

    if (username === "user" && password === "password") {
      userData = {
        id: 1,
        username: "user",
        role: "user",
        name: "John Customer",
        email: "user@axlexpert.com",
      };
    } else if (username === "employee" && password === "password") {
      userData = {
        id: 2,
        username: "employee",
        role: "employee",
        name: "Sarah Employee",
        email: "employee@axlexpert.com",
      };
    } else if (username === "manager" && password === "password") {
      userData = {
        id: 3,
        username: "manager",
        role: "manager",
        name: "Mike Manager",
        email: "manager@axlexpert.com",
      };
    } else {
      throw new Error("Invalid credentials");
    }

    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));

    return userData;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("authUser");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // persist minimal auth info
    if (user) localStorage.setItem("authUser", JSON.stringify(user));
    else localStorage.removeItem("authUser");
  }, [user]);

  const setAuthUser = (u) => {
    setUser(u);
    setLoading(false);
  };

  const clearAuthUser = () => {
    setUser(null);
    setLoading(false);
    try {
      localStorage.removeItem("authUser");
    } catch (e) {
      /* ignore */
    }
  };

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, setAuthUser, clearAuthUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

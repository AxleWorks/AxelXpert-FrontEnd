import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { publicAxios } from "../../utils/axiosConfig.js";
import AuthLayout from "./AuthLayout";
import AuthBranding from "./AuthBranding";
import AuthFormContainer from "./AuthFormContainer";
import { AUTH_URL } from "../../config/apiEndpoints";

const SignIn = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();

  useEffect(() => {
    // quick backend status check
    (async () => {
      try {
        await publicAxios.get(`${AUTH_URL}/status`);
      } catch {
        // ignore - used only for quick healthcheck
      }
    })();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await publicAxios.post(`${AUTH_URL}/login`, {
        email: formData.email,
        password: formData.password,
      });

      // If backend returns an object with user data, save it and update context/localStorage
      const data = res && res.data;
      if (data && typeof data === "object" && data.username) {
        // normalize role to lowercase because ProtectedRoute expects 'user'|'employee'|'manager'
        const role = String(data.role || "").toLowerCase();
        const userData = {
          id: data.id,
          username: data.username,
          email: data.email,
          role,
          branchId: data.branchId, // Include branchId from backend response
          branchName: data.branchName, // Include branchName if available
          profileImageUrl: data.profileImageUrl, // Include profile image if available
        };

        console.log("Login successful:", userData);

        // save to localStorage
        try {
          localStorage.setItem("authUser", JSON.stringify(userData));
        } catch (e) {
          // ignore storage errors
        }

        if (setAuthUser) setAuthUser(userData);

        const roleMap = {
          user: "/user/dashboard",
          employee: "/employee/dashboard",
          manager: "/manager/dashboard",
        };
        const target = roleMap[role] || "/";
        navigate(target);
        return;
      }

      // If backend returned a plain message with 200, show it as info/error
      if (res && res.status === 200) {
        setError(String(res.data || "Login response received"));
      }

      // If no accessToken in response
      setError("Invalid response from server. Please try again.");
    } catch (err) {
      console.error("Login error:", err);

      // Handle different error scenarios
      if (err.response) {
        const errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          err.response.data;

        switch (err.response.status) {
          case 401:
            setError("Invalid email or password");
            break;
          case 403:
            setError("Account not activated. Please check your email.");
            break;
          case 404:
            setError("User not found");
            break;
          default:
            setError(
              typeof errorMessage === "string"
                ? errorMessage
                : "Login failed. Please try again."
            );
        }
      } else if (err.request) {
        setError(
          "Cannot connect to server. Please check if backend is running."
        );
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const leftContent = <AuthBranding subtitle="Your Car, Our Expertise." />;

  const rightContent = (
    <AuthFormContainer title="Sign In" error={error}>
      <form onSubmit={handleSubmit} noValidate>
        <Typography variant="body2" sx={{ mb: 1, color: "#64748b" }}>
          Email
        </Typography>
        <TextField
          placeholder="Enter your username"
          type="text"
          variant="outlined"
          fullWidth
          margin="normal"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#f8fafc",
              color: "#0f172a",
              borderRadius: 2,
              "& fieldset": { border: "1px solid #e2e8f0" },
              "&:hover fieldset": { borderColor: "#3b82f6" },
              "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
            },
          }}
        />

        <Typography variant="body2" sx={{ mb: 1, color: "#64748b" }}>
          Password
        </Typography>
        <TextField
          placeholder="Enter your password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#f8fafc",
              borderRadius: 2,
              color: "#0f172a",
              "& fieldset": { border: "1px solid #e2e8f0" },
              "&:hover fieldset": { borderColor: "#3b82f6" },
              "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
            },
          }}
        />

        <Box sx={{ textAlign: "right", mb: 3 }}>
          <Link
            to="/forgot-password"
            style={{ color: "#3b82f6", textDecoration: "none" }}
          >
            Forgot Password?
          </Link>
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            backgroundColor: "#3b82f6",
            color: "white",
            py: 1.5,
            fontSize: "1rem",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 2,
            mb: 2,
            boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.39)",
            "&:hover": {
              backgroundColor: "#2563eb",
              boxShadow: "0 6px 20px 0 rgba(59, 130, 246, 0.5)",
            },
            "&:disabled": {
              backgroundColor: "#94a3b8",
            },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
        </Button>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Don't you have an account?{" "}
            <Link
              to="/signup"
              style={{ color: "#3b82f6", textDecoration: "none" }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </form>
    </AuthFormContainer>
  );

  return (
    <AuthLayout
      leftContent={leftContent}
      rightContent={rightContent}
      backgroundImage="https://images.unsplash.com/photo-1727893304219-063d142ce6f3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    />
  );
};

export default SignIn;

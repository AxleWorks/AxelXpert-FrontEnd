import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { publicAxios } from "../../utils/axiosConfig.js";
import AuthLayout from "./AuthLayout";
import AuthBranding from "./AuthBranding";
import AuthFormContainer from "./AuthFormContainer";
import { AUTH_URL } from "../../config/apiEndpoints";

const SignIn = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // call backend login endpoint and expect LoginResponse with accessToken
      const res = await publicAxios.post(`${AUTH_URL}/login`, {
        email: username,
        password,
      });

      // If backend returns accessToken, store it and decode user data
      const data = res && res.data;
      if (data && typeof data === "object" && data.accessToken) {
        console.log("Login successful, access token received");

        // Store access token and let AuthContext decode user data from JWT
        if (setAuthUser) setAuthUser(data.accessToken);

        // Get user role from JWT token to determine navigation
        const payload = JSON.parse(atob(data.accessToken.split(".")[1]));
        const role = String(payload.role || "").toLowerCase();

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
    } catch (err) {
      if (err.response && err.response.data)
        setError(String(err.response.data));
      else setError(err.message || "Login failed");
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
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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

        {/* error is displayed at the top of AuthFormContainer; removed inline Alert to avoid duplication */}

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
          {loading ? "Signing in..." : "Sign In"}
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

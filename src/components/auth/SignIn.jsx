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
import axios from "axios";
import AuthLayout from "./AuthLayout";
import AuthBranding from "./AuthBranding";
import AuthFormContainer from "./AuthFormContainer";

const SignIn = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();

  useEffect(() => {
    // quick backend status check
    let mounted = true;
    (async () => {
      try {
        await axios.get("http://localhost:8080/api/auth/status");
      } catch (e) {
        // ignore - used only for quick healthcheck
      }
    })();
    return () => (mounted = false);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // call backend login endpoint and expect LoginResponse {id, username, email, role}
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email: username,
        password,
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
      {/* Login Instructions */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: "#f8fafc", borderRadius: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{ mb: 1, fontWeight: 700, color: "#0f172a" }}
        >
          Test Login Credentials
        </Typography>

        {/* prettier-ignore */}
        <Box sx={{ mt: 1 }}>
          <Stack spacing={1}>
            {[
              { role: 'User', username: 'user', password: 'password', color: '#10b981' },
              { role: 'Employee', username: 'employee', password: 'password', color: '#3b82f6' },
              { role: 'Manager', username: 'manager', password: 'password', color: '#ef4444' },
            ].map((r) => (
              <Box
                key={r.role}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1,
                  bgcolor: '#ffffff',
                  borderRadius: 1,
                  boxShadow: '0 1px 2px rgba(2,6,23,0.06)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      px: 1.2,
                      py: 0.4,
                      bgcolor: r.color,
                      color: '#fff',
                      borderRadius: 0.6,
                      fontWeight: 700,
                      fontSize: '0.8rem',
                    }}
                  >
                    {r.role}
                  </Box>

                  <Typography
                    component="span"
                    sx={{
                      fontFamily:
                        'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
                      color: '#0f172a',
                      fontSize: '0.95rem',
                      ml: 0.5,
                    }}
                  >
                    {r.username} / {r.password}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Tooltip title={/* dynamic via aria-label updated below */ 'Copy credentials'}>
                    <IconButton
                      size="small"
                      aria-label={`Copy ${r.role} credentials`}
                      onClick={() => {
                        try {
                          navigator.clipboard.writeText(`${r.username}:${r.password}`);
                        } catch (e) {
                          // fallback: create temporary textarea
                          const ta = document.createElement('textarea');
                          ta.value = `${r.username}:${r.password}`;
                          document.body.appendChild(ta);
                          ta.select();
                          document.execCommand('copy');
                          document.body.removeChild(ta);
                        }
                      }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </Paper>

      <form onSubmit={handleSubmit} noValidate>
        <Typography variant="body2" sx={{ mb: 1, color: "#64748b" }}>
          Username
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
            to="/forget-password"
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

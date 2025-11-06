import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AuthLayout from "./AuthLayout";
import AuthBranding from "./AuthBranding";
import AuthFormContainer from "./AuthFormContainer";
import { Link } from "react-router-dom";
import { publicAxios } from "../../utils/axiosConfig.js";
import { useNavigate } from "react-router-dom";
import { AUTH_URL } from "../../config/apiEndpoints";

// keep signup simple: call backend /api/auth/signup

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Snackbar state
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setFieldErrors((p) => ({
        ...p,
        password: "Password must be at least 8 characters",
      }));
      setToast({
        open: true,
        message: "Password must be at least 8 characters long",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    try {
      const res = await publicAxios.post(`${AUTH_URL}/signup`, {
        username: userName,
        email,
        password,
      });

      if (res.status === 200) {
        setToast({
          open: true,
          message: "Account created. Check backend for activation link.",
          severity: "success",
        });
        // redirect to sign in after a short delay
        setTimeout(() => navigate("/signin"), 900);
        return;
      }
    } catch (err) {
      if (err.response && err.response.data)
        setError(String(err.response.data));
      else setError("Registration failed. Please try again.");
      setToast({
        open: true,
        message: String(
          err?.response?.data || err.message || "Registration failed"
        ),
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") return;
    setToast((t) => ({ ...t, open: false }));
  };

  useEffect(() => {
    // small backend healthcheck
    (async () => {
      try {
        await publicAxios.get(`${AUTH_URL}/status`);
      } catch {
        // ignore
      }
    })();
  }, []);

  const navigate = useNavigate();

  const validateEmail = (value) => {
    // simple email regex
    return /^\S+@\S+\.\S+$/.test(value);
  };

  const handleBlur = (field) => {
    // Validate on blur and show toasts for invalid input
    if (field === "email") {
      if (!validateEmail(email)) {
        setFieldErrors((p) => ({
          ...p,
          email: "Please enter a valid email address",
        }));
        setToast({
          open: true,
          message: "Please enter a valid email address",
          severity: "error",
        });
      } else {
        setFieldErrors((p) => ({ ...p, email: null }));
      }
    }

    if (field === "password") {
      if (password.length > 0 && password.length < 8) {
        setFieldErrors((p) => ({
          ...p,
          password: "Password must be at least 8 characters",
        }));
        setToast({
          open: true,
          message: "Password must be at least 8 characters long",
          severity: "error",
        });
      } else {
        setFieldErrors((p) => ({ ...p, password: null }));
      }
    }

    if (field === "confirmPassword") {
      if (confirmPassword && confirmPassword !== password) {
        setFieldErrors((p) => ({
          ...p,
          confirmPassword: "Passwords do not match",
        }));
        setToast({
          open: true,
          message: "Passwords do not match",
          severity: "error",
        });
      } else {
        setFieldErrors((p) => ({ ...p, confirmPassword: null }));
      }
    }

    if (field === "userName") {
      if (!userName || userName.trim().length < 2) {
        setFieldErrors((p) => ({ ...p, userName: "Please enter your name" }));
      } else {
        setFieldErrors((p) => ({ ...p, userName: null }));
      }
    }
  };

  const leftContent = <AuthBranding subtitle="Join The AxleXpert Family!" />;

  const rightContent = (
    <AuthFormContainer title="Sign Up" error={error}>
      <form onSubmit={handleSubmit}>
        <Typography variant="body2" sx={{ mb: 1, color: "#64748b" }}>
          User Name
        </Typography>
        <TextField
          placeholder="Enter your full name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          onBlur={() => handleBlur("userName")}
          required
          error={!!fieldErrors.userName}
          helperText={fieldErrors.userName}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#f8fafc",
              borderRadius: 2,
              "& fieldset": { border: "1px solid #e2e8f0" },
              "&:hover fieldset": { borderColor: "#3b82f6" },
              "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
              color: "#0f172a",
            },
          }}
        />

        <Typography variant="body2" sx={{ mb: 1, color: "#64748b" }}>
          Email
        </Typography>
        <TextField
          placeholder="example@email.com"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => handleBlur("email")}
          required
          error={!!fieldErrors.email}
          helperText={fieldErrors.email}
          sx={{
            mb: 2,

            "& .MuiOutlinedInput-root": {
              backgroundColor: "#f8fafc",
              borderRadius: 2,
              "& fieldset": { border: "1px solid #e2e8f0" },
              "&:hover fieldset": { borderColor: "#3b82f6" },
              "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
              color: "#0f172a",
            },
          }}
        />

        <Typography variant="body2" sx={{ mb: 1, color: "#64748b" }}>
          Password
        </Typography>
        <TextField
          placeholder="At least 8 characters"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => handleBlur("password")}
          required
          error={!!fieldErrors.password}
          helperText={fieldErrors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword((s) => !s)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,

            "& .MuiOutlinedInput-root": {
              backgroundColor: "#f8fafc",
              borderRadius: 2,
              "& fieldset": { border: "1px solid #e2e8f0" },
              "&:hover fieldset": { borderColor: "#3b82f6" },
              "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
              color: "#0f172a",
            },
          }}
        />

        <Typography variant="body2" sx={{ mb: 1, color: "#64748b" }}>
          Confirm Password
        </Typography>
        <TextField
          placeholder="Confirm your password"
          type={showConfirmPassword ? "text" : "password"}
          variant="outlined"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => handleBlur("confirmPassword")}
          required
          error={!!fieldErrors.confirmPassword}
          helperText={fieldErrors.confirmPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,

            "& .MuiOutlinedInput-root": {
              backgroundColor: "#f8fafc",
              borderRadius: 2,
              "& fieldset": { border: "1px solid #e2e8f0" },
              "&:hover fieldset": { borderColor: "#3b82f6" },
              "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
              color: "#0f172a",
            },
          }}
        />

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
          {loading ? "Creating Account..." : "Create Account"}
        </Button>

        {/* Toast notifications */}
        <Snackbar
          open={toast.open}
          autoHideDuration={4000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseToast}
            severity={toast.severity}
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        </Snackbar>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Already have an account?{" "}
            <Link
              to="/signin"
              style={{ color: "#3b82f6", textDecoration: "none" }}
            >
              Sign in
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
      backgroundImage="https://images.unsplash.com/photo-1727893332539-95e491ba4d90?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    />
  );
};

export default SignUp;

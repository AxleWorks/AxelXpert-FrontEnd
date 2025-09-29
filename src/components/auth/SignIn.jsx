import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TextField, Button, Typography, Box } from "@mui/material";

import AuthLayout from "./AuthLayout";
import AuthBranding from "./AuthBranding";
import AuthFormContainer from "./AuthFormContainer";

const loginUser = async (email, password) => {
  // Placeholder for login logic
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "test@example.com" && password === "password123") {
        resolve("Login successful");
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 1000);
  });
};

const SignIn = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await loginUser(email, password);
      console.log(response);
    } catch (err) {
      setError(err.message);
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
          placeholder="example@email.com"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#f8fafc",
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
              "& fieldset": { border: "1px solid #e2e8f0" },
              "&:hover fieldset": { borderColor: "#3b82f6" },
              "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
            },
          }}
        />

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

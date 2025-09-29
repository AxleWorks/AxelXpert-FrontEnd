import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import AuthLayout from "./AuthLayout";
import AuthBranding from "./AuthBranding";
import AuthFormContainer from "./AuthFormContainer";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("User registered:", { userName, email });
      // Redirect to signin or dashboard
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
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
          placeholder="At least 8 characters"
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

        <Typography variant="body2" sx={{ mb: 1, color: "#64748b" }}>
          Confirm Password
        </Typography>
        <TextField
          placeholder="Confirm your password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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

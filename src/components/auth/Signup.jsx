import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import AuthLayout from "./AuthLayout";
import AuthBranding from "./AuthBranding";
import AuthFormContainer from "./AuthFormContainer";
import { Link } from "react-router-dom";

const SignUp = () => {
  const { loading, setLoading } = useState();
  const { error, setError } = useState();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await signupUser(email, password, userName);
    } catch (err) {
      console.error("Signup failed");
    }
  };

  const leftContent = (
    <AuthBranding title="AxleXpert" subtitle="Join The Axlexpert Family!" />
  );

  const rightContent = (
    <AuthFormContainer title="Sign Up" error={error}>
      <form onSubmit={handleSubmit}>
        <Typography variant="body2" sx={{ mb: 1, color: "#64748b" }}>
          User Name
        </Typography>
        <TextField
          placeholder="example@email.com"
          variant="outlined"
          fullWidth
          margin="normal"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#f1f5f9",
              "& fieldset": { border: "none" },
            },
          }}
        />

        <Typography variant="body2" sx={{ mb: 1, color: "#64748b" }}>
          Email
        </Typography>
        <TextField
          placeholder="example@email.com"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#f1f5f9",
              "& fieldset": { border: "none" },
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
              backgroundColor: "#f1f5f9",
              "& fieldset": { border: "none" },
            },
          }}
        />

        <Typography variant="body2" sx={{ mb: 1, color: "#64748b" }}>
          Confirm Password
        </Typography>
        <TextField
          placeholder="At least 8 characters"
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
              backgroundColor: "#f1f5f9",
              "& fieldset": { border: "none" },
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            backgroundColor: "#1e293b",
            color: "white",
            py: 1.2,
            fontSize: "1rem",
            fontWeight: 500,
            textTransform: "none",
            borderRadius: 1,
            mb: 2,
            "&:hover": {
              backgroundColor: "#334155",
            },
          }}
        >
          {loading ? "Signing up..." : "Sign up"}
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
      backgroundImage="/images/signup-bg.png"
    />
  );
};

export default SignUp;

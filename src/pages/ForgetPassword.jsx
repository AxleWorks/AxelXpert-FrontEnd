import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import AuthLayout from "../components/auth/AuthLayout";
import AuthBranding from "../components/auth/AuthBranding";
import AuthFormContainer from "../components/auth/AuthFormContainer";
import { Link } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const leftContent = <AuthBranding subtitle="We've Got You Back!" />;

  const rightContent = (
    <AuthFormContainer title="Forgot Password?" error={null}>
      {submitted ? (
        <Typography sx={{ fontSize: "16px", textAlign: "center", mt: 2 }}>
          If an account exists for this email, you’ll receive a password reset
          link.
        </Typography>
      ) : (
        <form onSubmit={handleSubmit}>
          <Typography sx={{ mb: 1, color: "#64748b", fontSize: "16px" }}>
            Enter your email address
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
          <Button
            type="submit"
            variant="contained"
            fullWidth
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
            }}
          >
            Send Reset Link
          </Button>
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ color: "#64748b", fontSize: "16px" }}>
              Remember your password?{" "}
              <Link
                to="/signin"
                style={{ color: "#3b82f6", textDecoration: "none" }}
              >
                {" "}
                Sign in
              </Link>
            </Typography>
          </Box>
        </form>
      )}
    </AuthFormContainer>
  );

  return (
    <AuthLayout
      leftContent={leftContent}
      rightContent={rightContent}
      backgroundImage="https://images.unsplash.com/photo-1618312980096-873bd19759a0?fit=crop&crop=entropy%2Cfaces&auto=format%2Ccompress&w=1280"
    />
  );
};

export default ForgetPassword;

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { publicAxios } from "../../utils/axiosConfig";
import { AUTH_URL } from "../../config/apiEndpoints";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthFormContainer from "../../components/auth/AuthFormContainer";
import AuthBranding from "../../components/auth/AuthBranding";
import {
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [emailError, setEmailError] = useState("");

  const validateEmail = (value) => {
    return /^\S+@\S+\.\S+$/.test(value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError) setEmailError("");
    if (message.text) setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    setEmailError("");

    // Validation
    if (!email) {
      setEmailError("Email is required");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await publicAxios.post(`${AUTH_URL}/forgot-password`, {
        email: email,
      });

      setMessage({
        type: "success",
        text:
          response.data.message ||
          "Password reset email sent successfully! Check your inbox.",
      });
      setEmail("");
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.error ||
          "Failed to send reset email. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const leftContent = <AuthBranding subtitle="Reset Your Password" />;

  const rightContent = (
    <AuthFormContainer title="Forgot Password">
      <Typography
        variant="body2"
        sx={{
          mb: 3,
          color: "text.secondary",
          fontSize: "0.95rem",
          lineHeight: 1.6,
        }}
      >
        Enter your email address and we'll send you a link to reset your
        password.
      </Typography>

      {message.text && (
        <Alert
          severity={message.type === "success" ? "success" : "error"}
          sx={{
            mb: 3,
            borderRadius: 2,
          }}
        >
          {message.text}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Typography
          variant="body2"
          sx={{ mb: 1, color: "#64748b", fontWeight: 500 }}
        >
          Email Address
        </Typography>
        <TextField
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          required
          disabled={loading}
          error={!!emailError}
          helperText={emailError}
          fullWidth
          sx={{
            mb: 3,
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
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <EmailIcon />
            )
          }
          sx={{
            backgroundColor: "#3b82f6",
            color: "white",
            py: 1.5,
            fontSize: "1rem",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 2,
            mb: 3,
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
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>

        <Box sx={{ textAlign: "center" }}>
          <Button
            component={Link}
            to="/signin"
            startIcon={<ArrowBackIcon />}
            sx={{
              color: "#3b82f6",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "rgba(59, 130, 246, 0.08)",
              },
            }}
          >
            Back to Sign In
          </Button>
        </Box>
      </form>
    </AuthFormContainer>
  );

  return (
    <AuthLayout
      leftContent={leftContent}
      rightContent={rightContent}
      backgroundImage="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop"
    />
  );
};

export default ForgetPassword;

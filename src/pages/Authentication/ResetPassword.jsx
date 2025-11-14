import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import { publicAxios } from "../../utils/axiosConfig";
import { AUTH_URL } from "../../config/apiEndpoints";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthFormContainer from "../../components/auth/AuthFormContainer";
import AuthBranding from "../../components/auth/AuthBranding";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useTheme } from "../../contexts/ThemeContext";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (!tokenFromUrl) {
      setMessage({
        type: "error",
        text: "Invalid or missing reset token. Please request a new password reset link.",
      });
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage({
        type: "error",
        text: "Passwords do not match",
      });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await publicAxios.post(`${AUTH_URL}/reset-password`, {
        token: token,
        newPassword: newPassword,
      });

      setMessage({
        type: "success",
        text: response.data.message || "Password reset successful!",
      });

      // Redirect to sign in after 2 seconds
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.error ||
          "Failed to reset password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!token && message.type === "error") {
    const leftContent = <AuthBranding subtitle="Reset Your Password" />;
    const rightContent = (
      <AuthFormContainer title="Reset Password">
        <Box
          sx={{
            mb: 2,
            p: 2,
            borderRadius: 1,
            backgroundColor: theme.palette.error.light,
            color: theme.palette.error.dark,
            border: `1px solid ${theme.palette.error.main}`,
          }}
        >
          <Typography variant="body2">{message.text}</Typography>
        </Box>
        <Link to="/forgot-password" style={{ textDecoration: "none" }}>
          <Button
            sx={{
              width: "100%",
              padding: "12px",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            Request New Reset Link
          </Button>
        </Link>
      </AuthFormContainer>
    );

    return (
      <AuthLayout
        leftContent={leftContent}
        rightContent={rightContent}
        backgroundImage="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop"
      />
    );
  }

  const leftContent = <AuthBranding subtitle="Reset Your Password" />;

  const rightContent = (
    <AuthFormContainer title="Reset Password">
      <Typography variant="body2" sx={{ mb: 3, color: "#000000" }}>
        Enter your new password below.
      </Typography>

      {message.text && (
        <Box
          sx={{
            mb: 2,
            p: 2,
            borderRadius: 1,
            backgroundColor:
              message.type === "success"
                ? theme.palette.success.light
                : theme.palette.error.light,
            color:
              message.type === "success"
                ? theme.palette.success.dark
                : theme.palette.error.dark,
            border: `1px solid ${
              message.type === "success"
                ? theme.palette.success.main
                : theme.palette.error.main
            }`,
          }}
        >
          <Typography variant="body2">{message.text}</Typography>
        </Box>
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
        <Input
          label="New Password"
          id="newPassword"
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          disabled={loading}
          inputProps={{ minLength: 6 }}
          sx={{
            mb: 2,
          }}
        />

        <Input
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={loading}
          inputProps={{ minLength: 6 }}
          sx={{
            mb: 2,
          }}
        />

        <Button
          type="submit"
          disabled={loading}
          sx={{
            width: "100%",
            padding: "12px",
            fontSize: "1rem",
            fontWeight: 600,
            boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.39)",
          }}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>

      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Typography variant="body2" sx={{ color: "#000000" }}>
          Remember your password?{" "}
          <Link
            to="/signin"
            style={{
              color: theme.palette.primary.main,
              textDecoration: "none",
            }}
          >
            Back to Sign In
          </Link>
        </Typography>
      </Box>
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

export default ResetPassword;

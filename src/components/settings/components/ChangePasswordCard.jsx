import React from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { TextField } from "@mui/material";
import { Label } from "../../ui/label";
import { Box, CircularProgress, IconButton } from "@mui/material";

const ChangePasswordCard = ({
  passwordData,
  handlePasswordChange,
  showPasswords,
  togglePasswordVisibility,
  handleChangePassword,
  saving,
  username,
}) => {
  const validatePasswordRequirement = (password, username, currentPassword) => {
    if (!password) return { valid: false, requirements: [] };

    const requirements = [
      {
        text: "At least 8 characters",
        valid: password.length >= 8,
        key: "length",
      },
      {
        text: "One uppercase letter (A-Z)",
        valid: /[A-Z]/.test(password),
        key: "uppercase",
      },
      {
        text: "One lowercase letter (a-z)",
        valid: /[a-z]/.test(password),
        key: "lowercase",
      },
      { text: "One digit (0-9)", valid: /\d/.test(password), key: "digit" },
      {
        text: "One symbol (!@#$%^&*...)",
        valid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
        key: "symbol",
      },
      {
        text: "Cannot contain username",
        valid: username
          ? !password.toLowerCase().includes(username.toLowerCase())
          : true,
        key: "username",
      },
      {
        text: "Different from current password",
        valid: currentPassword ? password !== currentPassword : true,
        key: "current",
      },
    ];

    const allValid = requirements.every((req) => req.valid);

    return { valid: allValid, requirements };
  };

  const passwordValidation = validatePasswordRequirement(
    passwordData.newPassword,
    username,
    passwordData.currentPassword
  );

  const handlePasswordInput = (field, value) => {
    handlePasswordChange(field, value);

    // Removed real-time toast notifications - only show on submit
  };
  return (
    <Card
      sx={{
        boxShadow: (theme) =>
          theme.palette.mode === "light"
            ? "0 2px 8px rgba(0, 0, 0, 0.1)"
            : "0 2px 8px rgba(0, 0, 0, 0.3)",
        borderRadius: 3,
        border: (theme) =>
          `1px solid ${theme.palette.mode === "light" ? "#e2e8f0" : "#374151"}`,
        bgcolor: "background.paper",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: (theme) =>
            theme.palette.mode === "light"
              ? "0 4px 16px rgba(0, 0, 0, 0.15)"
              : "0 4px 16px rgba(0, 0, 0, 0.4)",
        },
      }}
    >
      <CardHeader sx={{ pb: 3 }}>
        <CardTitle
          sx={{
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "text.primary",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "warning.main",
            }}
          />
          Change Password
        </CardTitle>
      </CardHeader>
      <CardContent sx={{ p: 4, pt: 2 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginBottom: "24px",
          }}
        >
          <Label sx={{ fontWeight: 600, fontSize: "0.95rem", mb: 1 }}>
            Current Password
          </Label>
          <TextField
            type={showPasswords.current ? "text" : "password"}
            variant="outlined"
            value={passwordData.currentPassword}
            onChange={(e) => {
              const value = e.target.value;
              handlePasswordInput("currentPassword", value);
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => togglePasswordVisibility("current")}
                  edge="end"
                  size="small"
                >
                  {showPasswords.current ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </IconButton>
              ),
            }}
            sx={{
              borderRadius: 2,
              fontSize: "1rem",
              py: 1.5,
              mb: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
            error={
              passwordData.currentPassword &&
              passwordData.newPassword &&
              passwordData.currentPassword === passwordData.newPassword
            }
          />
          {/* Current Password Validation */}
          {passwordData.currentPassword &&
            passwordData.newPassword &&
            passwordData.currentPassword === passwordData.newPassword && (
              <Box sx={{ mt: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: "0.875rem",
                    color: "error.main",
                  }}
                >
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "transparent",
                      border: `2px solid error.main`,
                    }}
                  >
                    <span
                      style={{
                        color: "error.main",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      ×
                    </span>
                  </Box>
                  <span>
                    New password cannot be the same as current password
                  </span>
                </Box>
              </Box>
            )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginBottom: "24px",
          }}
        >
          <Label sx={{ fontWeight: 600, fontSize: "0.95rem", mb: 1 }}>
            New Password
          </Label>
          <TextField
            type={showPasswords.new ? "text" : "password"}
            variant="outlined"
            value={passwordData.newPassword}
            onChange={(e) => handlePasswordInput("newPassword", e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => togglePasswordVisibility("new")}
                  edge="end"
                  size="small"
                >
                  {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </IconButton>
              ),
            }}
            sx={{
              borderRadius: 2,
              fontSize: "1rem",
              py: 1.5,
              mb: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
            error={passwordData.newPassword && !passwordValidation.valid}
          />
          {/* Password Requirements Display */}
          {passwordData.newPassword && (
            <Box sx={{ mt: 1 }}>
              {passwordValidation.requirements
                .filter((req) => !req.valid)
                .map((req, index) => (
                  <Box
                    key={req.key}
                    sx={{
                      fontSize: "0.875rem",
                      color: "error.main",
                      mb: 0.5,
                    }}
                  >
                    • {req.text}
                  </Box>
                ))}
              {passwordValidation.requirements.filter((req) => !req.valid)
                .length === 0 &&
                passwordData.newPassword && (
                  <Box
                    sx={{
                      fontSize: "0.875rem",
                      color: "success.main",
                      mb: 0.5,
                    }}
                  >
                    ✓ All requirements met!
                  </Box>
                )}
            </Box>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginBottom: "32px",
          }}
        >
          <Label sx={{ fontWeight: 600, fontSize: "0.95rem", mb: 1 }}>
            Confirm New Password
          </Label>
          <TextField
            type={showPasswords.confirm ? "text" : "password"}
            variant="outlined"
            value={passwordData.confirmPassword}
            onChange={(e) => {
              const value = e.target.value;
              handlePasswordInput("confirmPassword", value);
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => togglePasswordVisibility("confirm")}
                  edge="end"
                  size="small"
                >
                  {showPasswords.confirm ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </IconButton>
              ),
            }}
            sx={{
              borderRadius: 2,
              fontSize: "1rem",
              py: 1.5,
              mb: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
            error={
              passwordData.confirmPassword &&
              passwordData.confirmPassword !== passwordData.newPassword
            }
          />
          {/* Confirm Password Validation */}
          {passwordData.confirmPassword && passwordData.newPassword && (
            <Box sx={{ mt: 1 }}>
              <Box
                sx={{
                  fontSize: "0.875rem",
                  color:
                    passwordData.confirmPassword === passwordData.newPassword
                      ? "success.main"
                      : "error.main",
                }}
              >
                {passwordData.confirmPassword === passwordData.newPassword
                  ? "✓ Passwords match"
                  : "× Passwords do not match"}
              </Box>
            </Box>
          )}
        </div>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pt: 4,
            pb: 2,
            mt: 3,
            borderTop: (theme) =>
              `1px solid ${
                theme.palette.mode === "light" ? "#e2e8f0" : "#374151"
              }`,
          }}
        >
          <Button
            onClick={handleChangePassword}
            disabled={
              saving ||
              !passwordData.currentPassword ||
              !passwordData.newPassword ||
              !passwordData.confirmPassword ||
              !passwordValidation.valid ||
              passwordData.newPassword !== passwordData.confirmPassword
            }
            variant="contained"
            sx={{
              minWidth: 200,
              py: 2,
              px: 4,
              borderRadius: 3,
              bgcolor: "warning.main",
              color: "warning.contrastText",
              fontSize: "1rem",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "warning.dark",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              },
              "&:disabled": {
                bgcolor: "action.disabledBackground",
                color: "action.disabled",
                transform: "none",
                boxShadow: "none",
              },
              transition: "all 0.3s ease",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            {saving ? (
              <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
            ) : (
              <Lock size={16} style={{ marginRight: 8 }} />
            )}
            {saving ? "Updating Password..." : "Change Password"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordCard;

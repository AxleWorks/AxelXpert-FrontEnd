import React from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Box, CircularProgress, IconButton } from "@mui/material";

const ChangePasswordCard = ({
  passwordData,
  handlePasswordChange,
  showPasswords,
  togglePasswordVisibility,
  handleChangePassword,
  saving,
}) => {
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
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
          <Label sx={{ fontWeight: 600, fontSize: "0.95rem", mb: 1 }}>Current Password</Label>
          <Box sx={{ position: "relative" }}>
            <Input
              type={showPasswords.current ? "text" : "password"}
              placeholder="Enter current password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                handlePasswordChange("currentPassword", e.target.value)
              }
              sx={{ 
                pr: 6,
                "& .MuiInputBase-root": {
                  borderRadius: 2,
                  fontSize: "1rem",
                  py: 1.5,
                },
              }}
            />
            <IconButton
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
              }}
              onClick={() => togglePasswordVisibility("current")}
              size="small"
            >
              {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
            </IconButton>
          </Box>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
          <Label sx={{ fontWeight: 600, fontSize: "0.95rem", mb: 1 }}>New Password</Label>
          <Box sx={{ position: "relative" }}>
            <Input
              type={showPasswords.new ? "text" : "password"}
              placeholder="Enter new password"
              value={passwordData.newPassword}
              onChange={(e) =>
                handlePasswordChange("newPassword", e.target.value)
              }
              sx={{ 
                pr: 6,
                "& .MuiInputBase-root": {
                  borderRadius: 2,
                  fontSize: "1rem",
                  py: 1.5,
                },
              }}
            />
            <IconButton
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
              }}
              onClick={() => togglePasswordVisibility("new")}
              size="small"
            >
              {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
            </IconButton>
          </Box>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "32px" }}>
          <Label sx={{ fontWeight: 600, fontSize: "0.95rem", mb: 1 }}>Confirm New Password</Label>
          <Box sx={{ position: "relative" }}>
            <Input
              type={showPasswords.confirm ? "text" : "password"}
              placeholder="Confirm new password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                handlePasswordChange("confirmPassword", e.target.value)
              }
              sx={{ 
                pr: 6,
                "& .MuiInputBase-root": {
                  borderRadius: 2,
                  fontSize: "1rem",
                  py: 1.5,
                },
              }}
            />
            <IconButton
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
              }}
              onClick={() => togglePasswordVisibility("confirm")}
              size="small"
            >
              {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </IconButton>
          </Box>
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
              !passwordData.confirmPassword
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

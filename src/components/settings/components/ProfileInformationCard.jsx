import React from "react";
import { Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import ProfilePhotoManager from "../../ui/ProfilePhotoManager";
import { Box, CircularProgress, Chip, Typography, Badge } from "@mui/material";

const ProfileInformationCard = ({
  userDetails,
  formData,
  handleInputChange,
  handleSaveProfile,
  saving,
  role,
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
              bgcolor: "primary.main",
            }}
          />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent sx={{ p: 0 }}>
        {/* Profile Photo Section - Separate from background */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pt: 4,
            pb: 2,
            px: 4,
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              badgeContent={
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    bgcolor: userDetails?.isActive ? "#10b981" : "#ef4444",
                    border: "3px solid white",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  }}
                />
              }
            >
              <ProfilePhotoManager
                currentImageUrl={
                  userDetails?.profileImageUrl || userDetails?.profilePhotoUrl
                }
                userId={userDetails?.id}
                onImageUpdate={(newImageUrl, updatedUser) => {
                  // This will be handled by parent component
                }}
                size={150}
                editable={true}
              />
            </Badge>
          </Box>
        </Box>

        {/* Modern Profile Header with Gray Background */}
        <Box
          sx={{
            background: (theme) =>
              theme.palette.mode === "light"
                ? "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
                : "linear-gradient(135deg, #374151 0%, #4b5563 100%)",
            mx: 3,
            mb: 3,
            borderRadius: 3,
            p: 4,
            color: (theme) => theme.palette.text.primary,
            border: (theme) => `1px solid ${theme.palette.mode === "light" ? "#e2e8f0" : "#374151"}`,
            boxShadow: (theme) =>
              theme.palette.mode === "light"
                ? "0 2px 8px rgba(0, 0, 0, 0.05)"
                : "0 2px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
            }}
          >
            {/* User Info Section */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  fontSize: { xs: "1.5rem", sm: "1.75rem" },
                  color: (theme) => theme.palette.text.primary,
                }}
              >
                {formData.username || "User Name"}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: (theme) => theme.palette.text.secondary,
                  fontSize: "1.1rem",
                  mb: 3,
                }}
              >
                {formData.email || "No email provided"}
              </Typography>

              {/* Role and Status */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
                <Chip
                  label={formData.role === "user" ? "Customer" : formData.role?.charAt(0).toUpperCase() + formData.role?.slice(1)}
                  sx={{
                    bgcolor: (theme) => {
                      const roleColors = {
                        admin: theme.palette.error.main,
                        manager: theme.palette.warning.main, 
                        employee: theme.palette.info.main,
                        user: theme.palette.success.main,
                        customer: theme.palette.success.main,
                      };
                      const role = formData.role === "user" ? "customer" : formData.role;
                      return roleColors[role] || theme.palette.primary.main;
                    },
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    px: 2,
                    "& .MuiChip-label": {
                      px: 1,
                    },
                  }}
                />
                
                {userDetails?.id && (
                  <Chip
                    label={`ID: #${userDetails.id}`}
                    variant="outlined"
                    sx={{
                      borderColor: (theme) => theme.palette.divider,
                      color: (theme) => theme.palette.text.secondary,
                      fontWeight: 500,
                      fontSize: "0.85rem",
                      "& .MuiChip-label": {
                        px: 1,
                      },
                    }}
                  />
                )}

                <Chip
                  label={userDetails?.isActive ? "Active" : "Inactive"}
                  sx={{
                    bgcolor: (theme) => userDetails?.isActive 
                      ? `${theme.palette.success.main}20` 
                      : `${theme.palette.error.main}20`,
                    color: (theme) => userDetails?.isActive 
                      ? theme.palette.success.main 
                      : theme.palette.error.main,
                    border: (theme) => `1px solid ${userDetails?.isActive 
                      ? theme.palette.success.main 
                      : theme.palette.error.main}`,
                    fontWeight: 500,
                    fontSize: "0.8rem",
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Form Fields Section */}
        <Box sx={{ p: 4 }}>
          {/* Username Field */}
          <Box sx={{ mb: 4 }}>
            <Label sx={{ fontWeight: 600, fontSize: "0.95rem", color: "text.primary", mb: 1, display: "block" }}>
              Username
            </Label>
            <Input
              placeholder="Enter username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: 2,
                  fontSize: "1rem",
                  py: 1.5,
                },
              }}
            />
          </Box>

          {/* Email and Phone Grid */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, mb: 4 }}>
            <Box>
              <Label sx={{ fontWeight: 600, fontSize: "0.95rem", color: "text.primary", mb: 1, display: "block" }}>
                Email Address
              </Label>
              <Input
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: 2,
                    fontSize: "1rem",
                    py: 1.5,
                  },
                }}
              />
            </Box>

            <Box>
              <Label sx={{ fontWeight: 600, fontSize: "0.95rem", color: "text.primary", mb: 1, display: "block" }}>
                Contact Number
              </Label>
              <Input
                type="tel"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: 2,
                    fontSize: "1rem",
                    py: 1.5,
                  },
                }}
              />
            </Box>
          </Box>

          {/* Address Field */}
          <Box sx={{ mb: 4 }}>
            <Label sx={{ fontWeight: 600, fontSize: "0.95rem", color: "text.primary", mb: 1, display: "block" }}>
              Address
            </Label>
            <Input
              placeholder="Enter your address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: 2,
                  fontSize: "1rem",
                  py: 1.5,
                },
              }}
            />
          </Box>

          {/* Branch Field (if applicable) */}
          {(role === "manager" || role === "employee") && formData.branchName && (
            <Box sx={{ mb: 4 }}>
              <Label sx={{ fontWeight: 600, fontSize: "0.95rem", color: "text.primary", mb: 1, display: "block" }}>
                Branch
              </Label>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: (theme) => `1px solid ${theme.palette.mode === "light" ? "#e2e8f0" : "#374151"}`,
                  bgcolor: "background.default",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: "text.secondary",
                    textTransform: "capitalize",
                  }}
                >
                  {formData.branchName}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Save Button Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            px: 4,
            pb: 4,
            pt: 2,
            borderTop: (theme) =>
              `1px solid ${
                theme.palette.mode === "light" ? "#e2e8f0" : "#374151"
              }`,
          }}
        >
          <Button
            onClick={handleSaveProfile}
            disabled={saving}
            variant="contained"
            sx={{
              minWidth: 220,
              py: 2.5,
              px: 5,
              borderRadius: 3,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              fontSize: "1.1rem",
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                bgcolor: "primary.dark",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
              },
              "&:disabled": {
                bgcolor: "action.disabledBackground",
                color: "action.disabled",
                transform: "none",
                boxShadow: "none",
              },
              transition: "all 0.3s ease",
            }}
          >
            {saving ? (
              <CircularProgress size={22} sx={{ mr: 2, color: "white" }} />
            ) : (
              <Save size={18} style={{ marginRight: 12 }} />
            )}
            {saving ? "Saving Changes..." : "Save Changes"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfileInformationCard;

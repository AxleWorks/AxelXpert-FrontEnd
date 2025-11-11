import React from "react";
import { Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import ProfilePhotoManager from "../../ui/ProfilePhotoManager";
import { Box, CircularProgress, Chip } from "@mui/material";

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
      <CardContent sx={{ p: 4, pt: 2 }}>
        {/* Profile Photo Section - Centered */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 5,
            py: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
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
            <Label
              sx={{
                textAlign: "center",
                color: "text.secondary",
                fontWeight: 500,
                mt: 1,
                fontSize: "1rem",
              }}
            >
              Profile Picture
            </Label>
          </Box>
        </Box>

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "24px", marginBottom: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px",marginBottom: "28px" }}>
            <Label sx={{ fontWeight: 600, fontSize: "0.95rem", color: "text.primary" }}>Username</Label>
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
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px",marginBottom: "28px" }}>
            <Label sx={{ fontWeight: 600, fontSize: "0.95rem", color: "text.primary" }}>Role</Label>
            <Box sx={{ display: "flex", alignItems: "center", minHeight: "56px" }}>
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
                  fontSize: "0.95rem",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  "& .MuiChip-label": {
                    px: 2,
                  },
                }}
              />
            </Box>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
          <Label sx={{ fontWeight: 600, fontSize: "0.95rem", color: "text.primary" }}>Email Address</Label>
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
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
          <Label sx={{ fontWeight: 600, fontSize: "0.95rem", color: "text.primary" }}>Contact Number</Label>
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
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
          <Label sx={{ fontWeight: 600, fontSize: "0.95rem", color: "text.primary" }}>Address</Label>
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
        </div>

        {(role === "manager" || role === "employee") && formData.branchName && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
            <Label sx={{ fontWeight: 600, fontSize: "0.95rem", color: "text.primary" }}>Branch</Label>
            <Input
              value={formData.branchName}
              disabled={true}
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  color: "text.secondary",
                  textTransform: "capitalize",
                },
                "& .MuiInputBase-root": {
                  borderRadius: 2,
                  fontSize: "1rem",
                  py: 1.5,
                },
              }}
            />
          </div>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pt: 5,
            pb: 2,
            mt: 4,
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
              minWidth: 200,
              py: 2,
              px: 4,
              borderRadius: 3,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              fontSize: "1rem",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "primary.dark",
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
              <Save size={16} style={{ marginRight: 8 }} />
            )}
            {saving ? "Saving Changes..." : "Save Changes"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfileInformationCard;

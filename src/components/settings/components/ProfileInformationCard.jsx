import React from "react";
import { Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import ProfilePhotoManager from "../../ui/ProfilePhotoManager";
import { Box, CircularProgress } from "@mui/material";

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
      <CardContent className="space-y-6">
        {/* Profile Photo Section - Centered */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
            py: 1.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
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
                mt: 0.5,
                fontSize: "1rem",
              }}
            >
              Profile Picture
            </Label>
          </Box>
        </Box>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label>Username</Label>
            <Input
              placeholder="Enter username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <Label>Role</Label>
            <Input
              value={formData.role}
              disabled={true}
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  color: "text.secondary",
                },
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label>Email Address</Label>
          <Input
            type="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <Label>Contact Number</Label>
          <Input
            type="tel"
            placeholder="Enter phone number"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <Label>Address</Label>
          <Input
            placeholder="Enter your address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
          />
        </div>

        {(role === "manager" || role === "employee") && formData.branchName && (
          <div className="space-y-4">
            <Label>Branch</Label>
            <Input
              value={formData.branchName}
              disabled={true}
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  color: "text.secondary",
                },
              }}
            />
          </div>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pt: 4,
            mb: 3,
          }}
        >
          <Button
            onClick={handleSaveProfile}
            disabled={saving}
            variant="contained"
            sx={{
              minWidth: 180,
              py: 1.5,
              borderRadius: 2,
              bgcolor: "primary.main",
              color: "primary.contrastText",
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

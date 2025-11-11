import React, { useState, useEffect } from "react";
import { User, Lock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { toast } from "../ui/toast";
import { ConfirmationDialog } from "../ui/dialog";
import { Box, Typography, CircularProgress } from "@mui/material";
import { API_BASE, API_PREFIX } from "../../config/apiEndpoints";
import {
  getCurrentUser,
  createAuthenticatedFetchOptions,
} from "../../utils/jwtUtils";
import ProfileTab from "./components/ProfileTab";
import SecurityTab from "./components/SecurityTab";

const SettingsComponent = ({ role = "user" }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    address: "",
    branchName: "",
    role: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [confirmationDialog, setConfirmationDialog] = useState({
    open: false,
    type: "warning",
    title: "",
    message: "",
    onConfirm: null,
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Get logged-in user data using JWT utils
  const getLoggedInUser = () => {
    return getCurrentUser();
  };

  // Fetch user details from API
  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(
        `${API_BASE}/api/users/${userId}`,
        createAuthenticatedFetchOptions()
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
      const userData = await response.json();
      setUserDetails(userData);
      setFormData({
        username: userData.username || "",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
        address: userData.address || "",
        branchName: userData.branchName || "",
        role: userData.role || "",
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to load user details", {
        description: "Please try refreshing the page",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loggedInUser = getLoggedInUser();
    if (loggedInUser && loggedInUser.id) {
      fetchUserDetails(loggedInUser.id);
    } else {
      setLoading(false);
      toast.error("No user session found", {
        description: "Please log in again",
      });
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSaveProfile = () => {
    if (!userDetails) return;

    setConfirmationDialog({
      open: true,
      type: "info",
      title: "Save Profile Changes",
      message: "Are you sure you want to save these changes to your profile?",
      onConfirm: async () => {
        setConfirmationDialog((prev) => ({ ...prev, open: false }));
        setSaving(true);
        try {
          const response = await fetch(
            `${API_BASE}${API_PREFIX}/users/${userDetails.id}`,
            {
              ...createAuthenticatedFetchOptions(),
              method: "PUT",
              body: JSON.stringify({
                username: formData.username,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                // Don't update role and branchName as they might be restricted
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to update profile");
          }

          const updatedUser = await response.json();
          setUserDetails(updatedUser);

          // Note: With JWT, user info is stored in the token
          // No need to manually update localStorage for username/email changes
          // The JWT token would need to be refreshed by the backend for these changes to take effect

          toast.success("Profile updated!", {
            description: "Your profile has been updated successfully.",
          });
        } catch (error) {
          console.error("Error updating profile:", error);
          toast.error("Failed to update profile", {
            description: "Please try again later",
          });
        } finally {
          setSaving(false);
        }
      },
    });
  };

  const handleChangePassword = () => {
    if (!userDetails) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match", {
        description: "Please make sure both password fields match",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password too short", {
        description: "Password must be at least 6 characters long",
      });
      return;
    }

    setConfirmationDialog({
      open: true,
      type: "warning",
      title: "Change Password",
      message:
        "Are you sure you want to change your password? You will need to use the new password for future logins.",
      onConfirm: async () => {
        setConfirmationDialog((prev) => ({ ...prev, open: false }));
        setSaving(true);
        try {
          const response = await fetch(
            `${API_BASE}${API_PREFIX}/users/${userDetails.id}/password`,
            {
              ...createAuthenticatedFetchOptions(),
              method: "PUT",
              body: JSON.stringify({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
              }),
            }
          );

          const text = await response.text();
          if (!response.ok) {
            throw new Error(text || "Failed to change password");
          }

          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });

          toast.success("Password changed!", {
            description: text || "Your password has been changed successfully.",
          });
        } catch (error) {
          console.error("Error changing password:", error);
          toast.error("Failed to change password", {
            description:
              error.message ||
              "Please check your current password and try again",
          });
        } finally {
          setSaving(false);
        }
      },
    });
  };

  const handleDeleteAccount = () => {
    if (!userDetails) return;

    setConfirmationDialog({
      open: true,
      type: "danger",
      title: "Delete Account",
      message:
        "Are you absolutely sure you want to delete your account? This action cannot be undone and you will lose all your data permanently.",
      onConfirm: async () => {
        setConfirmationDialog((prev) => ({ ...prev, open: false }));
        setSaving(true);
        try {
          const response = await fetch(
            `${API_BASE}${API_PREFIX}/users/${userDetails.id}`,
            {
              ...createAuthenticatedFetchOptions(),
              method: "DELETE",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to delete account");
          }

          // Clear localStorage and redirect to login
          localStorage.removeItem("accessToken");
          toast.success("Account deleted", {
            description: "Your account has been successfully deleted.",
          });

          // Redirect to login page after a delay
          setTimeout(() => {
            window.location.href = "/signin";
          }, 2000);
        } catch (error) {
          console.error("Error deleting account:", error);
          toast.error("Failed to delete account", {
            description: "Please try again later",
          });
        } finally {
          setSaving(false);
        }
      },
    });
  };

  const handleToggleTwoFactor = () => {
    // Placeholder for 2FA toggle functionality
    toast.info("Two-factor authentication", {
      description: "This feature is coming soon!",
    });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!userDetails) {
    return (
      <Box textAlign="center" p={4}>
        <Typography variant="h6" color="error">
          Unable to load user details
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Please try refreshing the page or logging in again.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        minHeight: "100vh",
        py: { xs: 3, sm: 5, md: 7 },
        px: { xs: 2, sm: 3, md: 4 },
        boxSizing: "border-box",
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 900,
          background: "none",
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 5, textAlign: "center", px: 2 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 1.5,
              color: (theme) =>
                theme.palette.mode === "light" ? "#000000" : "#ffffff",
              fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
            }}
          >
            Settings
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              fontWeight: 400,
              fontSize: "1.1rem",
              opacity: 0.8,
              mt: 1,
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            Manage your account settings and preferences
          </Typography>
        </Box>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 6,
              bgcolor: "background.paper",
              borderRadius: 3,
              p: 1,
              boxShadow: (theme) =>
                theme.palette.mode === "light"
                  ? "0 4px 12px rgba(0, 0, 0, 0.1)"
                  : "0 4px 12px rgba(0, 0, 0, 0.3)",
              border: (theme) =>
                `1px solid ${
                  theme.palette.mode === "light" ? "#e2e8f0" : "#374151"
                }`,
              maxWidth: 450,
              mx: "auto",
              "& .MuiTabs-flexContainer": {
                justifyContent: "center",
              },
              "& .MuiTab-root": {
                minWidth: 200,
                flex: 1,
                borderRadius: 2,
                py: 2,
                px: 3,
                fontSize: "1rem",
                fontWeight: 600,
                transition: "all 0.3s ease",
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                  transform: "translateY(-1px)",
                },
                "&:hover": {
                  bgcolor: (theme) =>
                    theme.palette.mode === "light"
                      ? "rgba(0, 0, 0, 0.04)"
                      : "rgba(255, 255, 255, 0.04)",
                },
              },
            }}
          >
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileTab
              userDetails={userDetails}
              formData={formData}
              handleInputChange={handleInputChange}
              handleSaveProfile={handleSaveProfile}
              saving={saving}
              role={role}
            />
          </TabsContent>

          <TabsContent value="security">
            <SecurityTab
              passwordData={passwordData}
              handlePasswordChange={handlePasswordChange}
              showPasswords={showPasswords}
              togglePasswordVisibility={togglePasswordVisibility}
              handleChangePassword={handleChangePassword}
              handleDeleteAccount={handleDeleteAccount}
              saving={saving}
            />
          </TabsContent>
        </Tabs>
      </Box>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmationDialog.open}
        onClose={() =>
          setConfirmationDialog((prev) => ({ ...prev, open: false }))
        }
        onConfirm={confirmationDialog.onConfirm}
        title={confirmationDialog.title}
        message={confirmationDialog.message}
        type={confirmationDialog.type}
        loading={saving}
        confirmText={
          confirmationDialog.type === "danger" ? "Delete" : "Confirm"
        }
      />
    </Box>
  );
};

export default SettingsComponent;

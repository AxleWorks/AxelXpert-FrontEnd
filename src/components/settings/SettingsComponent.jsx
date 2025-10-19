import React, { useState, useEffect } from "react";
import { User, Lock, Save, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { toast } from "../ui/toast";
import { ConfirmationDialog } from "../ui/dialog";
import ProfilePhotoManager from "../ui/ProfilePhotoManager";
import { Box, Typography, CircularProgress, IconButton } from "@mui/material";
import { API_BASE } from "../../config/apiEndpoints";

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

  // Get logged-in user data from localStorage
  const getLoggedInUser = () => {
    try {
      const authUser = localStorage.getItem("authUser");
      return authUser ? JSON.parse(authUser) : null;
    } catch (error) {
      console.error("Error parsing authUser from localStorage:", error);
      return null;
    }
  };

  // Fetch user details from API
  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(`${API_BASE}/api/users/${userId}`);
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
            `${API_BASE}/api/users/${userDetails.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
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

          // Update localStorage if username or email changed
          const authUser = getLoggedInUser();
          if (authUser) {
            const updatedAuthUser = {
              ...authUser,
              username: updatedUser.username,
              email: updatedUser.email,
            };
            localStorage.setItem("authUser", JSON.stringify(updatedAuthUser));
          }

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
            `${API_BASE}/api/users/${userDetails.id}/password`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
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
            `${API_BASE}/api/users/${userDetails.id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to delete account");
          }

          // Clear localStorage and redirect to login
          localStorage.removeItem("authUser");
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
        minHeight: "100%",
        py: { xs: 2, sm: 4, md: 6 },
        px: { xs: 1, sm: 2 },
        boxSizing: "border-box",
        bgcolor: "background.default",
        backgroundImage: (theme) =>
          theme.palette.mode === "light"
            ? "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
            : "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 800,
          background: "none",
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 2, textAlign: "center" }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              color: (theme) =>
                theme.palette.mode === "light" ? "#000000" : "#ffffff",
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.2rem" },
            }}
          >
            Settings
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              fontWeight: 400,
              fontSize: "1rem",
              opacity: 0.8,
              mt: 0.5,
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
              mb: 4,
              bgcolor: (theme) =>
                theme.palette.mode === "light" ? "white" : "grey.900",
              borderRadius: 3,
              p: 0.5,
              boxShadow: (theme) =>
                theme.palette.mode === "light"
                  ? "0 8px 32px rgba(0, 0, 0, 0.1)"
                  : "0 8px 32px rgba(0, 0, 0, 0.3)",
              border: (theme) =>
                `1px solid ${
                  theme.palette.mode === "light" ? "#e2e8f0" : "#374151"
                }`,
              maxWidth: 400,
              mx: "auto",
              "& .MuiTabs-flexContainer": {
                justifyContent: "center",
              },
              "& .MuiTab-root": {
                minWidth: 180,
                flex: 1,
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

          {/* Profile Tab */}
          <TabsContent
            value="profile"
            className="mt-6"
            sx={{ display: "flex", flexDirection: "column", gap: 4 }}
          >
            <Card
              sx={{
                boxShadow: (theme) =>
                  theme.palette.mode === "light"
                    ? "0 8px 32px rgba(0, 0, 0, 0.1)"
                    : "0 8px 32px rgba(0, 0, 0, 0.3)",
                borderRadius: 3,
                border: (theme) =>
                  `1px solid ${
                    theme.palette.mode === "light" ? "#e2e8f0" : "#374151"
                  }`,
                bgcolor: "background.paper",
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
                      background: (theme) =>
                        theme.palette.mode === "light"
                          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                          : "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
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
                        userDetails?.profileImageUrl ||
                        userDetails?.profilePhotoUrl
                      }
                      userId={userDetails?.id}
                      onImageUpdate={(newImageUrl, updatedUser) => {
                        setUserDetails((prev) => ({
                          ...prev,
                          profileImageUrl: newImageUrl,
                          profilePhotoUrl: newImageUrl,
                        }));
                      }}
                      size={150}
                      editable={true}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        textAlign: "center",
                        color: "text.secondary",
                        fontWeight: 500,
                        mt: 0.5,
                        fontSize: "1rem",
                      }}
                    >
                      Profile Picture
                    </Typography>
                  </Box>
                </Box>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input
                      placeholder="Enter username"
                      value={formData.username}
                      onChange={(e) =>
                        handleInputChange("username", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
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

                <div className="space-y-3">
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Contact Number</Label>
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-3">
                  <Label>Address</Label>
                  <Input
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                  />
                </div>

                {(role === "manager" || role === "employee") &&
                  formData.branchName && (
                    <div className="space-y-3">
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
                      background: (theme) =>
                        theme.palette.mode === "light"
                          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                          : "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
                      "&:hover": {
                        background: (theme) =>
                          theme.palette.mode === "light"
                            ? "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)"
                            : "linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)",
                        transform: "translateY(-1px)",
                        boxShadow: (theme) =>
                          theme.palette.mode === "light"
                            ? "0 8px 25px rgba(102, 126, 234, 0.3)"
                            : "0 8px 25px rgba(96, 165, 250, 0.3)",
                      },
                      transition: "all 0.3s ease",
                      boxShadow: (theme) =>
                        theme.palette.mode === "light"
                          ? "0 4px 15px rgba(102, 126, 234, 0.2)"
                          : "0 4px 15px rgba(96, 165, 250, 0.2)",
                    }}
                  >
                    {saving ? (
                      <CircularProgress
                        size={20}
                        sx={{ mr: 1, color: "white" }}
                      />
                    ) : (
                      <Save size={16} style={{ marginRight: 8 }} />
                    )}
                    {saving ? "Saving Changes..." : "Save Changes"}
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Account Status Card */}
            <Card
              sx={{
                background: (theme) =>
                  theme.palette.mode === "light"
                    ? "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
                    : "linear-gradient(135deg, #374151 0%, #1f2937 100%)",
                border: "none",
                boxShadow: (theme) =>
                  theme.palette.mode === "light"
                    ? "0 8px 32px rgba(0, 0, 0, 0.1)"
                    : "0 8px 32px rgba(0, 0, 0, 0.3)",
                borderRadius: 3,
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
                      background: (theme) =>
                        theme.palette.mode === "light"
                          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                          : "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
                    }}
                  />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 4,
                  }}
                >
                  {/* Account Status */}
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: "background.paper",
                      boxShadow: (theme) =>
                        theme.palette.mode === "light"
                          ? "0 2px 10px rgba(0, 0, 0, 0.05)"
                          : "0 2px 10px rgba(0, 0, 0, 0.2)",
                      border: (theme) =>
                        `1px solid ${
                          theme.palette.mode === "light" ? "#e2e8f0" : "#374151"
                        }`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: (theme) =>
                          theme.palette.mode === "light"
                            ? "0 8px 25px rgba(0, 0, 0, 0.1)"
                            : "0 8px 25px rgba(0, 0, 0, 0.3)",
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        fontSize: "0.75rem",
                      }}
                    >
                      Account Status
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: userDetails.isActive
                            ? "#10b981"
                            : "#ef4444",
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{
                          color: userDetails.isActive ? "#10b981" : "#ef4444",
                          fontWeight: 600,
                          fontSize: "1.1rem",
                        }}
                      >
                        {userDetails.isActive ? "Active" : "Inactive"}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Account ID */}
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: "background.paper",
                      boxShadow: (theme) =>
                        theme.palette.mode === "light"
                          ? "0 2px 10px rgba(0, 0, 0, 0.05)"
                          : "0 2px 10px rgba(0, 0, 0, 0.2)",
                      border: (theme) =>
                        `1px solid ${
                          theme.palette.mode === "light" ? "#e2e8f0" : "#374151"
                        }`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: (theme) =>
                          theme.palette.mode === "light"
                            ? "0 8px 25px rgba(0, 0, 0, 0.1)"
                            : "0 8px 25px rgba(0, 0, 0, 0.3)",
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        fontSize: "0.75rem",
                      }}
                    >
                      Account ID
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "text.primary",
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        mt: 1,
                        fontFamily: "monospace",
                      }}
                    >
                      #{userDetails.id}
                    </Typography>
                  </Box>

                  {/* Created Date */}
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: "background.paper",
                      boxShadow: (theme) =>
                        theme.palette.mode === "light"
                          ? "0 2px 10px rgba(0, 0, 0, 0.05)"
                          : "0 2px 10px rgba(0, 0, 0, 0.2)",
                      border: (theme) =>
                        `1px solid ${
                          theme.palette.mode === "light" ? "#e2e8f0" : "#374151"
                        }`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: (theme) =>
                          theme.palette.mode === "light"
                            ? "0 8px 25px rgba(0, 0, 0, 0.1)"
                            : "0 8px 25px rgba(0, 0, 0, 0.3)",
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        fontSize: "0.75rem",
                      }}
                    >
                      Member Since
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "text.primary",
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        mt: 1,
                      }}
                    >
                      {new Date(userDetails.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </Typography>
                  </Box>

                  {/* Last Updated */}
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: "background.paper",
                      boxShadow: (theme) =>
                        theme.palette.mode === "light"
                          ? "0 2px 10px rgba(0, 0, 0, 0.05)"
                          : "0 2px 10px rgba(0, 0, 0, 0.2)",
                      border: (theme) =>
                        `1px solid ${
                          theme.palette.mode === "light" ? "#e2e8f0" : "#374151"
                        }`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: (theme) =>
                          theme.palette.mode === "light"
                            ? "0 8px 25px rgba(0, 0, 0, 0.1)"
                            : "0 8px 25px rgba(0, 0, 0, 0.3)",
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        fontSize: "0.75rem",
                      }}
                    >
                      Last Updated
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "text.primary",
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        mt: 1,
                      }}
                    >
                      {new Date(userDetails.updatedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent
            value="security"
            sx={{ display: "flex", flexDirection: "column", gap: 4, mt: 6 }}
          >
            <Card
              sx={{
                boxShadow: (theme) =>
                  theme.palette.mode === "light"
                    ? "0 8px 32px rgba(0, 0, 0, 0.1)"
                    : "0 8px 32px rgba(0, 0, 0, 0.3)",
                borderRadius: 3,
                border: (theme) =>
                  `1px solid ${
                    theme.palette.mode === "light" ? "#e2e8f0" : "#374151"
                  }`,
                bgcolor: "background.paper",
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
                      background: (theme) =>
                        theme.palette.mode === "light"
                          ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                          : "linear-gradient(135deg, #ec4899 0%, #ef4444 100%)",
                    }}
                  />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Current Password</Label>
                  <Box sx={{ position: "relative" }}>
                    <Input
                      type={showPasswords.current ? "text" : "password"}
                      placeholder="Enter current password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        handlePasswordChange("currentPassword", e.target.value)
                      }
                      sx={{ pr: 6 }}
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
                      {showPasswords.current ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </IconButton>
                  </Box>
                </div>

                <div className="space-y-3">
                  <Label>New Password</Label>
                  <Box sx={{ position: "relative" }}>
                    <Input
                      type={showPasswords.new ? "text" : "password"}
                      placeholder="Enter new password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        handlePasswordChange("newPassword", e.target.value)
                      }
                      sx={{ pr: 6 }}
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
                      {showPasswords.new ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </IconButton>
                  </Box>
                </div>

                <div className="space-y-3">
                  <Label>Confirm New Password</Label>
                  <Box sx={{ position: "relative" }}>
                    <Input
                      type={showPasswords.confirm ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        handlePasswordChange("confirmPassword", e.target.value)
                      }
                      sx={{ pr: 6 }}
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
                      {showPasswords.confirm ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </IconButton>
                  </Box>
                </div>

                <Box sx={{ display: "flex", justifyContent: "center", pt: 3 }}>
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
                      minWidth: 180,
                      py: 1.5,
                      borderRadius: 2,
                      background: (theme) =>
                        theme.palette.mode === "light"
                          ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                          : "linear-gradient(135deg, #ec4899 0%, #ef4444 100%)",
                      "&:hover": {
                        background: (theme) =>
                          theme.palette.mode === "light"
                            ? "linear-gradient(135deg, #ee82f0 0%, #f24561 100%)"
                            : "linear-gradient(135deg, #db2777 0%, #dc2626 100%)",
                        transform: "translateY(-1px)",
                        boxShadow: (theme) =>
                          theme.palette.mode === "light"
                            ? "0 8px 25px rgba(240, 147, 251, 0.3)"
                            : "0 8px 25px rgba(236, 72, 153, 0.3)",
                      },
                      "&:disabled": {
                        background: (theme) =>
                          theme.palette.mode === "light"
                            ? "linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)"
                            : "linear-gradient(135deg, #4b5563 0%, #374151 100%)",
                        color: "text.disabled",
                        transform: "none",
                        boxShadow: "none",
                      },
                      transition: "all 0.3s ease",
                      boxShadow: (theme) =>
                        theme.palette.mode === "light"
                          ? "0 4px 15px rgba(240, 147, 251, 0.2)"
                          : "0 4px 15px rgba(236, 72, 153, 0.2)",
                    }}
                  >
                    {saving ? (
                      <CircularProgress
                        size={20}
                        sx={{ mr: 1, color: "white" }}
                      />
                    ) : (
                      <Lock size={16} style={{ marginRight: 8 }} />
                    )}
                    {saving ? "Updating Password..." : "Change Password"}
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Card
              sx={{
                boxShadow: (theme) =>
                  theme.palette.mode === "light"
                    ? "0 8px 32px rgba(0, 0, 0, 0.1)"
                    : "0 8px 32px rgba(0, 0, 0, 0.3)",
                borderRadius: 3,
                border: (theme) =>
                  `1px solid ${
                    theme.palette.mode === "light" ? "#e2e8f0" : "#374151"
                  }`,
                bgcolor: "background.paper",
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
                      background: (theme) =>
                        theme.palette.mode === "light"
                          ? "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                          : "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                    }}
                  />
                  Two-Factor Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3, fontSize: "0.95rem" }}
                >
                  Add an extra layer of security to your account by enabling
                  two-factor authentication.
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="outlined"
                    disabled
                    sx={{
                      minWidth: 180,
                      py: 1.5,
                      borderRadius: 2,
                      borderColor: (theme) =>
                        theme.palette.mode === "light" ? "#cbd5e0" : "#4b5563",
                      color: "text.disabled",
                      "&:disabled": {
                        borderColor: (theme) =>
                          theme.palette.mode === "light"
                            ? "#e2e8f0"
                            : "#374151",
                        color: "text.disabled",
                      },
                    }}
                  >
                    Enable 2FA (Coming Soon)
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Card
              sx={{
                borderColor: "#ef4444",
                border: (theme) =>
                  theme.palette.mode === "light"
                    ? "2px solid #fecaca"
                    : "2px solid #7f1d1d",
                background: (theme) =>
                  theme.palette.mode === "light"
                    ? "linear-gradient(135deg, #fef2f2 0%, #fde8e8 100%)"
                    : "linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)",
                boxShadow: (theme) =>
                  theme.palette.mode === "light"
                    ? "0 8px 32px rgba(239, 68, 68, 0.1)"
                    : "0 8px 32px rgba(239, 68, 68, 0.2)",
                borderRadius: 3,
              }}
            >
              <CardHeader sx={{ pb: 3 }}>
                <CardTitle
                  sx={{
                    color: "#dc2626",
                    fontSize: "1.25rem",
                    fontWeight: 600,
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
                      backgroundColor: "#ef4444",
                    }}
                  />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3, fontSize: "0.95rem" }}
                >
                  Once you delete your account, there is no going back. Please
                  be certain.
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    onClick={handleDeleteAccount}
                    disabled={saving}
                    sx={{
                      minWidth: 180,
                      py: 1.5,
                      borderRadius: 2,
                      backgroundColor: "#ef4444",
                      "&:hover": {
                        backgroundColor: "#dc2626",
                        transform: "translateY(-1px)",
                        boxShadow: "0 8px 25px rgba(239, 68, 68, 0.3)",
                      },
                      "&:disabled": {
                        backgroundColor: (theme) =>
                          theme.palette.mode === "light"
                            ? "#fca5a5"
                            : "#7f1d1d",
                        color: (theme) =>
                          theme.palette.mode === "light"
                            ? "#991b1b"
                            : "#fca5a5",
                        transform: "none",
                        boxShadow: "none",
                      },
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 15px rgba(239, 68, 68, 0.2)",
                    }}
                  >
                    {saving ? (
                      <CircularProgress
                        size={20}
                        sx={{ mr: 1, color: "white" }}
                      />
                    ) : null}
                    {saving ? "Deleting Account..." : "Delete Account"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
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

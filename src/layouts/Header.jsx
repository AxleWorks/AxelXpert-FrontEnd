import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Chip,
  Avatar,
  Badge,
  Divider,
  ListItemIcon,
  ListItemText,
  Button,
  Tooltip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Close as CloseIcon,
  NotificationsNone as NotificationsNoneIcon,
  NotificationsActive as NotificationsActiveIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme as useCustomTheme } from "../contexts/ThemeContext";
import { API_BASE } from "../config/apiEndpoints";
import notificationService from "../services/notificationService";

const Header = ({ onMenuClick }) => {
  const {
    user,
    clearAuthUser,
    notification,
    clearNotification,
  } = useAuth();
  const { isDarkMode, toggleTheme } = useCustomTheme();
  const navigate = useNavigate();

  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Track whether currently fetching to prevent duplicate calls
  const isFetchingRef = useRef(false);

  // Load notifications from backend
  const loadNotifications = useCallback(async () => {
    if (!user?.id || isFetchingRef.current) return;

    try {
      isFetchingRef.current = true;
      setLoading(true);
      
      const response = await notificationService.getNotifications(user.id);

      const allNotifications = Array.isArray(response) ? response : [];

      const unread = allNotifications.filter(
        (n) => n.isRead === false || n.read === false
      ).length;
      setUnreadCount(unread);
      setNotifications(allNotifications);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [user?.id]); 

  useEffect(() => {
    if (user?.id) {
      loadNotifications(); 
    }
  }, [user?.id, loadNotifications]);

  // Listen for new FCM notifications
  useEffect(() => {
    if (notification) {
      // load notification from backend
      const fetchTimer = setTimeout(async () => {
        await loadNotifications();
        clearNotification();
      }, 500); 

      return () => clearTimeout(fetchTimer);
    }
  }, [notification, loadNotifications, clearNotification]);

  const handleProfileMenu = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenu = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setProfileAnchorEl(null);
  };

  const handleCloseNotificationsMenu = () => {
    setNotificationsAnchorEl(null);
  };

  const handleNotificationClick = async (notif) => {

    if (notif.isRead === false) {
      try {
        await notificationService.markAsRead(notif.id);
        // Update local state
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notif.id ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    }

    if (notif.type) {
      switch (notif.type) {
        case "EMPLOYEE":
          navigate("/employee/tasks");
          break;
        case "CUSTOMER":
          navigate("/user/progress-tracking");
          break;
      }
    } 
    handleCloseNotificationsMenu();
  };

  const handleDeleteNotification = async (notifId, event) => {
    event.stopPropagation();
    try {
      await notificationService.deleteNotification(notifId);

      // Update local state
      setNotifications((prev) => {
        const deleted = prev.find((n) => n.id === notifId);
        if (deleted && (deleted.isRead === false)) {
          setUnreadCount((count) => Math.max(0, count - 1));
        }
        return prev.filter((n) => n.id !== notifId);
      });

    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return time.toLocaleDateString();
  };

  const handleLogout = () => {
    clearAuthUser(); // Use auth context logout which clears JWT token
    handleCloseProfileMenu();
    window.location.href = "/signin"; // Navigate to login page
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      user: {
        label: "Customer",
        color: "success",
      },
      employee: {
        label: "Employee",
        color: "primary",
      },
      manager: {
        label: "Manager",
        color: "warning",
      },
      admin: {
        label: "Admin",
        color: "error",
      },
    };
    const config = roleConfig[role] || roleConfig.user;
    return (
      <Chip
        label={config.label}
        size="small"
        color={config.color}
        variant="outlined"
        sx={{
          fontWeight: 600,
          fontSize: "0.75rem",
        }}
      />
    );
  };

  const getAvatarColor = (role) => {
    const colors = {
      user: "#10b981",
      employee: "#3b82f6",
      manager: "#f59e0b",
    };
    return colors[role] || colors.user;
  };

  // Helper function to get full image URL
  const getProfileImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http")) return imageUrl;
    return `${API_BASE}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: 3, py: 1 }}>
        {/* Left Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{
              mr: 2,
              display: { sm: "none" },
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* System Name */}
          <Typography
            variant="h5"
            noWrap
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.2rem", sm: "1.5rem" },
              letterSpacing: "0.5px",
              color: "primary.main",
              cursor: "pointer",
              "&:hover": {
                opacity: 0.8,
              },
            }}
          >
            <Box component="span" sx={{ color: "primary.main" }}>
              Axle
            </Box>
            <Box component="span" sx={{ color: "text.primary" }}>
              Xpert
            </Box>
          </Typography>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
          {/* Role Badge */}
          {user && getRoleBadge(user.role)}

          {/* Theme Toggle Button */}
          <Tooltip
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <IconButton
              onClick={toggleTheme}
              color="inherit"
              sx={{
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              color="inherit"
              onClick={handleNotificationsMenu}
              sx={{
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <Badge badgeContent={unreadCount} color="error" max={99}>
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile Avatar */}
          {user && (
            <Tooltip title="Profile">
              <IconButton
                onClick={handleProfileMenu}
                sx={{
                  p: 0.9,
                  px: 2,
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <Avatar
                  src={getProfileImageUrl(
                    user.profileImageUrl || user.profilePhotoUrl
                  )}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: getAvatarColor(user.role),
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  {!(user.profileImageUrl || user.profilePhotoUrl) &&
                    user.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {user.username}
                </Typography>
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationsAnchorEl}
          open={Boolean(notificationsAnchorEl)}
          onClose={handleCloseNotificationsMenu}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: {
              mt: 1,
              width: 460,
              maxHeight: 600,
              overflow: "hidden",
              borderRadius: 2,
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 10px 40px rgba(0, 0, 0, 0.3)"
                  : "0 10px 40px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Notifications
              </Typography>
            </Box>
          </Box>

          {/* Notification List */}
          <Box sx={{ maxHeight: 450, overflow: "auto" }}>
            {notifications.length === 0 ? (
              <Box
                sx={{
                  py: 6,
                  px: 3,
                  textAlign: "center",
                  color: "text.secondary",
                }}
              >
                <NotificationsNoneIcon
                  sx={{ fontSize: 48, mb: 2, opacity: 0.5 }}
                />
                <Typography variant="body2">No notifications yet</Typography>
                <Typography variant="caption" color="text.secondary">
                  You'll see notifications here when you receive them
                </Typography>
              </Box>
            ) : (
              <>
                {notifications.map((notif, index) => (
                  <React.Fragment key={notif.id}>
                    <MenuItem
                      onClick={() => handleNotificationClick(notif)}
                      sx={{
                        py: 2,
                        px: 2,
                        borderLeft: notif.isRead ? 0 : 3,
                        borderColor: "primary.main",
                        backgroundColor: notif.isRead
                          ? "transparent"
                          : "action.hover",
                        "&:hover": { backgroundColor: "action.selected" },
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 2,
                      }}
                    >
                      <Box sx={{ mt: 0.5 }}>
                        <NotificationsActiveIcon fontSize="small" />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: notif.isRead ? 400 : 600,
                              flex: 1,
                            }}
                          >
                            {notif.title}
                          </Typography>
                          {!notif.isRead && (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                backgroundColor: "primary.main",
                              }}
                            />
                          )}
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontSize: "0.85rem",
                            mb: 0.5,
                            wordBreak: "break-word",
                            whiteSpace: "normal",
                            overflowWrap: "break-word",
                            display: "-webkit-box",
                            WebkitLineClamp: 3, 
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {notif.body}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {getTimeAgo(notif.createdAt)}
                        </Typography>
                      </Box>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={(e) => handleDeleteNotification(notif.id, e)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </MenuItem>
                    {index < notifications.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </>
            )}
          </Box>
        </Menu>

        {/* Profile Menu */}
        <Menu
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={handleCloseProfileMenu}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 250,
              borderRadius: 2,
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 10px 40px rgba(0, 0, 0, 0.3)"
                  : "0 10px 40px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          {/* User Info Header */}
          <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                src={getProfileImageUrl(
                  user?.profileImageUrl || user?.profilePhotoUrl
                )}
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: getAvatarColor(user?.role),
                  fontSize: "1.2rem",
                  fontWeight: 600,
                }}
              >
                {!(user?.profileImageUrl || user?.profilePhotoUrl) &&
                  (user?.name?.charAt(0).toUpperCase() ||
                    user?.username?.charAt(0).toUpperCase())}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {user?.username || "Default User"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email || "jhondoe@gmail.com"}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Menu Items */}
          <MenuItem onClick={handleCloseProfileMenu} sx={{ py: 1.5, px: 3 }}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2">Settings</Typography>
            </ListItemText>
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={handleLogout}
            sx={{ py: 1.5, px: 3, color: "error.main" }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2">Logout</Typography>
            </ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

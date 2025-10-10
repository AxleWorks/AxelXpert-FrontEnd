import React, { useState } from "react";
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
  Email as EmailIcon,
} from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import { useTheme as useCustomTheme } from "../contexts/ThemeContext";
import { API_BASE } from "../config/apiEndpoints";

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useCustomTheme();
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);

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

  const handleLogout = () => {
    logout();
    handleCloseProfileMenu();
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
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${API_BASE}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  };

  const mockNotifications = [
    { id: 1, title: "New service request", time: "2 min ago", unread: true },
    { id: 2, title: "Payment received", time: "1 hour ago", unread: true },
    {
      id: 3,
      title: "Vehicle inspection due",
      time: "2 hours ago",
      unread: false,
    },
  ];

  const unreadCount = mockNotifications.filter((n) => n.unread).length;

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
              <Badge badgeContent={unreadCount} color="error">
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
                  src={getProfileImageUrl(user.profileImageUrl || user.profilePhotoUrl)}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: getAvatarColor(user.role),
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  {!(user.profileImageUrl || user.profilePhotoUrl) && user.username?.charAt(0).toUpperCase()}
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
              minWidth: 320,
              maxWidth: 400,
              borderRadius: 2,
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 10px 40px rgba(0, 0, 0, 0.3)"
                  : "0 10px 40px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Notifications
            </Typography>
          </Box>
          {mockNotifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={handleCloseNotificationsMenu}
              sx={{
                py: 2,
                px: 2,
                borderLeft: notification.unread ? 3 : 0,
                borderColor: "primary.main",
                backgroundColor: notification.unread
                  ? "action.hover"
                  : "transparent",
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: notification.unread ? 600 : 400 }}
                >
                  {notification.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification.time}
                </Typography>
              </Box>
            </MenuItem>
          ))}
          <Divider />
          <MenuItem
            onClick={handleCloseNotificationsMenu}
            sx={{ justifyContent: "center", py: 1.5 }}
          >
            <Typography
              variant="body2"
              color="primary.main"
              sx={{ fontWeight: 600 }}
            >
              View All Notifications
            </Typography>
          </MenuItem>
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
                src={getProfileImageUrl(user?.profileImageUrl || user?.profilePhotoUrl)}
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: getAvatarColor(user?.role),
                  fontSize: "1.2rem",
                  fontWeight: 600,
                }}
              >
                {!(user?.profileImageUrl || user?.profilePhotoUrl) && (user?.name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase())}
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

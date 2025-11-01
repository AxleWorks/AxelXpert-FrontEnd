import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  useTheme,
  Divider,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Dashboard as DashboardIcon,
  CalendarToday as CalendarTodayIcon,
  TrackChanges as TrackChangesIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Build as BuildIcon,
  Store as StoreIcon,
  Assessment as AssessmentIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";

const DRAWER_WIDTH = 280;

const ManagerSidebar = ({ mobileOpen, onDrawerToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { clearAuthUser, user } = useAuth();

  // Determine the base path based on user role
  const basePath = user?.role === "admin" ? "/admin" : "/manager";

  // Manager/Admin menu configuration - main navigation items
  const menuItems = [
    { text: "Dashboard", icon: DashboardIcon, path: `${basePath}/dashboard` },
    {
      text: "Booking Calendar",
      icon: CalendarTodayIcon,
      path: `${basePath}/booking-calendar`,
    },
    {
      text: "Progress Tracking",
      icon: TrackChangesIcon,
      path: `${basePath}/progress-tracking`,
    },
    {
      text: "User Management",
      icon: PeopleIcon,
      path: `${basePath}/user-management`,
    },
    { text: "Services", icon: BuildIcon, path: `${basePath}/services` },
    { text: "Branches", icon: StoreIcon, path: `${basePath}/branches` },
    { text: "Reports", icon: AssessmentIcon, path: `${basePath}/reports` },
  ];

  // Bottom menu items
  const bottomMenuItems = [
    { text: "Settings", icon: SettingsIcon, path: `${basePath}/settings` },
  ];

  const isSelected = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const handleLogout = () => {
    clearAuthUser();
    navigate("/signin");
  };

  const MenuItem = ({ item }) => {
    const selected = isSelected(item.path);
    const IconComponent = item.icon;

    return (
      <ListItem disablePadding sx={{ mb: 1.5 }}>
        <ListItemButton
          component={Link}
          to={item.path}
          selected={selected}
          sx={{
            mx: 1,
            borderRadius: 2,
            minHeight: 48,
            "&.Mui-selected": {
              bgcolor: isDark ? "rgba(59, 130, 246, 0.2)" : "#e3f2fd",
              color: theme.palette.primary.main,
              "& .MuiListItemIcon-root": { color: theme.palette.primary.main },
            },
            "&:hover": {
              bgcolor: isDark ? "rgba(255, 255, 255, 0.08)" : "#f5f5f5",
              transform: "translateX(2px)",
              transition: "all 0.2s ease-in-out",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 40,
              color: selected
                ? theme.palette.secondary.main
                : theme.palette.text.secondary,
            }}
          >
            <IconComponent />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography
                variant="body2"
                sx={{
                  fontWeight: selected ? 600 : 500,
                  color: theme.palette.text.primary,
                }}
              >
                {item.text}
              </Typography>
            }
          />
        </ListItemButton>
      </ListItem>
    );
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Toolbar sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 2,
              bgcolor: "secondary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>
              {user?.role === "admin" ? "A" : "M"}
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: theme.palette.text.primary }}
          >
            {user?.role === "admin" ? "Admin Panel" : "Manager Panel"}
          </Typography>
        </Box>
      </Toolbar>

      {/* Main Menu Items */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 1 }}>
        <List disablePadding sx={{ mt: 2 }}>
          {menuItems.map((item) => (
            <MenuItem key={item.text} item={item} />
          ))}
        </List>
      </Box>

      {/* Bottom Menu Items */}
      <Box sx={{ p: 1 }}>
        <Divider sx={{ mb: 1 }} />
        <List disablePadding>
          {bottomMenuItems.map((item) => (
            <MenuItem key={item.text} item={item} />
          ))}

          {/* Logout Button */}
          <ListItem disablePadding sx={{ mb: 1.5 }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                mx: 1,
                borderRadius: 2,
                minHeight: 48,
                "&:hover": {
                  bgcolor: isDark ? "rgba(239, 68, 68, 0.15)" : "#fee2e2",
                  transform: "translateX(2px)",
                  transition: "all 0.2s ease-in-out",
                  "& .MuiListItemIcon-root": { color: "error.main" },
                  "& .MuiTypography-root": { color: "error.main" },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: theme.palette.text.secondary,
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                    }}
                  >
                    Logout
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </List>

        {/* Footer Watermark */}
        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            textAlign: "center",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {user?.role === "admin" ? "Admin Dashboard v1.0.0" : "Manager Dashboard v1.0.0"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  const drawerStyles = {
    width: DRAWER_WIDTH,
    boxSizing: "border-box",
    bgcolor: "background.paper",
    borderRight: "1px solid",
    borderColor: "divider",
  };

  return (
    <Box
      component="nav"
      sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": drawerStyles,
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": drawerStyles,
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default ManagerSidebar;

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
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
  Dashboard as DashboardIcon,
  CalendarToday as CalendarTodayIcon,
  TrackChanges as TrackChangesIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Build as BuildIcon,
  Store as StoreIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";

const DRAWER_WIDTH = 280;

// Manager menu configuration
const menuItems = [
  { text: "Dashboard", icon: DashboardIcon, path: "/manager/dashboard" },
  {
    text: "Booking Calendar",
    icon: CalendarTodayIcon,
    path: "/manager/booking-calendar",
  },
  {
    text: "Progress Tracking",
    icon: TrackChangesIcon,
    path: "/manager/progress-tracking",
  },
  {
    text: "User Management",
    icon: PeopleIcon,
    path: "/manager/user-management",
  },
  { text: "Settings", icon: SettingsIcon, path: "/manager/settings" },
  { text: "Services", icon: BuildIcon, path: "/manager/services" },
  { text: "Branches", icon: StoreIcon, path: "/manager/branches" },
  { text: "Reports", icon: AssessmentIcon, path: "/manager/reports" },
];

const ManagerSidebar = ({ mobileOpen, onDrawerToggle }) => {
  const location = useLocation();

  const isSelected = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
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
              bgcolor: "#fce4ec",
              color: "#c2185b",
              "& .MuiListItemIcon-root": { color: "#c2185b" },
            },
            "&:hover": {
              bgcolor: "#f5f5f5",
              transform: "translateX(2px)",
              transition: "all 0.2s ease-in-out",
            },
          }}
        >
          <ListItemIcon
            sx={{ minWidth: 40, color: selected ? "#c2185b" : "#666" }}
          >
            <IconComponent />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography
                variant="body2"
                sx={{ fontWeight: selected ? 600 : 500 }}
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
      <Toolbar sx={{ borderBottom: "1px solid #e0e0e0" }}>
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
              M
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Manager Panel
          </Typography>
        </Box>
      </Toolbar>

      {/* Menu Items */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 1 }}>
        <List disablePadding sx={{ mt: 2 }}>
          {menuItems.map((item) => (
            <MenuItem key={item.text} item={item} />
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0", textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary">
          Manager Dashboard v1.0.0
        </Typography>
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

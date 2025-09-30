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
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  History as HistoryIcon,
  Build as BuildIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

const DRAWER_WIDTH = 280;

// Employee menu configuration
const menuItems = [
  { text: "Dashboard", icon: DashboardIcon, path: "/employee/dashboard" },
  { text: "Tasks", icon: AssignmentIcon, path: "/employee/tasks" },
  { text: "History", icon: HistoryIcon, path: "/employee/history" },
  { text: "Settings", icon: SettingsIcon, path: "/employee/settings" },
  { text: "Services", icon: BuildIcon, path: "/employee/services" },
];

const EmployeeSidebar = ({ mobileOpen, onDrawerToggle }) => {
  const location = useLocation();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

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
                ? theme.palette.success.main
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
              bgcolor: "warning.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>
              E
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: theme.palette.text.primary }}
          >
            Employee Panel
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
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          textAlign: "center",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Employee Dashboard v1.0.0
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

export default EmployeeSidebar;

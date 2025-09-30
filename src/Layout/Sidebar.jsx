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
  Collapse,
  Chip,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
  Dashboard as DashboardIcon,
  DirectionsCar as DirectionsCarIcon,
  Build as BuildIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";

const DRAWER_WIDTH = 280;

// Menu configuration with dropdown support
const menuItems = [
  { text: "Dashboard", icon: DashboardIcon, path: "/", badge: "New" },
  { text: "Calendar", icon: CalendarIcon, path: "/calendar", badge: "Live" },
  {
    text: "Vehicles",
    icon: DirectionsCarIcon,
    path: "/vehicles",
    hasSubmenu: true,
    submenu: [{ text: "All Vehicles", path: "/vehicles" }],
  },
  {
    text: "Services",
    icon: BuildIcon,
    path: "/services",
    hasSubmenu: true,
    submenu: [{ text: "All Vehicles", path: "/vehicles" }],
  },
  { text: "Customers", icon: PeopleIcon, path: "/customers" },
  { text: "Appointments", icon: AssignmentIcon, path: "/appointments" },
  { text: "Analytics", icon: AnalyticsIcon, path: "/analytics", badge: "Pro" },
  { text: "Settings", icon: SettingsIcon, path: "/settings" },
];

const Sidebar = ({ mobileOpen, onDrawerToggle }) => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState({});

  const isSelected = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const toggleDropdown = (itemText) => {
    setOpenDropdown((prev) => ({
      ...prev,
      [itemText]: !prev[itemText],
    }));
  };

  const MenuItem = ({ item }) => {
    const selected = isSelected(item.path);
    const IconComponent = item.icon;
    const isOpen = openDropdown[item.text];

    if (item.hasSubmenu) {
      return (
        <>
          <ListItem disablePadding sx={{ mb: 1.5 }}>
            <ListItemButton
              onClick={() => toggleDropdown(item.text)}
              sx={{
                mx: 1,
                borderRadius: 2,
                minHeight: 48,
                "&:hover": {
                  bgcolor: "#f5f5f5",
                  transform: "translateX(2px)",
                  transition: "all 0.2s ease-in-out",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "#666" }}>
                <IconComponent />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {item.text}
                  </Typography>
                }
              />
              {isOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.submenu.map((subItem) => (
                <ListItem key={subItem.text} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    component={Link}
                    to={subItem.path}
                    selected={isSelected(subItem.path)}
                    sx={{
                      mx: 1,
                      ml: 4,
                      borderRadius: 2,
                      minHeight: 40,
                      "&.Mui-selected": {
                        bgcolor: "#e3f2fd",
                        color: "#1976d2",
                      },
                      "&:hover": {
                        bgcolor: "#f5f5f5",
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "0.8rem",
                            fontWeight: isSelected(subItem.path) ? 600 : 400,
                          }}
                        >
                          {subItem.text}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </>
      );
    }

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
              bgcolor: "#e3f2fd",
              color: "#1976d2",
              "& .MuiListItemIcon-root": { color: "#1976d2" },
            },
            "&:hover": {
              bgcolor: "#f5f5f5",
              transform: "translateX(2px)",
              transition: "all 0.2s ease-in-out",
            },
          }}
        >
          <ListItemIcon
            sx={{ minWidth: 40, color: selected ? "#1976d2" : "#666" }}
          >
            <IconComponent />
          </ListItemIcon>
          <ListItemText
            primary={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: selected ? 600 : 500 }}
                >
                  {item.text}
                </Typography>
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    color={item.badge === "New" ? "success" : "primary"}
                    sx={{ height: 18, fontSize: "0.7rem" }}
                  />
                )}
              </Box>
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
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>
              A
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            AxleXpert
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
          © 2025 AxleXpert v1.0.0
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

export default Sidebar;

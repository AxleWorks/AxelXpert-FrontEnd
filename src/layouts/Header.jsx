import React from "react";
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
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Person,
} from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      user: {
        label: "Customer",
        color: "#4CAF50",
        bgColor: "rgba(76, 175, 80, 0.1)",
      },
      employee: {
        label: "Employee",
        color: "#2196F3",
        bgColor: "rgba(33, 150, 243, 0.1)",
      },
      manager: {
        label: "Manager",
        color: "#FF9800",
        bgColor: "rgba(255, 152, 0, 0.1)",
      },
    };
    const config = roleConfig[role] || roleConfig.user;
    return (
      <Chip
        label={config.label}
        size="small"
        sx={{
          color: config.color,
          backgroundColor: config.bgColor,
          fontWeight: 600,
          border: `1px solid ${config.color}20`,
        }}
      />
    );
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{
              color: "#1976d2",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.1)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.5px",
            }}
          >
            AxleXpert
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {user && getRoleBadge(user.role)}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor:
                  user?.role === "manager"
                    ? "#FF9800"
                    : user?.role === "employee"
                    ? "#2196F3"
                    : "#4CAF50",
                fontSize: "0.875rem",
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>

            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              sx={{
                color: "#1976d2",
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.1)",
                },
              }}
            >
              <AccountCircle />
            </IconButton>
          </Box>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              "& .MuiPaper-root": {
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                minWidth: "180px",
              },
            }}
          >
            <MenuItem onClick={handleClose} sx={{ gap: 1 }}>
              <Person fontSize="small" />
              <Typography variant="body2">
                {user?.name} ({user?.role})
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ gap: 1, color: "#f44336" }}>
              <Logout fontSize="small" />
              <Typography variant="body2">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

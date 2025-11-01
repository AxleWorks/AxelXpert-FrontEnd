import React, { useState } from "react";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import { useLocation } from "react-router-dom";
import Header from "../Header";
import ManagerSidebar from "./ManagerSidebar";

const ManagerLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header onMenuClick={handleDrawerToggle} />
      <ManagerSidebar
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 280px)` },
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Box
          key={location.pathname}
          sx={{
            animation: "fadeSlideIn 0.4s ease-out",
            "@keyframes fadeSlideIn": {
              "0%": {
                opacity: 0,
                transform: "translateY(20px)",
              },
              "100%": {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerLayout;

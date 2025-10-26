import React, { useState } from "react";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import Header from "../Header";
import UserSidebar from "./UserSidebar";
import Chatbot from "../../components/ui/Chatbot";

const UserLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header onMenuClick={handleDrawerToggle} />
      <UserSidebar
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
        {children}
      </Box>
      
      {/* Chatbot Component */}
      <Chatbot />
    </Box>
  );
};

export default UserLayout;

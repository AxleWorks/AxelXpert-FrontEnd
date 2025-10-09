import React from "react";
import { Box } from "@mui/material";
import UserLayout from "../../layouts/user/UserLayout";
import SettingsComponent from "../../components/settings/SettingsComponent";

const UserSettingsPage = () => {
  return (
    <UserLayout>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <SettingsComponent role="user" />
      </Box>
    </UserLayout>
  );
};

export default UserSettingsPage;

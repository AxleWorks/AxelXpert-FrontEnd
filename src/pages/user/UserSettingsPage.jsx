import React from "react";
import { Typography, Paper, Box } from "@mui/material";
import UserLayout from "../../layouts/user/UserLayout";

const UserSettingsPage = () => {
  return (
    <UserLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Settings
        </Typography>
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="body1">
            User settings and preferences will be configured here.
          </Typography>
        </Paper>
      </Box>
    </UserLayout>
  );
};

export default UserSettingsPage;

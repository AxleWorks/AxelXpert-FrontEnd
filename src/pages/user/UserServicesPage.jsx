import React from "react";
import { Typography, Paper, Box } from "@mui/material";
import UserLayout from "../../layouts/user/UserLayout";

const UserServicesPage = () => {
  return (
    <UserLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Available Services
        </Typography>
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="body1">
            Available services and booking options will be displayed here.
          </Typography>
        </Paper>
      </Box>
    </UserLayout>
  );
};

export default UserServicesPage;

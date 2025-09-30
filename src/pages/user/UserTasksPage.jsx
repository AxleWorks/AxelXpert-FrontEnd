import React from "react";
import { Typography, Paper, Box } from "@mui/material";
import UserLayout from "../../layouts/user/UserLayout";

const UserTasksPage = () => {
  return (
    <UserLayout>
      <Box>
        <Typography
          variant="h4"
          sx={{ mb: 3, fontWeight: 600, color: "#1e293b" }}
        >
          My Tasks
        </Typography>
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="body1">
            Tasks functionality will be implemented here.
          </Typography>
        </Paper>
      </Box>
    </UserLayout>
  );
};

export default UserTasksPage;

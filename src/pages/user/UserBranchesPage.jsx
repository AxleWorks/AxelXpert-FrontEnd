import React from "react";
import { Typography, Paper, Box } from "@mui/material";
import UserLayout from "../../layouts/user/UserLayout";

const UserBranchesPage = () => {
  return (
    <UserLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Branches
        </Typography>
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="body1">
            Branch locations and details will be shown here.
          </Typography>
        </Paper>
      </Box>
    </UserLayout>
  );
};

export default UserBranchesPage;

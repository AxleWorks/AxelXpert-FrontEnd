import React from "react";
import { Typography, Paper, Box } from "@mui/material";
import ManagerLayout from "../../layouts/manager/ManagerLayout";

const ManagerProgressTrackingPage = () => {
  return (
    <ManagerLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Progress Tracking
        </Typography>
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="body1">
            Manager progress tracking and service monitoring will be displayed
            here.
          </Typography>
        </Paper>
      </Box>
    </ManagerLayout>
  );
};

export default ManagerProgressTrackingPage;

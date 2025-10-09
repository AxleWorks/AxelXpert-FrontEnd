import React from "react";
import { Typography, Paper, Box } from "@mui/material";
import EmployeeLayout from "../../layouts/employee/EmployeeLayout";

const EmployeeProgressTrackingPage = () => {
  return (
    <EmployeeLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Progress Tracking
        </Typography>
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="body1">
            Service progress tracking and updates will be managed here.
          </Typography>
        </Paper>
      </Box>
    </EmployeeLayout>
  );
};

export default EmployeeProgressTrackingPage;

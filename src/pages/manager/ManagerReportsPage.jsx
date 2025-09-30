import React from "react";
import { Typography, Paper, Box } from "@mui/material";
import ManagerLayout from "../../layouts/manager/ManagerLayout";

const ManagerReportsPage = () => {
  return (
    <ManagerLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Reports & Analytics
        </Typography>
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="body1">
            Business reports, analytics, and performance metrics will be
            displayed here.
          </Typography>
        </Paper>
      </Box>
    </ManagerLayout>
  );
};

export default ManagerReportsPage;

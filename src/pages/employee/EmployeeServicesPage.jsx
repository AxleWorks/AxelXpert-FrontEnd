import React from "react";
import { Typography, Paper, Box } from "@mui/material";
import EmployeeLayout from "../../layouts/employee/EmployeeLayout";

const EmployeeServicesPage = () => {
  return (
    <EmployeeLayout>
      <Box>
        <Typography
          variant="h4"
          sx={{ mb: 3, fontWeight: 600, color: "#1e293b" }}
        >
          Service Management
        </Typography>
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="body1">
            Service management tools and workflows will be available here.
          </Typography>
        </Paper>
      </Box>
    </EmployeeLayout>
  );
};

export default EmployeeServicesPage;

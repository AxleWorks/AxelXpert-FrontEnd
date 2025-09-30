import React from "react";
import { Typography, Paper, Box } from "@mui/material";
import EmployeeLayout from "../../layouts/employee/EmployeeLayout";

const EmployeeVehiclesPage = () => {
  return (
    <EmployeeLayout>
      <Box>
        <Typography
          variant="h4"
          sx={{ mb: 3, fontWeight: 600, color: "#1e293b" }}
        >
          Assigned Vehicles
        </Typography>
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="body1">
            Assigned vehicles and their service details will be displayed here.
          </Typography>
        </Paper>
      </Box>
    </EmployeeLayout>
  );
};

export default EmployeeVehiclesPage;

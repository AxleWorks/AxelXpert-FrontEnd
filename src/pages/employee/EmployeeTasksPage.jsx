import React from "react";
import { Typography, Paper, Box, useTheme } from "@mui/material";
import EmployeeLayout from "../../layouts/employee/EmployeeLayout";

const EmployeeTasksPage = () => {
  const theme = useTheme();

  return (
    <EmployeeLayout>
      <Box>
        <Typography
          variant="h4"
          sx={{ mb: 3, fontWeight: 600, color: theme.palette.text.primary }}
        >
          My Tasks
        </Typography>
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="body1">
            Employee task list and task management will be available here.
          </Typography>
        </Paper>
      </Box>
    </EmployeeLayout>
  );
};

export default EmployeeTasksPage;

import React from "react";
import { Box } from "@mui/material";
import EmployeeLayout from "../../layouts/employee/EmployeeLayout";
import SettingsComponent from "../../components/settings/SettingsComponent";

const EmployeeSettingsPage = () => {
  return (
    <EmployeeLayout>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <SettingsComponent role="employee" />
      </Box>
    </EmployeeLayout>
  );
};

export default EmployeeSettingsPage;

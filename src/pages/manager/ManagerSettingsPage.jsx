import React from "react";
import { Box } from "@mui/material";
import ManagerLayout from "../../layouts/manager/ManagerLayout";
import SettingsComponent from "../../components/settings/SettingsComponent";

const ManagerSettingsPage = () => {
  return (
    <ManagerLayout>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <SettingsComponent role="manager" />
      </Box>
    </ManagerLayout>
  );
};

export default ManagerSettingsPage;

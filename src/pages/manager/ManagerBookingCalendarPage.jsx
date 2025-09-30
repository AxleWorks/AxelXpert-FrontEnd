import React from "react";
import { Typography, Paper, Box } from "@mui/material";
import ManagerLayout from "../../layouts/manager/ManagerLayout";

const ManagerBookingCalendarPage = () => {
  return (
    <ManagerLayout>
      <Box>
        <Typography
          variant="h4"
          sx={{ mb: 3, fontWeight: 600, color: "#1e293b" }}
        >
          Booking Calendar
        </Typography>
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="body1">
            Manager booking calendar and schedule management will be displayed
            here.
          </Typography>
        </Paper>
      </Box>
    </ManagerLayout>
  );
};

export default ManagerBookingCalendarPage;

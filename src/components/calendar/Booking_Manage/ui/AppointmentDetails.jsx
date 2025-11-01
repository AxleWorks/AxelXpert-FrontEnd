import React from "react";
import { Box, Avatar, Typography, Stack, Chip, Divider } from "@mui/material";

function initials(name) {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0] || "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AppointmentDetails({ appointment }) {
  if (!appointment) return null;

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
          {initials(appointment.customer)}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1">{appointment.customer}</Typography>
          <Typography variant="body2" color="text.secondary">
            {appointment.vehicle} • {appointment.service}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
            <Chip label={appointment.time} size="small" />
            <Chip label={appointment.branch} size="small" variant="outlined" />
            <Chip
              label={appointment.status}
              size="small"
              color={
                appointment.status === "Pending"
                  ? "warning"
                  : appointment.status === "Approved"
                  ? "success"
                  : appointment.status === "Completed"
                  ? "primary"
                  : "default"
              }
            />
          </Stack>
        </Box>
      </Stack>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2">Contact</Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {appointment.phone || "—"}
        </Typography>

        <Typography variant="subtitle2">Assigned Employee</Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {appointment.assignedEmployee ||
            appointment.assignedEmployeeName ||
            "No Assignee"}
        </Typography>

        {appointment.notes && (
          <>
            <Typography variant="subtitle2">Customer Notes</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {appointment.notes}
            </Typography>
          </>
        )}

        <Divider sx={{ my: 2 }} />
      </Box>
    </Box>
  );
}

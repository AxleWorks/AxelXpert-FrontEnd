import React from "react";
import { Box, Avatar, Typography, Stack, Chip, Divider } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import NotesIcon from "@mui/icons-material/Notes";

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
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 3 }}>
        <Avatar
          sx={(theme) => ({
            bgcolor: "primary.main",
            width: 64,
            height: 64,
            fontSize: "1.5rem",
            fontWeight: 600,
            boxShadow: theme.palette.mode === "dark" ? 2 : 3,
          })}
        >
          {initials(appointment.customer)}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {appointment.customer}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {appointment.vehicle} • {appointment.service}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            <Chip
              label={appointment.time}
              size="small"
              sx={(theme) => ({
                fontWeight: 600,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(33, 150, 243, 0.2)"
                    : "primary.50",
                color:
                  theme.palette.mode === "dark"
                    ? "primary.light"
                    : "primary.main",
              })}
            />
            <Chip
              label={appointment.branch}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 500 }}
            />
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
              sx={{ fontWeight: 600 }}
            />
          </Stack>
        </Box>
      </Stack>

      <Stack spacing={2.5}>
        <Box>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: 0.5 }}
          >
            <PhoneIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Contact
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ pl: 3.2 }}>
            {appointment.phone || "—"}
          </Typography>
        </Box>

        <Box>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: 0.5 }}
          >
            <AssignmentIndIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Assigned Employee
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ pl: 3.2 }}>
            {appointment.assignedEmployee ||
              appointment.assignedEmployeeName ||
              "No Assignee"}
          </Typography>
        </Box>

        {appointment.notes && (
          <Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 0.5 }}
            >
              <NotesIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Customer Notes
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={(theme) => ({
                pl: 3.2,
                fontStyle: "italic",
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "grey.50",
                p: 1.5,
                borderRadius: 1,
                ml: 3.2,
              })}
            >
              {appointment.notes}
            </Typography>
          </Box>
        )}
      </Stack>

      <Divider sx={{ mt: 3 }} />
    </Box>
  );
}

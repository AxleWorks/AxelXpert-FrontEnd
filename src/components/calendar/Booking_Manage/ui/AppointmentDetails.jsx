import React from "react";
import {
  Box,
  Avatar,
  Typography,
  Stack,
  Chip,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import NotesIcon from "@mui/icons-material/Notes";
import ScheduleIcon from "@mui/icons-material/Schedule";
import BuildIcon from "@mui/icons-material/Build";
import LocationOnIcon from "@mui/icons-material/LocationOn";

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
    <Card
      sx={(theme) => ({
        mb: 4,
        borderRadius: 3,
        border: "1px solid",
        borderColor:
          theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "grey.200",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 4px 12px rgba(0,0,0,0.2)"
            : "0 4px 12px rgba(0,0,0,0.08)",
      })}
      elevation={0}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
          <Avatar
            sx={(theme) => ({
              bgcolor: "primary.main",
              width: 72,
              height: 72,
              fontSize: "1.75rem",
              fontWeight: 700,
              boxShadow: theme.palette.mode === "dark" ? 3 : 4,
            })}
          >
            {initials(appointment.customer)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}
            >
              {appointment.customer}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {appointment.vehicle} • {appointment.service}
            </Typography>
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ flexWrap: "wrap", gap: 1 }}
            >
              <Chip
                icon={<ScheduleIcon />}
                label={appointment.time}
                size="small"
                sx={(theme) => ({
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  height: 32,
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(33, 150, 243, 0.15)"
                      : "primary.50",
                  color:
                    theme.palette.mode === "dark"
                      ? "primary.light"
                      : "primary.main",
                  "& .MuiChip-icon": {
                    color: "inherit",
                  },
                })}
              />
              <Chip
                icon={<LocationOnIcon />}
                label={appointment.branch}
                size="small"
                variant="outlined"
                sx={{
                  fontWeight: 500,
                  height: 32,
                  fontSize: "0.875rem",
                  borderColor: "text.secondary",
                  color: "text.secondary",
                }}
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
                sx={{
                  fontWeight: 600,
                  height: 32,
                  fontSize: "0.875rem",
                }}
              />
            </Stack>
          </Box>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={3}>
          <Stack direction="row" spacing={3}>
            <Box sx={{ flex: 1 }}>
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <PhoneIcon sx={{ fontSize: 20, color: "primary.main" }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Contact Information
                </Typography>
              </Stack>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ pl: 3.2 }}
              >
                {appointment.phone || "Not provided"}
              </Typography>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <AssignmentIndIcon
                  sx={{ fontSize: 20, color: "primary.main" }}
                />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Assigned Employee
                </Typography>
              </Stack>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ pl: 3.2 }}
              >
                {appointment.assignedEmployee ||
                  appointment.assignedEmployeeName ||
                  "No employee assigned"}
              </Typography>
            </Box>
          </Stack>

          {appointment.notes && (
            <Box>
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ mb: 1.5 }}
              >
                <NotesIcon sx={{ fontSize: 20, color: "primary.main" }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Customer Notes
                </Typography>
              </Stack>
              <Box
                sx={(theme) => ({
                  pl: 3.2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.05)"
                      : "grey.50",
                  border: "1px solid",
                  borderColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.1)"
                      : "grey.200",
                })}
              >
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    fontStyle: "italic",
                    lineHeight: 1.6,
                  }}
                >
                  {appointment.notes}
                </Typography>
              </Box>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

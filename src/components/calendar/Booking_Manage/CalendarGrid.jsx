import React from "react";
import { Box, Paper, List, ListItem, ListItemText, Chip } from "@mui/material";

function getStatusColor(mode, status) {
  const dark = mode === "dark";
  switch (status) {
    case "Pending":
      return dark ? "#d97706" : "#f59e0b";
    case "Approved":
      return dark ? "#15803d" : "#16a34a";
    case "Completed":
      return dark ? "#1e3a8a" : "#2563eb";
    case "Cancelled":
      return dark ? "#b91c1c" : "#dc2626";
    default:
      return dark ? "#374151" : "#6b7280";
  }
}

export default function CalendarGrid({ days, onAppointmentClick, themeMode }) {
  return (
    <Box
      sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}
    >
      {days.map((day, idx) => (
        <Paper
          key={idx}
          variant="outlined"
          sx={{
            minHeight: 120,
            p: 1,
            bgcolor: day.isCurrentMonth ? "background.paper" : "action.hover",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Box sx={{ fontWeight: 600 }}>{day.dayNumber}</Box>
          </Box>

          <List dense disablePadding>
            {day.appointments &&
              day.appointments.slice(0, 3).map((apt) => (
                <ListItem
                  key={apt.id}
                  sx={{ p: 0, mb: 0.5, cursor: "pointer" }}
                  onClick={() => onAppointmentClick(apt)}
                >
                  <Chip
                    label={`${apt.time} • ${apt.customer}`}
                    size="small"
                    sx={{
                      bgcolor: getStatusColor(themeMode, apt.status),
                      color: "#fff",
                      width: "100%",
                    }}
                  />
                </ListItem>
              ))}

            {day.appointments && day.appointments.length > 3 && (
              <ListItem sx={{ p: 0 }}>
                <ListItemText
                  primary={`+${day.appointments.length - 3} more`}
                  primaryTypographyProps={{ variant: "caption" }}
                />
              </ListItem>
            )}
          </List>
        </Paper>
      ))}
    </Box>
  );
}

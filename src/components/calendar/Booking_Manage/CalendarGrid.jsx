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

function dateKey(d) {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function CalendarGrid({
  days,
  onAppointmentClick,
  themeMode,
  onDayClick, // optional for user calendar: click a day to start booking
  availableSlotsByDate = {}, // optional map: YYYY-MM-DD -> number or array
}) {
  return (
    <Box
      sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}
    >
      {days.map((day, idx) => {
        const isPast = day?.date
          ? new Date(day.date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
          : false;
        const cellBg = !day.isCurrentMonth
          ? "action.hover"
          : isPast
          ? "action.disabledBackground"
          : "background.paper";
        const canClickDay = !!onDayClick && !isPast;
        return (
          <Paper
            key={idx}
            variant="outlined"
            sx={{
              minHeight: 120,
              p: 1,
              bgcolor: cellBg,
              cursor: canClickDay ? "pointer" : "default",
            }}
            onClick={canClickDay ? () => onDayClick(day.date || day) : undefined}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Box sx={{ fontWeight: 600, color: isPast ? "text.disabled" : undefined }}>
                {day.dayNumber}
              </Box>
            </Box>

            <List dense disablePadding>
            {/* Optional available slots chip for user view */}
            {(() => {
              const key = dateKey(day.date);
              const val = availableSlotsByDate[key];
              const count = Array.isArray(val) ? val.length : Number(val) || 0;
              return count > 0 ? (
                <ListItem sx={{ p: 0, mb: 0.5 }} onClick={(e) => e.stopPropagation()}>
                  <Chip
                    label={`${count} slots`}
                    size="small"
                    sx={{ bgcolor: "success.main", color: "#fff", width: "100%" }}
                  />
                </ListItem>
              ) : null;
            })()}

            {day.appointments &&
              day.appointments.slice(0, 3).map((apt) => (
                <ListItem
                  key={apt.id}
                  sx={{ p: 0, mb: 0.5, cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAppointmentClick && onAppointmentClick(apt);
                  }}
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
        );
      })}
    </Box>
  );
}

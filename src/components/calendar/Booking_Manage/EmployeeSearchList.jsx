import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip,
  Box,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function initials(name) {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0] || "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function EmployeeSearchList({
  employees = [],
  searchTerm = "",
  selectedEmployee,
  setSelectedEmployee,
}) {
  const filtered = React.useMemo(() => {
    const q = (searchTerm || "").toLowerCase().trim();
    if (!q) return employees;
    return employees.filter((e) =>
      (e.name + " " + (e.role || "")).toLowerCase().includes(q)
    );
  }, [employees, searchTerm]);

  const visibleCount = Math.min(filtered.length || 0, 5);
  const maxHeight = `${visibleCount * 64 + 8}px`;

  return (
    <List
      dense
      sx={(theme) => ({
        maxHeight,
        overflowY: "auto",
        bgcolor:
          theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "white",
        borderRadius: 2,
        border: "1px solid",
        borderColor:
          theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "grey.200",
        p: 0.5,
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.2)"
              : "rgba(0,0,0,0.2)",
          borderRadius: "4px",
        },
      })}
    >
      {filtered.length === 0 && (
        <ListItem>
          <ListItemText
            primary="No employees found"
            primaryTypographyProps={{
              variant: "body2",
              color: "text.secondary",
              textAlign: "center",
            }}
          />
        </ListItem>
      )}

      {filtered.map((emp) => {
        const isSelected = selectedEmployee?.id === emp.id;
        return (
          <ListItem
            key={emp.id}
            alignItems="center"
            button
            onClick={() => setSelectedEmployee(emp)}
            sx={(theme) => ({
              borderRadius: 1.5,
              mb: 0.5,
              bgcolor: isSelected
                ? theme.palette.mode === "dark"
                  ? "rgba(33, 150, 243, 0.2)"
                  : "primary.50"
                : "transparent",
              border: "2px solid",
              borderColor: isSelected ? "primary.main" : "transparent",
              "&:hover": {
                bgcolor: isSelected
                  ? theme.palette.mode === "dark"
                    ? "rgba(33, 150, 243, 0.3)"
                    : "primary.100"
                  : theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.05)"
                  : "action.hover",
              },
              height: 64,
              transition: "all 0.2s",
              position: "relative",
            })}
          >
            <ListItemAvatar>
              <Avatar
                sx={{
                  bgcolor: emp.available ? "success.main" : "grey.500",
                  fontWeight: 600,
                  boxShadow: isSelected ? 2 : 1,
                }}
              >
                {initials(emp.name)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {emp.name}
                </Typography>
              }
              secondary={
                <Typography variant="body2" color="text.secondary">
                  {emp.role}
                </Typography>
              }
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label={emp.available ? "Available" : "Busy"}
                color={emp.available ? "success" : "default"}
                size="small"
                sx={{ fontWeight: 600 }}
              />
              {isSelected && (
                <CheckCircleIcon sx={{ color: "primary.main", fontSize: 24 }} />
              )}
            </Box>
          </ListItem>
        );
      })}
    </List>
  );
}

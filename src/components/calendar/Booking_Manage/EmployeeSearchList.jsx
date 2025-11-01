import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip,
} from "@mui/material";

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
  const maxHeight = `${visibleCount * 56}px`;

  return (
    <List dense sx={{ maxHeight, overflowY: "auto", mb: 1 }}>
      {filtered.length === 0 && (
        <ListItem>
          <ListItemText
            primary="No employees found"
            primaryTypographyProps={{
              variant: "body2",
              color: "text.secondary",
            }}
          />
        </ListItem>
      )}

      {filtered.map((emp) => (
        <ListItem
          key={emp.id}
          alignItems="center"
          button
          onClick={() => setSelectedEmployee(emp)}
          sx={{
            borderRadius: 1,
            mb: 0.5,
            bgcolor:
              selectedEmployee?.id === emp.id
                ? "action.selected"
                : "transparent",
            "&:hover": { bgcolor: "action.hover" },
            height: 56,
          }}
        >
          <ListItemAvatar>
            <Avatar
              sx={{ bgcolor: emp.available ? "success.main" : "grey.500" }}
            >
              {initials(emp.name)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={emp.name} secondary={emp.role} />
          <Chip
            label={emp.available ? "Available" : "Busy"}
            color={emp.available ? "success" : "default"}
            size="small"
          />
        </ListItem>
      ))}
    </List>
  );
}

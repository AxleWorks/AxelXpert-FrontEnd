import React from "react";
import { Box, Typography, Checkbox as MuiCheckbox } from "@mui/material";

export function SubtasksList({ subtasks, onToggle, disabled }) {
  if (!subtasks || subtasks.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {subtasks.map((subtask) => (
        <Box
          key={subtask.id}
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1,
            backgroundColor: "action.hover",
            borderRadius: 1,
          }}
        >
          <MuiCheckbox
            checked={subtask.status === "COMPLETED"}
            onChange={() => onToggle(subtask.id)}
            disabled={disabled}
            sx={{ mr: 1 }}
          />
          <Typography
            variant="body2"
            sx={{
              textDecoration:
                subtask.status === "COMPLETED" ? "line-through" : "none",
              color:
                subtask.status === "COMPLETED"
                  ? "text.secondary"
                  : "text.primary",
            }}
          >
            {subtask.title}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

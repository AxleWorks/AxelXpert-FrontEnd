import React from "react";
import { Box, Typography } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { Card, CardContent } from "../ui/card";

export function CompletedTaskCard({ task }) {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                backgroundColor: "success.light",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckCircle
                sx={{ fontSize: "1.5rem", color: "success.dark" }}
              />
            </Box>
            <Box>
              <Typography variant="h6" component="h4">
                {task.vehicle}
              </Typography>
              <Typography color="text.secondary">
                {task.service || task.title}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography color="text.secondary">Completed</Typography>
            <Typography>{task.completedTime}</Typography>
            {task.duration && (
              <Typography color="text.secondary" variant="body2">
                Duration: {task.duration}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

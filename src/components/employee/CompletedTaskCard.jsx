import React from "react";
import { Box, Typography, Chip, Stack } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { Card, CardContent } from "../ui/card";

export function CompletedTaskCard({ task }) {
  const theme = useTheme();
  const startTime = task.startTime
    ? new Date(task.startTime).toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  const endTime = task.completedTime
    ? new Date(task.completedTime).toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  const duration =
    task.startTime && task.completedTime
      ? `${Math.round(
          (new Date(task.completedTime) - new Date(task.startTime)) /
            (1000 * 60)
        )} mins`
      : task.durationMinutes
      ? `${task.durationMinutes} mins`
      : "N/A";

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {/* 🔹 Top Row: Vehicle + Service + Completed Status */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  backgroundColor: "success.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckCircle
                  sx={{
                    fontSize: "1.8rem",
                    color: theme.palette.mode === "light" ? "white" : "black",
                  }}
                />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {task.vehicle}
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                  {task.service || task.title}
                </Typography>
              </Box>
            </Box>

            <Chip
              label="Completed"
              color="success"
              variant="filled"
              icon={<CheckCircle sx={{ fontSize: 18 }} />}
              sx={{
                fontWeight: 500,
                color: theme.palette.mode === "light" ? "white" : "black",
              }}
            />
          </Box>

          {/* 🔹 Bottom Row: Highlighted Time Chips */}
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            flexWrap="wrap"
          >
            <Chip
              label={`Start: ${startTime}`}
              color="info"
              variant="outlined"
            />
            <Chip
              label={`End: ${endTime}`}
              color="warning"
              variant="outlined"
            />
            <Chip
              label={`Duration: ${duration}`}
              color="success"
              variant="filled"
              sx={{
                fontWeight: 600,
                color: theme.palette.mode === "light" ? "white" : "black",
              }}
            />
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

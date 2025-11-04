import React from "react";
import { Box, Typography, Grid, Chip as MuiChip } from "@mui/material";
import { PlayArrow, Image, Note, ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { SubtasksList } from "./SubtasksList";

export function TaskCard({
  task,
  isTaskStarted,
  onStartTimer,
  onSubtaskToggle,
  hasActiveTimer,
}) {
  const navigate = useNavigate();
  return (
    <Card>
      <Box sx={{ p: 3, backgroundColor: "primary.main", color: "white" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="h5"
              component="h3"
              sx={{ mb: 1, fontWeight: 600 }}
            >
              {task.vehicle || "N/A"}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Badge sx={{ bgcolor: "", color: "white" }}>{task.title}</Badge>

              <MuiChip
                label={task.status}
                size="small"
                variant="filled"
                sx={{
                  fontWeight: "bold",
                  borderRadius: "4px",
                  ...(task.status === "IN_PROGRESS" && {
                    backgroundColor: "info.main",
                    color: "white",
                  }),
                }}
              />
            </Box>
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <Typography color="inherit" sx={{ opacity: 0.9 }}>
              Start Time
            </Typography>
            <Typography sx={{ fontWeight: 600 }}>
              {task.startTime
                ? new Date(task.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Not Started"}
            </Typography>
          </Box>
        </Box>
      </Box>

      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography color="text.secondary">Customer</Typography>
            <Typography>
              {task.customerName ||
                (task.description
                  ? task.description.split("customer: ")[1]
                  : "Unknown") ||
                "Unknown"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography color="text.secondary">Estimated Time</Typography>
            <Typography>{task?.estimatedTimeMinutes || 0} mins</Typography>
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2">Overall Progress</Typography>
            <Typography variant="body2">
              {(() => {
                if (task.progress !== undefined) return task.progress;
                if (task.subTasks && task.subTasks.length > 0) {
                  const completedCount = task.subTasks.filter(
                    (st) => st.status === "COMPLETED"
                  ).length;
                  return Math.round(
                    (completedCount / task.subTasks.length) * 100
                  );
                }
                return 0;
              })()}
              %
            </Typography>
          </Box>
          <Progress
            value={(() => {
              if (task.progress !== undefined) return task.progress;
              if (task.subTasks && task.subTasks.length > 0) {
                const completedCount = task.subTasks.filter(
                  (st) => st.status === "COMPLETED"
                ).length;
                return Math.round(
                  (completedCount / task.subTasks.length) * 100
                );
              }
              return 0;
            })()}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Typography variant="h6" component="h4">
            Subtasks
          </Typography>
          <SubtasksList
            subtasks={task.subTasks}
            onToggle={(subtaskId) => onSubtaskToggle(subtaskId)}
            disabled={false}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            sx={{
              flexGrow: 1,
              backgroundColor: isTaskStarted
                ? "action.disabledBackground"
                : "success.main",
              color: isTaskStarted ? "action.disabled" : "white",
              "&:hover": {
                backgroundColor: isTaskStarted
                  ? "action.disabledBackground"
                  : "success.dark",
              },
              "&:disabled": {
                backgroundColor: "action.disabledBackground",
                color: "action.disabled",
              },
            }}
            onClick={onStartTimer}
            disabled={isTaskStarted || hasActiveTimer}
          >
            <PlayArrow sx={{ fontSize: "1.125rem" }} />
            {isTaskStarted ? "Task In Progress" : "Start Timer"}
          </Button>
        </Box>

        {/* Images and Notes Count */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            p: 2,
            bgcolor: "background.default",
            borderRadius: 1,
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Image color="primary" />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Images
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {task.taskImages?.length || 0}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Note color="primary" />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Notes
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {task.taskNotes?.length || 0}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* View Details Button */}
        <Button
          onClick={() => navigate(`/employee/tasks/${task.id}`)}
          sx={{
            width: "100%",
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          View Full Details
          <ArrowForward sx={{ fontSize: "1.125rem", ml: 1 }} />
        </Button>
      </CardContent>
    </Card>
  );
}

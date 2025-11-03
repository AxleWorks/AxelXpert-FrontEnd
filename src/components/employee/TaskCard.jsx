import React from "react";
import { Box, Typography, Grid, Chip as MuiChip } from "@mui/material";
import { PlayArrow, CheckCircle, Upload } from "@mui/icons-material";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { SubtasksList } from "./SubtasksList";
import { ImagesSection } from "./ImagesSection";
import { NotesSection } from "./NotesSection";

export function TaskCard({
  task,
  isTaskStarted,
  isUploading,
  expandedImages,
  expandedNotes,
  noteText,
  isNoteVisible,
  onStartTimer,
  onSubtaskToggle,
  onImageUpload,
  onImageRemove,
  onImageToggle,
  onNoteToggle,
  onNoteChange,
  onNoteVisibilityChange,
  onNoteSubmit,
  onNoteRemove,
  hasActiveTimer,
}) {
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
            <Typography variant="h5" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
              {task.vehicle}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Badge sx={{ bgcolor: "", color: "white"}}>{task.title}</Badge>

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
            <Typography sx={{ fontWeight: 600 }}>{new Date(task.sheduledTime).toLocaleString()}</Typography>
          </Box>
        </Box>  
      </Box>

      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography color="text.secondary">Customer</Typography>
            <Typography>{task.customerName}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography color="text.secondary">Estimated Time</Typography>
            <Typography>{task.durationMinutes} mins</Typography>
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
            <Typography variant="body2">{task.progress || 0}%</Typography>
          </Box>
          <Progress value={task.progress} />
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

        <ImagesSection
          task={task}
          isTaskStarted={isTaskStarted}
          isExpanded={expandedImages}
          isUploading={isUploading}
          onToggle={onImageToggle}
          onUpload={onImageUpload}
          onRemove={onImageRemove}
        />

        <NotesSection
          task={task}
          isTaskStarted={isTaskStarted}
          isExpanded={expandedNotes}
          noteText={noteText}
          isVisible={isNoteVisible}
          onToggle={onNoteToggle}
          onNoteChange={onNoteChange}
          onVisibilityChange={onNoteVisibilityChange}
          onSubmit={onNoteSubmit}
          onRemove={onNoteRemove}
        />
      </CardContent>
    </Card>
  );
}

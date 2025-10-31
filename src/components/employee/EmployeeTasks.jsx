import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Checkbox as MuiCheckbox,
  FormControlLabel,
  Chip as MuiChip,
} from "@mui/material";
import {
  PlayArrow,
  Upload,
  CheckCircle,
} from "@mui/icons-material";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { TaskImageUploadModal } from "./TaskImageUploadModal";
import {authenticatedAxios} from "../../utils/axiosConfig";
import { API_BASE } from "../../config/apiEndpoints";
import { uploadImageToCloudinary } from "../../utils/cloudinaryUtils";

export function EmployeeTasks() {
  const [activeTasks, setActiveTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [taskNotes, setTaskNotes] = useState({});
  const [notesVisibility, setNotesVisibility] = useState({});
  const [uploadingImages, setUploadingImages] = useState({});

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("authUser"));
        const response = await authenticatedAxios.get(
          `${API_BASE}/api/tasks/employee/${user.id}`
        );

        const allTasks = response.data;
        const active = allTasks.filter((task) => task.status !== "COMPLETED");
        const completed = allTasks.filter(
          (task) => task.status === "COMPLETED"
        );

        setActiveTasks(active);
        setCompletedTasks(completed);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const handleStartTimer = async (taskId) => {
    const currentTime = new Date().toISOString();

    try {
      // Send start time to backend
      await authenticatedAxios.patch(`${API_BASE}/api/tasks/${taskId}`, {
        startTime: currentTime,
        status: "IN_PROGRESS",
      });

      // Update local state
      setActiveTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: "IN_PROGRESS",
                startTime: new Date(currentTime).toLocaleTimeString(),
                actualStartTime: currentTime,
              }
            : task
        )
      );

    } catch (error) {
      console.error("Failed to start timer:", error);
    }
  };

  const handleSubtaskToggle = async (taskId, subtaskId) => {

    const task = activeTasks.find((t) => t.id === taskId);
    const subtask = task.subTasks.find((st) => st.id === subtaskId);

    if (task.status !== "IN_PROGRESS") return

    const toggledState = subtask.status === "COMPLETED" ? "NOT_STARTED" : "COMPLETED";

    // hold the updated subtasks
    const updatedSubtasks = task.subTasks.map((st) =>
      st.id === subtaskId ? { ...st, status: toggledState } : st
    );

    // progress update
    const completedCount = updatedSubtasks.filter((st) => st.status === "COMPLETED").length;
    const progress = Math.round((completedCount / updatedSubtasks.length) * 100);
    const allSubtasksCompleted = updatedSubtasks.every((st) => st.status === "COMPLETED");

    setActiveTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            subTasks: updatedSubtasks,
            progress: progress,
            status: allSubtasksCompleted ? "COMPLETED" : t.status,
          };
        }
        return t;
      })
    );

    try {
      await authenticatedAxios.patch(
        `${API_BASE}/api/tasks/subtasks/${subtaskId}`,
        {
          status: toggledState,
        }
      );

      if (allSubtasksCompleted) {
        await handleTaskCompletion(taskId, updatedSubtasks);
      }
    } catch (error) {
      console.error("Failed to update subtask:", error);
      
      // Revert to original state on error
      setActiveTasks((prevTasks) =>
        prevTasks.map((t) => {
          if (t.id === taskId) {
            return {
              ...t,
              subTasks: task.subTasks,
              progress: task.progress,
              status: task.status,
            };
          }
          return t;
        })
      );
    }
  };

  const handleTaskCompletion = async (taskId, updatedSubtasks) => {
    const completionTime = new Date().toISOString();
    
    try {
      await authenticatedAxios.patch(`${API_BASE}/api/tasks/${taskId}`, {
        completedTime: completionTime,
        status: "COMPLETED",
      });

      setActiveTasks((prevTasks) => {
        const completedTask = prevTasks.find((t) => t.id === taskId);
        if (!completedTask) return prevTasks;

        setCompletedTasks((prevCompleted) => [
          ...prevCompleted,
          {
            ...completedTask,
            status: "COMPLETED",
            completedTime: new Date(completionTime).toLocaleString(),
            subTasks: updatedSubtasks,
          },
        ]);

        return prevTasks.filter((t) => t.id !== taskId);
      });

    } catch (error) {
      console.error("Failed to complete task:", error);
    }
  };

  const handleOpenUploadModal = (taskId) => {
    setCurrentTaskId(taskId);
    setUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
    setCurrentTaskId(null);
  };

  const handleImageUpload = async (file, description) => {
    if (!file || !currentTaskId) return;

    setUploadingImages((prev) => ({ ...prev, [currentTaskId]: true }));

    try {

      const result = await uploadImageToCloudinary(file);
      
      if (!result.success) {
        console.error(`Failed to upload ${file.name}:`, result.error);
        throw new Error(result.error);
      }

      const imageData = {
        url: result.data.url,
        description: description || "",
      };

      await authenticatedAxios.post(`${API_BASE}/api/tasks/${currentTaskId}/images`, {
        imageUrl: imageData.url,
        description: imageData.description,
      });

      setActiveTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === currentTaskId
            ? {
                ...task,
                images: [...(task.images || []), imageData],
              }
            : task
        )
      );

    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setUploadingImages((prev) => ({ ...prev, [currentTaskId]: false }));
    }
  };

  const handleNotesChange = (taskId, value) => {
    setTaskNotes((prev) => ({
      ...prev,
      [taskId]: value,
    }));
  };

  const handleVisibilityChange = (taskId, checked) => {
    setNotesVisibility((prev) => ({
      ...prev,
      [taskId]: checked,
    }));
  };

  const handleNotesSubmit = async (taskId) => {
    const noteText = taskNotes[taskId] || "";
    const isVisible = notesVisibility[taskId] || false;

    try {
      const user = JSON.parse(localStorage.getItem("authUser"));
      await authenticatedAxios.post(
        `${API_BASE}/api/tasks/${taskId}/notes?authorId=${user.id}`,
        {
          noteType:"EMPLOYEE_NOTE",
          content: noteText,
          visibleToCustomer: isVisible,
        }
      );

      setTaskNotes((prev) => ({
        ...prev,
        [taskId]: "",
      }));
      setNotesVisibility((prev) => ({
        ...prev,
        [taskId]: false,
      }));

    } catch (error) {
      console.error("Failed to submit note:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          My Tasks
        </Typography>
        <Typography color="text.secondary">
          Manage and track your assigned tasks
        </Typography>
      </Box>

      <Tabs defaultValue="active" sx={{ width: "100%" }}>
        <TabsList
          sx={{
            display: "grid",
            width: "100%",
            maxWidth: "28rem",
            gridTemplateColumns: "repeat(2, 1fr)",
          }}
        >
          <TabsTrigger value="active">Active Tasks</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent
          value="active"
          sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 3 }}
        >
          {activeTasks.map((task) => {
            const isTaskStarted = task.status != "COMPLETED" && task.status != "NOT_STARTED";
            const isUploading = uploadingImages[task.id];

            return (
              <Card key={task.id}>
                <Box sx={{ p: 2, pb: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <CardTitle sx={{ mb: 1 }}>{task.vehicle}</CardTitle>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Badge>{task.title}</Badge>

                        <MuiChip
                          label={task.status}
                          size="small"
                          variant={
                            task.status === "IN_PROGRESS"
                              ? "filled"
                              : "outlined"
                          }
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
                      <Typography color="text.secondary">
                        Start Time
                      </Typography>
                      <Typography>{task.sheduledTime}</Typography>
                    </Box>
                  </Box>
                </Box>

                <CardContent
                  sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography color="text.secondary">Customer</Typography>
                      <Typography>{task.customerName}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography color="text.secondary">
                        Estimated Time
                      </Typography>
                      <Typography>{task.durationMinutes}</Typography>
                    </Grid>
                  </Grid>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="body2">
                        Overall Progress
                      </Typography>
                      <Typography variant="body2">{task.progress || 0}%</Typography>
                    </Box>
                    <Progress value={task.progress} />
                  </Box>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                  >
                    <Typography variant="h6" component="h4">
                      Subtasks
                    </Typography>
                    {task.subTasks.map((subtask) => (
                      <Box
                        key={subtask.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          p: 1.5,
                          backgroundColor: "action.hover",
                          borderRadius: 2,
                        }}
                      >
                        <MuiCheckbox
                          checked={subtask.status === "COMPLETED"}
                          size="small"
                          onChange={() =>
                            handleSubtaskToggle(task.id, subtask.id)
                          }
                        />
                        <Typography
                          sx={{
                            textDecoration:
                              subtask.status === "COMPLETED"
                                ? "line-through"
                                : "none",
                            color:
                              subtask.status === "COMPLETED"
                                ? "text.disabled"
                                : "text.primary",
                          }}
                        >
                          {subtask.title}
                        </Typography>
                        {subtask.status === "COMPLETED" && (
                          <CheckCircle
                            sx={{
                              fontSize: "1rem",
                              color: "success.main",
                              ml: "auto",
                            }}
                          />
                        )}
                      </Box>
                    ))}
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
                      onClick={() => handleStartTimer(task.id)}
                      disabled={isTaskStarted}
                    >
                      <PlayArrow sx={{ fontSize: "1.125rem" }} />
                      {isTaskStarted ? "Task In Progress" : "Start Timer"}
                    </Button>
                    <Button
                      variant="outlined"
                      disabled={isUploading || !isTaskStarted}
                      onClick={() => handleOpenUploadModal(task.id)}
                      sx={{
                        flexGrow: 1,
                        backgroundColor: "background.paper",
                        color: "text.primary",
                        borderColor: "divider",
                        "&:hover": {
                          backgroundColor: "warning.dark",
                          color: "white",
                          borderColor: "white",
                        },
                        "&:disabled": {
                          backgroundColor: "action.disabledBackground",
                          color: "action.disabled",
                          borderColor: "action.disabledBackground",
                        },
                      }}
                    >
                      <Upload sx={{ fontSize: "1.125rem" }} />
                      {isUploading ? "Uploading..." : "Upload Image"}
                    </Button>
                  </Box>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Typography component="label" sx={{ fontWeight: "medium" }}>
                      Add Notes
                    </Typography>
                    <Textarea
                      placeholder="Enter any additional notes here..."
                      value={taskNotes[task.id] || ""}
                      onChange={(e) =>
                        handleNotesChange(task.id, e.target.value)
                      }
                      rows={4}
                    />
                    <FormControlLabel
                      control={
                        <MuiCheckbox
                          id={`visible-${task.id}`}
                          size="small"
                          checked={notesVisibility[task.id] || false}
                          onChange={(e) =>
                            handleVisibilityChange(task.id, e.target.checked)
                          }
                        />
                      }
                      label="Make visible to customer"
                      sx={{ color: "text.secondary" }}
                    />
                    <Button
                      size="small"
                      onClick={() => handleNotesSubmit(task.id)}
                      disabled={!taskNotes[task.id]?.trim()}
                      sx={{
                        backgroundColor: "primary.main",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "primary.dark",
                        },
                        "&:disabled": {
                          backgroundColor: "action.disabledBackground",
                          color: "action.disabled",
                        },
                      }}
                    >
                      Submit Note
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent
          value="completed"
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}
        >
          {completedTasks.map((task) => (
            <Card key={task.id}>
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
                      <Typography color="text.secondary">
                        Duration: {task.duration}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <TaskImageUploadModal
        open={uploadModalOpen}
        onClose={handleCloseUploadModal}
        onConfirm={handleImageUpload}
        taskId={currentTaskId}
        isUploading={uploadingImages[currentTaskId]}
      />
    </Box>
  );
}
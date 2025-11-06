import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Chip as MuiChip,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import {
  ArrowBack,
  Delete,
  Upload,
  AccessTime,
  CheckCircle,
} from "@mui/icons-material";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { SubtasksList } from "../../components/employee/SubtasksList";
import { TaskImageUploadModal } from "../../components/employee/TaskImageUploadModal";
import { toast } from "../../components/ui/toast";
import { authenticatedAxios } from "../../utils/axiosConfig";
import { API_BASE } from "../../config/apiEndpoints";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../../utils/cloudinaryUtils";
import { getCurrentUser } from "../../utils/jwtUtils";
import EmployeeLayout from "../../layouts/employee/EmployeeLayout";

export default function EmployeeTaskDetailsPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteVisibility, setNoteVisibility] = useState(false);

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const user = getCurrentUser();
      if (!user) {
        console.error("No authenticated user found");
        navigate("/employee/tasks");
        return;
      }

      const response = await authenticatedAxios.get(
        `${API_BASE}/api/tasks/${taskId}`
      );
      const taskData = response.data;
      // Calculate progress based on subtasks
      if (taskData.subTasks && taskData.subTasks.length > 0) {
        const completedCount = taskData.subTasks.filter(
          (st) => st.status === "COMPLETED"
        ).length;
        taskData.progress = Math.round(
          (completedCount / taskData.subTasks.length) * 100
        );
      }
      setTask(taskData);
    } catch (error) {
      console.error("Error fetching task details:", error);
      toast.error("Failed to load task details");
      navigate("/employee/tasks");
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeStats = () => {
    if (!task) return null;

    const estimatedMinutes = task.estimatedTimeMinutes || 0;
    const scheduledTime = new Date(task.startTime);
    const currentTime = new Date();

    // Calculate current duration if task is in progress
    let currentDuration = 0;
    if (task.status === "IN_PROGRESS" && task.startTime) {
      const startTime = new Date(task.startTime);
      currentDuration = Math.floor((currentTime - startTime) / (1000 * 60));
    } else if (
      task.status === "COMPLETED" &&
      task.startTime &&
      task.completedTime
    ) {
      const startTime = new Date(task.startTime);
      const endTime = new Date(task.completedTime);
      currentDuration = Math.floor((endTime - startTime) / (1000 * 60));
    }

    const remainingTime = estimatedMinutes - currentDuration;
    const isDelayed = remainingTime < 0;

    return {
      estimatedMinutes,
      currentDuration,
      remainingTime: Math.abs(remainingTime),
      isDelayed,
    };
  };

  const handleSubtaskToggle = async (subtaskId) => {
    if (task.status !== "IN_PROGRESS") {
      toast.error("Start the task timer before updating subtasks.");
      return;
    }

    const subtask = task.subTasks.find((st) => st.id === subtaskId);
    const toggledState =
      subtask.status === "COMPLETED" ? "NOT_STARTED" : "COMPLETED";

    const updatedSubtasks = task.subTasks.map((st) =>
      st.id === subtaskId ? { ...st, status: toggledState } : st
    );

    const completedCount = updatedSubtasks.filter(
      (st) => st.status === "COMPLETED"
    ).length;
    const progress = Math.round(
      (completedCount / updatedSubtasks.length) * 100
    );

    setTask((prev) => ({
      ...prev,
      subTasks: updatedSubtasks,
      progress,
    }));

    try {
      await authenticatedAxios.patch(
        `${API_BASE}/api/tasks/subtasks/${subtaskId}`,
        { status: toggledState }
      );

      if (updatedSubtasks.every((st) => st.status === "COMPLETED")) {
        await handleTaskCompletion();
      }
    } catch (error) {
      console.error("Failed to update subtask:", error);
      toast.error("Failed to update subtask");
      fetchTaskDetails(); // Refresh to get correct state
    }
  };

  const handleTaskCompletion = async () => {
    const completionTime = new Date().toISOString();

    try {
      await authenticatedAxios.patch(`${API_BASE}/api/tasks/${taskId}`, {
        completedTime: completionTime,
        status: "COMPLETED",
      });

      setTask((prev) => ({
        ...prev,
        status: "COMPLETED",
        completedTime,
      }));

      toast.success("Task completed successfully!");
    } catch (error) {
      console.error("Failed to complete task:", error);
      toast.error("Failed to complete task");
    }
  };

  const handleImageUpload = async (file, description) => {
    if (!file) return;

    setIsUploading(true);

    try {
      const result = await uploadImageToCloudinary(file, {
        folder: "task_images",
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      const imageData = {
        imageUrl: result.data.url,
        publicId: result.data.publicId,
        description: description || "",
      };

      const response = await authenticatedAxios.post(
        `${API_BASE}/api/tasks/${taskId}/images`,
        imageData
      );

      setTask((prev) => ({
        ...prev,
        taskImages: [...(prev.taskImages || []), response.data],
      }));

      toast.success("Image uploaded successfully");
      setUploadModalOpen(false);
    } catch (error) {
      console.error("Failed to upload image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async (imageData) => {
    const imageId = imageData.id;

    try {
      if (imageData.publicId) {
        await deleteImageFromCloudinary(imageData.publicId);
      }

      await authenticatedAxios.delete(
        `${API_BASE}/api/tasks/${taskId}/images/${imageId}`
      );

      setTask((prev) => ({
        ...prev,
        taskImages: (prev.taskImages || []).filter((img) => img.id !== imageId),
      }));

      toast.success("Image removed successfully");
    } catch (error) {
      console.error("Failed to remove image:", error);
      toast.error("Failed to remove image");
    }
  };

  const handleNoteSubmit = async () => {
    if (!noteText.trim()) {
      toast.error("Note cannot be empty");
      return;
    }

    try {
      const user = getCurrentUser();
      if (!user) {
        toast.error("No authenticated user found");
        return;
      }

      const response = await authenticatedAxios.post(
        `${API_BASE}/api/tasks/${taskId}/notes?authorId=${user.id}`,
        {
          noteType: "EMPLOYEE_NOTE",
          content: noteText,
          visibleToCustomer: noteVisibility,
        }
      );

      setTask((prev) => ({
        ...prev,
        taskNotes: [...(prev.taskNotes || []), response.data],
      }));

      setNoteText("");
      setNoteVisibility(false);
      toast.success("Note added successfully");
    } catch (error) {
      console.error("Failed to add note:", error);
      toast.error("Failed to add note");
    }
  };

  const handleRemoveNote = async (noteId) => {
    try {
      await authenticatedAxios.delete(
        `${API_BASE}/api/tasks/${taskId}/notes/${noteId}`
      );

      setTask((prev) => ({
        ...prev,
        taskNotes: (prev.taskNotes || []).filter((note) => note.id !== noteId),
      }));

      toast.success("Note removed successfully");
    } catch (error) {
      console.error("Failed to remove note:", error);
      toast.error("Failed to remove note");
    }
  };

  if (loading) {
    return (
      <EmployeeLayout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <Typography>Loading task details...</Typography>
        </Box>
      </EmployeeLayout>
    );
  }

  if (!task) {
    return (
      <EmployeeLayout>
        <Box sx={{ p: 3 }}>
          <Typography>Task not found</Typography>
        </Box>
      </EmployeeLayout>
    );
  }

  const timeStats = calculateTimeStats();

  // Parse customer name from description if not available
  const customerName =
    task.customerName ||
    (task.description ? task.description.split("customer: ")[1] : "Unknown") ||
    "Unknown";

  return (
    <EmployeeLayout>
      <Box sx={{ p: 3 }}>
        {/* Header with back button */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton
            onClick={() => navigate("/employee/tasks")}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Task Details
          </Typography>
        </Box>

        <Card>
          {/* Task Header */}
          <Box
            sx={{
              p: 3,
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "background.paper"
                  : "primary.main",
              color: (theme) =>
                theme.palette.mode === "dark" ? "text.primary" : "white",
              borderBottom: (theme) =>
                theme.palette.mode === "dark"
                  ? `1px solid ${theme.palette.divider}`
                  : "none",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
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
                  <Badge
                    sx={{
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(59, 130, 246, 0.2)"
                          : "rgba(255,255,255,0.2)",
                      color: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.palette.primary.light
                          : "white",
                    }}
                  >
                    {task.title}
                  </Badge>

                  <MuiChip
                    label={task.status}
                    size="small"
                    variant="filled"
                    sx={{
                      fontWeight: 600,
                      borderRadius: "4px",
                      ...(task.status === "NOT_STARTED" && {
                        backgroundColor: "#94a3b8",
                        color: "white",
                      }),
                      ...(task.status === "IN_PROGRESS" && {
                        backgroundColor: "#3b82f6",
                        color: "white",
                      }),
                      ...(task.status === "COMPLETED" && {
                        backgroundColor: "#22c55e",
                        color: "white",
                      }),
                      ...(task.status === "DELAYED" && {
                        backgroundColor: "#ef4444",
                        color: "white",
                      }),
                      ...(task.status === "PENDING" && {
                        backgroundColor: "#f59e0b",
                        color: "white",
                      }),
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ textAlign: "right" }}>
                <Typography color="inherit" sx={{ opacity: 0.9 }}>
                  Scheduled Time
                </Typography>
                <Typography sx={{ fontWeight: 600 }}>
                  {new Date(task.startTime).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Box>

          <CardContent
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            {/* Basic Info */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography color="text.secondary">Customer</Typography>
                <Typography fontWeight={500}>{customerName}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography color="text.secondary">Service ID</Typography>
                <Typography fontWeight={500}>{task.serviceId}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography color="text.secondary">Assigned To</Typography>
                <Typography fontWeight={500}>
                  {task.assignedEmployeeName}
                </Typography>
              </Grid>
            </Grid>

            {/* Time Statistics */}
            {timeStats && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Time Statistics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <AccessTime color="primary" fontSize="small" />
                          <Typography color="text.secondary" variant="body2">
                            Estimated Time
                          </Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={600}>
                          {timeStats.estimatedMinutes} mins
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <AccessTime color="info" fontSize="small" />
                          <Typography color="text.secondary" variant="body2">
                            Current Duration
                          </Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={600}>
                          {timeStats.currentDuration} mins
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <AccessTime
                            color={timeStats.isDelayed ? "error" : "success"}
                            fontSize="small"
                          />
                          <Typography color="text.secondary" variant="body2">
                            {timeStats.isDelayed
                              ? "Overdue By"
                              : "Remaining Time"}
                          </Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={600}>
                          {timeStats.remainingTime} mins
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <CheckCircle
                            color={timeStats.isDelayed ? "error" : "success"}
                            fontSize="small"
                          />
                          <Typography color="text.secondary" variant="body2">
                            Status
                          </Typography>
                        </Box>
                        {timeStats.isDelayed ? (
                          <MuiChip
                            label="DELAYED"
                            size="small"
                            color="error"
                            sx={{ fontWeight: 600 }}
                          />
                        ) : (
                          <MuiChip
                            label="ON TIME"
                            size="small"
                            color="success"
                            sx={{ fontWeight: 600 }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Progress */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2">Overall Progress</Typography>
                <Typography variant="body2">{task.progress || 0}%</Typography>
              </Box>
              <Progress value={task.progress || 0} />
            </Box>

            {/* Subtasks */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Subtasks
              </Typography>
              <SubtasksList
                subtasks={task.subTasks || []}
                onToggle={handleSubtaskToggle}
                disabled={task.status === "COMPLETED"}
              />
            </Box>

            {/* Images Section */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography variant="h6">
                  Images ({task.taskImages?.length || 0})
                </Typography>
                {task.status !== "COMPLETED" && (
                  <Button
                    onClick={() => setUploadModalOpen(true)}
                    disabled={isUploading}
                    size="small"
                  >
                    <Upload sx={{ fontSize: "1rem", mr: 0.5 }} />
                    Upload Image
                  </Button>
                )}
              </Box>

              {task.taskImages && task.taskImages.length > 0 ? (
                <ImageList cols={3} gap={12}>
                  {task.taskImages.map((image) => (
                    <ImageListItem key={image.id}>
                      <img
                        src={image.imageUrl}
                        alt={image.description || "Task image"}
                        loading="lazy"
                        style={{
                          height: 200,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                      <ImageListItemBar
                        title={image.description || "No description"}
                        subtitle={new Date(image.createdAt).toLocaleString()}
                        actionIcon={
                          task.status !== "COMPLETED" && (
                            <IconButton
                              sx={{ color: "rgba(255, 255, 255, 0.9)" }}
                              onClick={() => handleRemoveImage(image)}
                            >
                              <Delete />
                            </IconButton>
                          )
                        }
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              ) : (
                <Box
                  sx={{
                    p: 4,
                    textAlign: "center",
                    border: "1px dashed",
                    borderColor: "divider",
                    borderRadius: 1,
                  }}
                >
                  <Typography color="text.secondary">
                    No images uploaded yet
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Notes Section */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Notes ({task.taskNotes?.length || 0})
              </Typography>

              {/* Add Note Form */}
              {task.status !== "COMPLETED" && (
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <textarea
                    placeholder="Add a note..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                      fontFamily: "inherit",
                      fontSize: "14px",
                      resize: "vertical",
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mt: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <input
                        type="checkbox"
                        id="noteVisibility"
                        checked={noteVisibility}
                        onChange={(e) => setNoteVisibility(e.target.checked)}
                      />
                      <label
                        htmlFor="noteVisibility"
                        style={{ fontSize: "14px" }}
                      >
                        Visible to customer
                      </label>
                    </Box>
                    <Button onClick={handleNoteSubmit} size="small">
                      Add Note
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Notes List */}
              {task.taskNotes && task.taskNotes.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {task.taskNotes.map((note) => (
                    <Card key={note.id} variant="outlined">
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "start",
                            mb: 1,
                          }}
                        >
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {note.authorName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {new Date(note.createdAt).toLocaleString()}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <MuiChip
                              label={note.noteType}
                              size="small"
                              variant="outlined"
                            />
                            {task.status !== "COMPLETED" && (
                              <IconButton
                                size="small"
                                onClick={() => handleRemoveNote(note.id)}
                                color="error"
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                        </Box>
                        <Typography variant="body2">{note.content}</Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Box
                  sx={{
                    p: 4,
                    textAlign: "center",
                    border: "1px dashed",
                    borderColor: "divider",
                    borderRadius: 1,
                  }}
                >
                  <Typography color="text.secondary">
                    No notes added yet
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        <TaskImageUploadModal
          open={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onConfirm={handleImageUpload}
          taskId={taskId}
          isUploading={isUploading}
        />
      </Box>
    </EmployeeLayout>
  );
}

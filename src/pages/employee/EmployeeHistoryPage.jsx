import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Box,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip as MuiChip,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import { ExpandMore, AccessTime, CheckCircle } from "@mui/icons-material";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { SubtasksList } from "../../components/employee/SubtasksList";
import EmployeeLayout from "../../layouts/employee/EmployeeLayout";
import { authenticatedAxios } from "../../utils/axiosConfig";
import { API_BASE } from "../../config/apiEndpoints";
import { getCurrentUser } from "../../utils/jwtUtils";

const EmployeeHistoryPage = () => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        setLoading(true);
        const user = getCurrentUser();
        if (!user) {
          console.error("No authenticated user found");
          setError("No authenticated user found");
          setLoading(false);
          return;
        }

        // Fetch all tasks for the employee
        const response = await authenticatedAxios.get(
          `${API_BASE}/api/tasks/employee/${user.id}`
        );
        const allTasks = response.data;
        const completed = allTasks.filter(
          (task) => task.status === "COMPLETED"
        );

        // Fetch full details for each completed task
        const detailedTasks = await Promise.all(
          completed.map(async (task) => {
            try {
              const detailResponse = await authenticatedAxios.get(
                `${API_BASE}/api/tasks/${task.id}`
              );
              return detailResponse.data;
            } catch (err) {
              console.error(
                `Failed to fetch details for task ${task.id}:`,
                err
              );
              return task; // Return basic info if detail fetch fails
            }
          })
        );

        setCompletedTasks(detailedTasks);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching completed tasks:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCompletedTasks();
  }, []);

  const calculateTimeStats = (task) => {
    if (!task) return null;

    const estimatedMinutes = task.estimatedTimeMinutes || 0;
    const scheduledTime = new Date(task.startTime);
    const currentTime = new Date();

    let currentDuration = 0;
    if (task.status === "IN_PROGRESS" && task.startTime) {
      currentDuration = Math.floor((currentTime - scheduledTime) / (1000 * 60));
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
          <CircularProgress size={48} />
        </Box>
      </EmployeeLayout>
    );
  }

  if (error) {
    return (
      <EmployeeLayout>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" color="error">
            Error: {error}
          </Typography>
        </Box>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Service History
        </Typography>

        {completedTasks.length === 0 ? (
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="body1">No completed tasks found.</Typography>
          </Paper>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {completedTasks.map((task) => {
              const timeStats = calculateTimeStats(task);
              const customerName =
                task.customerName ||
                (task.description
                  ? task.description.split("customer: ")[1]
                  : "Unknown") ||
                "Unknown";

              return (
                <Accordion key={task.id} sx={{ borderRadius: 2, boxShadow: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        width: "100%",
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {task.vehicle || "N/A"} - {task.title}
                      </Typography>
                      <MuiChip
                        label="Completed"
                        size="small"
                        color="success"
                        sx={{ fontWeight: "bold" }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: "auto" }}
                      >
                        {task.completedTime
                          ? new Date(task.completedTime).toLocaleDateString()
                          : "N/A"}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
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
                            theme.palette.mode === "dark"
                              ? "text.primary"
                              : "white",
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
                                  fontWeight: "bold",
                                  borderRadius: "4px",
                                  backgroundColor: "#22c55e",
                                  color: "white",
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
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 3,
                        }}
                      >
                        {/* Basic Info */}
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={4}>
                            <Typography color="text.secondary">
                              Customer
                            </Typography>
                            <Typography fontWeight={500}>
                              {customerName}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography color="text.secondary">
                              Service ID
                            </Typography>
                            <Typography fontWeight={500}>
                              {task.serviceId}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography color="text.secondary">
                              Assigned To
                            </Typography>
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
                                      <AccessTime
                                        color="primary"
                                        fontSize="small"
                                      />
                                      <Typography
                                        color="text.secondary"
                                        variant="body2"
                                      >
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
                                      <AccessTime
                                        color="info"
                                        fontSize="small"
                                      />
                                      <Typography
                                        color="text.secondary"
                                        variant="body2"
                                      >
                                        Actual Duration
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
                                      <CheckCircle
                                        color={
                                          timeStats.isDelayed
                                            ? "error"
                                            : "success"
                                        }
                                        fontSize="small"
                                      />
                                      <Typography
                                        color="text.secondary"
                                        variant="body2"
                                      >
                                        Status
                                      </Typography>
                                    </Box>
                                    {timeStats.isDelayed ? (
                                      <MuiChip
                                        label="DELAYED"
                                        size="small"
                                        color="error"
                                        sx={{ fontWeight: "bold" }}
                                      />
                                    ) : (
                                      <MuiChip
                                        label="ON TIME"
                                        size="small"
                                        color="success"
                                        sx={{ fontWeight: "bold" }}
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
                            <Typography variant="body2">
                              Overall Progress
                            </Typography>
                            <Typography variant="body2">
                              {task.progress || 100}%
                            </Typography>
                          </Box>
                          <Progress value={task.progress || 100} />
                        </Box>

                        {/* Subtasks */}
                        <Box>
                          <Typography variant="h6" sx={{ mb: 2 }}>
                            Subtasks
                          </Typography>
                          <SubtasksList
                            subtasks={task.subTasks || []}
                            onToggle={() => {}} // Read-only
                            disabled={true}
                          />
                        </Box>

                        {/* Images Section */}
                        <Box>
                          <Typography variant="h6" sx={{ mb: 2 }}>
                            Images ({task.taskImages?.length || 0})
                          </Typography>

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
                                    title={
                                      image.description || "No description"
                                    }
                                    subtitle={new Date(
                                      image.createdAt
                                    ).toLocaleString()}
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
                                No images uploaded for this task
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Notes Section */}
                        <Box>
                          <Typography variant="h6" sx={{ mb: 2 }}>
                            Notes ({task.taskNotes?.length || 0})
                          </Typography>

                          {task.taskNotes && task.taskNotes.length > 0 ? (
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                              }}
                            >
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
                                        <Typography
                                          variant="body2"
                                          fontWeight={600}
                                        >
                                          {note.authorName}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                        >
                                          {new Date(
                                            note.createdAt
                                          ).toLocaleString()}
                                        </Typography>
                                      </Box>
                                      <MuiChip
                                        label={note.noteType}
                                        size="small"
                                        variant="outlined"
                                      />
                                    </Box>
                                    <Typography variant="body2">
                                      {note.content}
                                    </Typography>
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
                                No notes for this task
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        )}
      </Box>
    </EmployeeLayout>
  );
};

export default EmployeeHistoryPage;

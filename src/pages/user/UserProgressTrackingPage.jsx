import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Box,
  CircularProgress,
  Stack,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import UserLayout from "../../layouts/user/UserLayout";
import UserProgressTaskCard from "../../components/dashboard/user/UserProgressTaskCard";
import { getUserProgressTrackingTasks } from "../../services/userProgressTrackingService";
import { useAuth } from "../../contexts/AuthContext";

const UserProgressTrackingPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0); // 0 for In Progress, 1 for Completed

  // Get the authenticated user from AuthContext
  const { user } = useAuth();

  useEffect(() => {
    const fetchProgressData = async () => {
      if (!user || !user.id) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);

        const data = await getUserProgressTrackingTasks(user.id);

        setTasks(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching progress data:", err);
        setError(err.message || "Failed to load progress tracking data");
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [user]); // Re-fetch when user changes

  // Filter tasks based on active tab
  const getFilteredTasks = () => {
    if (activeTab === 0) {
      // In Progress tab
      return tasks.filter((task) => task.status === "IN_PROGRESS");
    } else {
      // Completed tab
      return tasks.filter((task) => task.status === "COMPLETED");
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      );
    }

    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {
      const tabName = activeTab === 0 ? "in progress" : "completed";
      return (
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="body1">No {tabName} services found.</Typography>
        </Paper>
      );
    }

    return (
      <Stack spacing={3}>
        {filteredTasks.map((task) => (
          <UserProgressTaskCard key={task.id} task={task} />
        ))}
      </Stack>
    );
  };

  return (
    <UserLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 0, fontWeight: 600 }}>
          Progress Tracking
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          Track the progress of your ongoing services
        </Typography>

        {/* Tabs for filtering */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 500,
                fontSize: "1rem",
                minHeight: 48,
              },
            }}
          >
            <Tab
              label={`In Progress (${
                tasks.filter((task) => task.status === "IN_PROGRESS").length
              })`}
            />
            <Tab
              label={`Completed (${
                tasks.filter((task) => task.status === "COMPLETED").length
              })`}
            />
          </Tabs>
        </Box>

        {renderContent()}
      </Box>
    </UserLayout>
  );
};

export default UserProgressTrackingPage;

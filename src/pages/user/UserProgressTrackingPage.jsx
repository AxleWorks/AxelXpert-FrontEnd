import React, { useState, useEffect } from "react";
import { Typography, 
         Paper, 
         Box, 
         CircularProgress, 
         Stack,
         Alert 
         } from "@mui/material";
import UserLayout from "../../layouts/user/UserLayout";
import UserProgressTaskCard from "../../components/dashboard/user/UserProgressTaskCard";
import { getProgressTrackingTasks } from "../../services/progressTrackingService";
import { useAuth } from "../../contexts/AuthContext";

const UserProgressTrackingPage = () => {

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get the authenticated user from AuthContext
  const { user } = useAuth();

  useEffect (() => {
    const fetchProgressData = async () => {
      if (!user || !user.id) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        
        const data = await getProgressTrackingTasks(user.id);
        
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


  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
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

    if (tasks.length === 0) {
      return (
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="body1">
            No active service found.
          </Typography>
        </Paper>
      );
    }

    return (
      <Stack spacing={3}>
        {tasks.map((task) => (
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
        {renderContent()}
      </Box>
    </UserLayout>
  );
};

export default UserProgressTrackingPage;

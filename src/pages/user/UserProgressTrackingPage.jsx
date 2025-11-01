import React, { useState, useEffect } from "react";
import { Typography, 
         Paper, 
         Box, 
         CircularProgress, 
         Stack 
         } from "@mui/material";
import UserLayout from "../../layouts/user/UserLayout";
import UserProgressTaskCard from "../../components/dashboard/user/UserProgressTaskCard";

const UserProgressTrackingPage = () => {

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect (() => {
    fetch('/mock/progress.json')
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching progress data:", error);
        setLoading(false);
      });
  }, []);


  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
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

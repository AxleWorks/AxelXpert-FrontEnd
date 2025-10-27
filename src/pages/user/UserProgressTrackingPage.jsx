import React, { useState, useEffect } from "react";
import { Typography, Paper, Box, CircularProgress} from "@mui/material";
import UserLayout from "../../layouts/user/UserLayout";

const UserProgressTrackingPage = () => {

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect (() => {
    fetch('/mock/progress.json')
      .then((res) => res.json())
      .then((data) => {
        setTask(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching progress data:", error);
        setLoading(false);
      });
  }, []);

  const renderContent = () => {
    if (loading) {
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    }

    if (!task) {
      return (
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="body1">
            No active service found.
          </Typography>
        </Paper>
      );
    }

    return (
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="body1">
          Service progress for: {task.title}
        </Typography>
      </Paper>
    );
  };

  return (
    <UserLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Progress Tracking
        </Typography>
        {renderContent()}
      </Box>
    </UserLayout>
  );
};

export default UserProgressTrackingPage;

import React, { useState, useEffect } from "react";
import { Typography, Paper, Box, CircularProgress, Chip, LinearProgress} from "@mui/material";
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
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


  const calculateProgress = (subTasks) => {
    if (!subTasks || subTasks.length === 0) return 0;

    const completedTasks = subTasks.filter(t => t.status === 'COMPLETED').length;
    return Math.round((completedTasks / subTasks.length) * 100);
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'IN_PROGRESS':
        return 'primary';
      case 'NOT_STARTED':
      default:
        return 'default';
    }
  }

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

    const progressPercentage = calculateProgress(task.subTasks);

    return (
      <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>

      <Box sx = {{ display: 'flex', alignItems: 'center', gap: 2,  mb: 2 }}>
      <DirectionsCarIcon color="primary" sx={{ fontSize: 40 }} />
      <Box sx = {{ flexGrow: 1 }}>
      <Typography fontSize="15px" component="div" fontWeight="600">
      {task.vehicle} - {task.title}
      </Typography>
      <Typography color="text.secondary" variant="body2">
      Started: {new Date(task.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
      {task.durationMinutes && ` • ETA: ${new Date(new Date(task.startTime).getTime() + task.durationMinutes * 60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
      </Typography>
      </Box>
      <Chip
      label = {task.status.replace('_', ' ')}
      color = {getStatusColor(task.status)}
      sx = {{ 
        fontWeight: 500, 
        fontSize: '10px', 
        height: 25}}
      />
      </Box>

      <Box sx={{ mb: 3}}>
      <Box sx = {{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
      <Typography variant="body2" color="text.secondary">Progress</Typography>
      <Typography variant="body2" color="text.secondary">{progressPercentage}%</Typography>
      </Box>
      <LinearProgress 
      variant="determinate"
      value={progressPercentage}
      sx={{ height: 10, borderRadius: 5 }}
      />
      </Box>
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

import React, { useState, useEffect } from "react";
import { Typography, 
         Paper, 
         Box, 
         CircularProgress, 
         Chip, 
         LinearProgress,
         Collapse,
         List,
         ListItem,
         ListItemText,
         IconButton } from "@mui/material";
import { DirectionsCar as DirectionsCarIcon,
         ExpandMore as ExpandMoreIcon, 
         ExpandLess as ExpandLessIcon,
         CheckCircle as CheckCircleIcon,
         Schedule as ScheduleIcon,
         RadioButtonUnchecked as NotStartedIcon } from '@mui/icons-material';
import UserLayout from "../../layouts/user/UserLayout";

const UserProgressTrackingPage = () => {

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

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

      {/* Clickable Header Section */}
      <ListItem
        onClick={() => setOpen(!open)}
        sx={{ cursor: 'pointer', pl: 0, pr: 0, pb: 2, alignItems: 'flex-start' }}>
        
        <DirectionsCarIcon color="primary" sx={{ fontSize: 40, mr: 2, mt: 0.5 }} />
        
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: -0.5 }}>
            <Typography variant="subtitle1" component="div" fontWeight="600">
              {task.vehicle} - {task.title}
            </Typography>
            <IconButton size="small" aria-label={open ? 'collapse' : 'expand'}>
              {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          
          <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
            Started: {new Date(task.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            {task.durationMinutes && ` • ETA: ${new Date(new Date(task.startTime).getTime() + task.durationMinutes * 60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
          </Typography>

          {/* Progress Bar */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">Progress</Typography>
              <Typography variant="body2" color="text.primary">{progressPercentage}%</Typography>
            </Box>
            <LinearProgress 
              variant="determinate"
              value={progressPercentage}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
        </Box>

        {/* Status Chip and Expand Icon */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, ml: 2 }}>
          <Chip
            label={task.status.replace('_', ' ')}
            color={getStatusColor(task.status)}
            sx={{ 
              fontWeight: 500, 
              fontSize: '10px', 
              height: 25
            }}
          />
        </Box>
      </ListItem>

      {/* Collapsible Sub-Task List */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ pt: 1, pb: 1, borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="subtitle1" fontWeight="500" sx={{ mb: 1 }}>
            Tasks Progress
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sub-Task list will be displayed here.
          </Typography>
        </Box>
      </Collapse>

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

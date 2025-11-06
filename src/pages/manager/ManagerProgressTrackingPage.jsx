import React, { useState, useEffect } from "react";
import { Typography, 
         Paper, 
         Box, 
         CircularProgress, 
         Stack,
         Alert,
         Chip
         } from "@mui/material";
import { CheckCircle as CheckCircleIcon,
         Schedule as ScheduleIcon,
         RadioButtonUnchecked as NotStartedIcon,
         TrendingUp as TrendingUpIcon
         } from '@mui/icons-material';
import UserLayout from "../../layouts/user/UserLayout";
import ManagerProgressTaskCard from "../../components/dashboard/manager/ManagerProgressTaskCard";
import { getProgressTrackingTasks } from "../../services/progressTrackingService";
import { useAuth } from "../../contexts/AuthContext";

const ManagerProgressTrackingPage = () => {

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

  // Helper to calculate progress percentage of a task based on subtasks
  const calculateProgress = (subTasks) => {
    if (!subTasks || subTasks.length === 0) return 0;
    const completedTasks = subTasks.filter(t => t.status === 'COMPLETED').length;
    return Math.round((completedTasks / subTasks.length) * 100);
  };

  const activeJobs = (tasks = []) => {
    if (!Array.isArray(tasks)) return 0;
    return tasks.reduce((acc, t) => acc + (t && t.status === 'IN_PROGRESS' ? 1 : 0), 0);
  };

  const completedToday = (tasks = []) => {
    if (!Array.isArray(tasks)) return 0;
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    return tasks.reduce((acc, t) => {
      if (t && t.status === 'COMPLETED' && t.completedTime) {
        const taskDate = new Date(t.completedTime).toISOString().split('T')[0];
        return acc + (taskDate === today ? 1 : 0);
      }
      return acc;
    }, 0);
  };

  const overdueTasks = (tasks = []) => {
    if (!Array.isArray(tasks)) return 0;
    return tasks.reduce((acc, t) => acc + (t && t.status === 'NOT_STARTED' ? 1 : 0), 0);
  };

  const avgProgress = (tasks = []) => {
    if (!Array.isArray(tasks)) return 0;
    const inProgressTasks = tasks.filter(t => t && t.status === 'IN_PROGRESS');
    if (inProgressTasks.length === 0) return 0;
    
    const totalProgress = inProgressTasks.reduce((acc, task) => {
      return acc + calculateProgress(task.subTasks);
    }, 0);
    
    return Math.round(totalProgress / inProgressTasks.length);
  };

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
            No active services found.
          </Typography>
        </Paper>
      );
    }

    return (
      <Stack spacing={1}>
        {tasks.map((task) => (
          <ManagerProgressTaskCard key={task.id} task={task} />
        ))}
      </Stack>
    );
  };

  return (
    <UserLayout>
      <Box sx={{ width: '100%', maxWidth: '100vw', overflow: 'hidden' }}>
        <Typography variant="h4" sx={{ mb: 0, fontWeight: 600 }}>
          Branch Progress Tracking
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          Monitor ongoing services and team performance
        </Typography>

        {/* General Overview Section */}
        <Box sx={{ mb: 3, width: '100%', maxWidth: '100%', overflow: 'hidden', position: 'relative' }}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
              gap: 2, width: '100%', maxWidth: '100%', boxSizing: 'border-box'
            }}>

              <Box sx={{ bgcolor: 'action.selected', display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, borderRadius: 3, minWidth: 0, maxWidth: '100%', gap: 0.5}}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={500} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Active Jobs
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {activeJobs(tasks)}
                  </Typography>
                </Box>
                <Chip
                  label={<ScheduleIcon />}
                  color="primary"
                  size="small"
                  sx={{ height: 40, width: 40, flexShrink: 0, '& .MuiChip-label': { px: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'} }}/>
              </Box>

              <Box sx={{ bgcolor: 'action.selected', display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, borderRadius: 3, minWidth: 0, maxWidth: '100%', gap: 0.5}}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={500} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Completed Today
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {completedToday(tasks)}
                  </Typography>
                </Box>
                <Chip
                  label={<CheckCircleIcon />}
                  color="success"
                  size="small"
                  sx={{ height: 40, width: 40, flexShrink: 0, '& .MuiChip-label': { px: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'} }}/>

              </Box>

              <Box sx={{ bgcolor: 'action.selected', display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, borderRadius: 3, minWidth: 0, maxWidth: '100%', gap: 0.5}}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={500} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Overdue
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {overdueTasks(tasks)}
                  </Typography>
                </Box>
                <Chip
                  label={<NotStartedIcon />}
                  color="error"
                  size="small"
                  sx={{ height: 40, width: 40, flexShrink: 0, '& .MuiChip-label': { px: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'} }}/>
              </Box>

              <Box sx={{ bgcolor: 'action.selected', display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, borderRadius: 3, minWidth: 0, maxWidth: '100%', gap: 0.5}}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={500} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Avg Progress
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {avgProgress(tasks)}%
                  </Typography>
                </Box>
                <Chip
                  label={<TrendingUpIcon />}
                  color="primary"
                  size="small"
                  sx={{ height: 40, width: 40, flexShrink: 0, '& .MuiChip-label': { px: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'} }}/>

              </Box>
            </Box>
        </Box>

        {/* Ongoing Services Section */}
        <Box sx={{ bgcolor: 'action.selected', p: 1, borderRadius: 2 }}>
          <Typography variant="subtitle1" sx={{ m: 2, fontWeight: 500 }}>
            Ongoing Services
          </Typography>
          {/* Scrollable container for header and rows together */}
          <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ minWidth: 'max-content' }}>
              {/* Header Row */}
              <Box sx={{ display: 'flex', px: 2, mb: 1, fontWeight: 500, color: 'text.secondary', gap: 2 }}>
                <Box sx={{ flex: '0 0 13%', display: 'flex', justifyContent: 'center' }}>Service ID</Box>
                <Box sx={{ flex: '0 0 13%', display: 'flex', justifyContent: 'center' }}>Vehicle</Box>
                <Box sx={{ flex: '0 0 13%', display: 'flex', justifyContent: 'center' }}>Customer</Box>
                <Box sx={{ flex: '0 0 13%', display: 'flex', justifyContent: 'center' }}>Employee</Box>
                <Box sx={{ flex: '0 0 13%', display: 'flex', justifyContent: 'center' }}>Progress</Box>
                <Box sx={{ flex: '0 0 13%', display: 'flex', justifyContent: 'center' }}>ETA</Box>
                <Box sx={{ flex: '0 0 13%', display: 'flex', justifyContent: 'center' }}>Status</Box>
              </Box>
              {renderContent()}
            </Box>
          </Box>
        </Box>
      </Box>
    </UserLayout>
  );
};

export default ManagerProgressTrackingPage;

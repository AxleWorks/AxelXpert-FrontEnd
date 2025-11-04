import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  Avatar,
  Container,
  Card,
  Button,
  IconButton,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  DirectionsCar as DirectionsCarIcon,
  Build as BuildIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  ArrowForward as ArrowForwardIcon,
  Timer as TimerIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  PauseCircle as PauseIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import StatCard from "../cards/StatCard";
import StatModal from "../cards/StatModal";
import dashboardService from "../../../services/dashboardService";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const EmployeeDashboard = () => {
  const [selectedStat, setSelectedStat] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [dailyProductivity, setDailyProductivity] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, productivity, services, tasks, activity] =
        await Promise.all([
          dashboardService.getEmployeeStats(),
          dashboardService.getEmployeeProductivity(),
          dashboardService.getEmployeeServiceTypes(),
          dashboardService.getEmployeeTasks(),
          dashboardService.getEmployeeActivity(),
        ]);

      setStats(statsData);
      setDailyProductivity(Array.isArray(productivity) ? productivity : []);
      setServiceTypes(Array.isArray(services) ? services : []);
      setTodayTasks(Array.isArray(tasks) ? tasks : []);
      setRecentActivity(Array.isArray(activity) ? activity : []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(
        "Failed to load dashboard data. Please check your connection and try again."
      );
      // Set empty arrays to prevent map errors
      setStats(null);
      setDailyProductivity([]);
      setServiceTypes([]);
      setTodayTasks([]);
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatClick = (stat) => {
    setSelectedStat(stat);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedStat(null);
  };

  const statsConfig = stats
    ? [
        {
          title: "Assigned Vehicles",
          value: stats.vehicles?.value || "0",
          icon: <DirectionsCarIcon />,
          color: "#3b82f6",
          trend: stats.vehicles?.trend || "",
          details: stats.vehicles?.details || [],
        },
        {
          title: "Services Today",
          value: stats.services?.value || "0",
          icon: <BuildIcon />,
          color: "#10b981",
          trend: stats.services?.trend || "",
          details: stats.services?.details || [],
        },
        {
          title: "Work Hours",
          value: stats.workHours?.value || "0",
          icon: <TimerIcon />,
          color: "#f59e0b",
          trend: stats.workHours?.trend || "",
          details: stats.workHours?.details || [],
        },
        {
          title: "Completion Rate",
          value: stats.completionRate?.value || "0%",
          icon: <CheckCircleIcon />,
          color: "#8b5cf6",
          trend: stats.completionRate?.trend || "",
          details: stats.completionRate?.details || [],
        },
        {
          title: "Upcoming Tasks",
          value: stats.upcomingTasks?.value || "0",
          icon: <ScheduleIcon />,
          color: "#ef4444",
          trend: stats.upcomingTasks?.trend || "",
          details: stats.upcomingTasks?.details || [],
        },
      ]
    : [];

  const quickActions = [
    {
      title: "Start Work",
      icon: <PlayArrowIcon />,
      color: "#10b981",
      description: "Begin next task",
      action: () => navigate("/employee/tasks"),
    },
    {
      title: "View Tasks",
      icon: <AssignmentIcon />,
      color: "#3b82f6",
      description: "My assignments",
      action: () => navigate("/employee/tasks"),
    },
    {
      title: "Take Break",
      icon: <PauseIcon />,
      color: "#f59e0b",
      description: "Log break time",
      action: () => {},
    },
    {
      title: "Report Issue",
      icon: <NotificationsIcon />,
      color: "#ef4444",
      description: "Technical support",
      action: () => {},
    },
  ];

  const getProgressColor = (progress) => {
    if (progress === 100) return "success";
    if (progress >= 75) return "info";
    if (progress >= 50) return "primary";
    if (progress > 0) return "warning";
    return "default";
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "error";
      case "Normal":
        return "primary";
      case "Low":
        return "success";
      default:
        return "default";
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "completed":
        return <CheckCircleIcon sx={{ color: "#10b981" }} />;
      case "started":
        return <BuildIcon sx={{ color: "#3b82f6" }} />;
      case "updated":
        return <TrendingUpIcon sx={{ color: "#f59e0b" }} />;
      case "assigned":
        return <AssignmentIcon sx={{ color: "#8b5cf6" }} />;
      default:
        return <NotificationsIcon sx={{ color: "#64748b" }} />;
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="xl"
        sx={{
          py: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} thickness={4} />
          <Typography
            variant="h6"
            sx={{ mt: 2, color: theme.palette.text.secondary }}
          >
            Loading your workspace...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {error && (
        <Alert
          severity="warning"
          sx={{ mb: 3 }}
          action={
            <IconButton
              aria-label="refresh"
              color="inherit"
              size="small"
              onClick={fetchDashboardData}
            >
              <RefreshIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}

      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: theme.palette.text.primary,
            mb: 1,
            fontSize: { xs: "2rem", md: "2.5rem" },
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Good Morning!
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "1.1rem",
            fontWeight: 400,
            mb: 2,
          }}
        >
          Let's make today productive! Here's your work overview
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Chip
            icon={<TimerIcon />}
            label={`${
              stats?.upcomingTasks?.value || "0"
            } Tasks Scheduled Today`}
            color="warning"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            label="Next: Honda Civic at 11:00 AM"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsConfig.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, lg: 2.4 }} key={index}>
            <StatCard {...stat} onClick={() => handleStatClick(stat)} />
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Daily Productivity */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              p: 3,
              height: "100%",
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 3, color: theme.palette.text.primary }}
            >
              Today's Productivity & Efficiency
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyProductivity}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme.palette.divider}
                />
                <XAxis
                  dataKey="hour"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: "8px",
                    boxShadow: isDark
                      ? "0 4px 6px -1px rgba(0, 0, 0, 0.3)"
                      : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    color: theme.palette.text.primary,
                  }}
                />
                <Legend />
                <Bar
                  dataKey="services"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  name="Services Completed"
                />
                <Bar
                  dataKey="efficiency"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="Efficiency (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Service Distribution */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              p: 3,
              height: "100%",
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 3, color: theme.palette.text.primary }}
            >
              My Service Types
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {Array.isArray(serviceTypes) &&
                    serviceTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            p: 3,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, mb: 3, color: theme.palette.text.primary }}
          >
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            {quickActions.map((action, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Card
                  elevation={0}
                  onClick={action.action}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #f1f5f9",
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px -8px rgba(0, 0, 0, 0.1)",
                      borderColor: action.color,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      sx={{
                        backgroundColor: `${action.color}15`,
                        color: action.color,
                        width: 48,
                        height: 48,
                      }}
                    >
                      {action.icon}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {action.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        {action.description}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Card>
      </Box>

      {/* Bottom Section */}
      <Grid container spacing={3}>
        {/* Today's Tasks */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              p: 3,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: theme.palette.text.primary }}
              >
                Today's Schedule
              </Typography>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                sx={{ textTransform: "none" }}
                onClick={() => navigate("/employee/tasks")}
              >
                View All
              </Button>
            </Box>
            <List>
              {Array.isArray(todayTasks) &&
                todayTasks.map((task) => (
                  <ListItem
                    key={task.id}
                    sx={{
                      mb: 2,
                      bgcolor: isDark
                        ? theme.palette.background.default
                        : "#f8fafc",
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Box sx={{ width: "100%" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {task.vehicle}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Customer: {task.customer}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Chip
                            label={task.time}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            label={task.priority}
                            size="small"
                            color={getPriorityColor(task.priority)}
                          />
                        </Box>
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Service: {task.service}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <LinearProgress
                          variant="determinate"
                          value={task.progress}
                          color={getProgressColor(task.progress)}
                          sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ minWidth: 45 }}
                        >
                          {task.progress}%
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>
                ))}
            </List>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              p: 3,
              height: "100%",
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 3, fontWeight: 700, color: theme.palette.text.primary }}
            >
              Recent Activity
            </Typography>
            <List>
              {Array.isArray(recentActivity) &&
                recentActivity.map((activity, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      mb: 2,
                      bgcolor: isDark
                        ? theme.palette.background.default
                        : "#f0f9ff",
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{ width: 36, height: 36, bgcolor: "transparent" }}
                      >
                        {getActivityIcon(activity.type)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.9rem", fontWeight: 500 }}
                        >
                          {activity.action}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {activity.time}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
            </List>
          </Card>
        </Grid>
      </Grid>

      <StatModal
        open={modalOpen}
        onClose={handleCloseModal}
        stat={selectedStat}
      />
    </Container>
  );
};

export default EmployeeDashboard;

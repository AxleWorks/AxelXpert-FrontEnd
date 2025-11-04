import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  Avatar,
  Container,
  Button,
  IconButton,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Build as BuildIcon,
  DirectionsCar as DirectionsCarIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarTodayIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon,
  Notifications as NotificationsIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import StatCard from "../cards/StatCard";
import StatModal from "../cards/StatModal";
import dashboardService from "../../../services/dashboardService";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const UserDashboard = () => {
  const [selectedStat, setSelectedStat] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [serviceBreakdown, setServiceBreakdown] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [upcomingServices, setUpcomingServices] = useState([]);

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

      const [statsData, historyData, tasksData, appointmentsData] =
        await Promise.all([
          dashboardService.getUserStats(),
          dashboardService.getUserServiceHistory(),
          dashboardService.getUserRecentTasks(),
          dashboardService.getUserAppointments(),
        ]);

      setStats(statsData);
      setServiceHistory(
        Array.isArray(historyData.chartData) ? historyData.chartData : []
      );
      setServiceBreakdown(
        Array.isArray(historyData.breakdown) ? historyData.breakdown : []
      );
      setRecentTasks(Array.isArray(tasksData) ? tasksData : []);
      setUpcomingServices(
        Array.isArray(appointmentsData) ? appointmentsData : []
      );
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(
        "Failed to load dashboard data. Please check your connection and try again."
      );
      // Set empty arrays to prevent map errors
      setStats(null);
      setServiceHistory([]);
      setServiceBreakdown([]);
      setRecentTasks([]);
      setUpcomingServices([]);
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
          title: "My Vehicles",
          value: stats.vehicles?.value || "0",
          icon: <DirectionsCarIcon />,
          color: "#3b82f6",
          trend: stats.vehicles?.trend || "",
          details: stats.vehicles?.details || [],
        },
        {
          title: "Active Tasks",
          value: stats.activeTasks?.value || "0",
          icon: <AssignmentIcon />,
          color: "#10b981",
          trend: stats.activeTasks?.trend || "",
          details: stats.activeTasks?.details || [],
        },
        {
          title: "Service History",
          value: stats.serviceHistory?.value || "0",
          icon: <BuildIcon />,
          color: "#f59e0b",
          trend: stats.serviceHistory?.trend || "",
          details: stats.serviceHistory?.details || [],
        },
        {
          title: "Pending Appointments",
          value: stats.appointments?.value || "0",
          icon: <CalendarTodayIcon />,
          color: "#8b5cf6",
          trend: stats.appointments?.trend || "",
          details: stats.appointments?.details || [],
        },
      ]
    : [];

  const quickActions = [
    {
      title: "Book Service",
      icon: <CalendarTodayIcon />,
      color: "#10b981",
      description: "Schedule new appointment",
      action: () => navigate("/user/booking-calendar"),
    },
    {
      title: "View Services",
      icon: <BuildIcon />,
      color: "#3b82f6",
      description: "Check services",
      action: () => navigate("/user/services"),
    },
    {
      title: "Add Vehicle",
      icon: <DirectionsCarIcon />,
      color: "#f59e0b",
      description: "Register new vehicle",
      action: () => navigate("/user/vehicles"),
    },
    {
      title: "Track Progress",
      icon: <TrendingUpIcon />,
      color: "#8b5cf6",
      description: "Monitor progress",
      action: () => navigate("/user/progress-tracking"),
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "primary";
      case "Scheduled":
        return "info";
      case "Pending":
        return "warning";
      case "Completed":
        return "success";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "error";
      case "Medium":
        return "warning";
      case "Low":
        return "success";
      default:
        return "default";
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
            Loading your dashboard...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Error Alert */}
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
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome Back!
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
          Here's your automotive service overview
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsConfig.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
            <StatCard {...stat} onClick={() => handleStatClick(stat)} />
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Service History Chart */}
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
              Service History & Costs
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={Array.isArray(serviceHistory) ? serviceHistory : []}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme.palette.divider}
                />
                <XAxis
                  dataKey="month"
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
                <Area
                  type="monotone"
                  dataKey="cost"
                  stroke="#10b981"
                  fill="url(#colorGradient)"
                  strokeWidth={3}
                  name="Cost ($)"
                />
                <Area
                  type="monotone"
                  dataKey="services"
                  stroke="#3b82f6"
                  fill="url(#servicesGradient)"
                  strokeWidth={2}
                  name="Services"
                />
                <Legend />
                <defs>
                  <linearGradient
                    id="colorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient
                    id="servicesGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Service Breakdown Pie Chart */}
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
              Service Breakdown
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Array.isArray(serviceBreakdown) ? serviceBreakdown : []}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {Array.isArray(serviceBreakdown) &&
                    serviceBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
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
        {/* Recent Tasks */}
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
                Recent Tasks
              </Typography>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                component={Link}
                to="/user/progress-tracking"
                sx={{ textTransform: "none" }}
              >
                View All
              </Button>
            </Box>
            <List>
              {Array.isArray(recentTasks) &&
                recentTasks.map((task) => (
                  <ListItem
                    key={task.id}
                    sx={{
                      mb: 1,
                      bgcolor: isDark
                        ? theme.palette.background.default
                        : "#f8fafc",
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{ bgcolor: "#10b981", width: 40, height: 40 }}
                      >
                        <BuildIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            {task.title}
                          </Typography>
                          <Chip
                            label={task.status}
                            size="small"
                            color={getStatusColor(task.status)}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Vehicle: {task.vehicle}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {task.date}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
            </List>
          </Card>
        </Grid>

        {/* Upcoming Services */}
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
                Pending Services
              </Typography>
              <IconButton
                component={Link}
                to="/user/booking-calendar"
                size="small"
                sx={{ bgcolor: "#10b981", color: "white" }}
              >
                <AddIcon />
              </IconButton>
            </Box>
            <List>
              {Array.isArray(upcomingServices) &&
                upcomingServices.map((service, index) => (
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
                        sx={{ bgcolor: "#3b82f6", width: 36, height: 36 }}
                      >
                        <CalendarTodayIcon fontSize="small" />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight={600}>
                          {service.service}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {service.vehicle}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="primary"
                            fontWeight={600}
                          >
                            {service.date} at {service.time}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
            </List>
          </Card>
        </Grid>
      </Grid>

      {/* Stat Modal */}
      <StatModal
        open={modalOpen}
        onClose={handleCloseModal}
        stat={selectedStat}
      />
    </Container>
  );
};

export default UserDashboard;

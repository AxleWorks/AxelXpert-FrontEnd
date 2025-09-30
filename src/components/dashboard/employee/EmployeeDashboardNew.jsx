import React, { useState } from "react";
import {
  Grid,
  Paper,
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
} from "@mui/icons-material";
import StatCard from "../cards/StatCard";
import StatModal from "../cards/StatModal";
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
} from "recharts";

const EmployeeDashboard = () => {
  const [selectedStat, setSelectedStat] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleStatClick = (stat) => {
    setSelectedStat(stat);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedStat(null);
  };

  const stats = [
    {
      title: "Assigned Vehicles",
      value: "12",
      icon: <DirectionsCarIcon />,
      color: "#3b82f6",
      trend: "+3 this week",
      details: [
        { label: "In Service", value: "5" },
        { label: "Pending", value: "4" },
        { label: "Completed", value: "3" },
        { label: "This Month", value: "38" },
      ],
    },
    {
      title: "Services Today",
      value: "8",
      icon: <BuildIcon />,
      color: "#10b981",
      trend: "6 completed",
      details: [
        { label: "Oil Changes", value: "3" },
        { label: "Brake Services", value: "2" },
        { label: "Inspections", value: "2" },
        { label: "Other", value: "1" },
      ],
    },
    {
      title: "Work Hours",
      value: "7.5",
      icon: <TimerIcon />,
      color: "#f59e0b",
      trend: "Today",
      details: [
        { label: "Today", value: "7.5h" },
        { label: "This Week", value: "38h" },
        { label: "Overtime", value: "3h" },
        { label: "Efficiency", value: "94%" },
      ],
    },
    {
      title: "Completion Rate",
      value: "94%",
      icon: <CheckCircleIcon />,
      color: "#8b5cf6",
      trend: "+2% this week",
      details: [
        { label: "This Week", value: "94%" },
        { label: "Last Week", value: "92%" },
        { label: "This Month", value: "93%" },
        { label: "Best Month", value: "97%" },
      ],
    },
    {
      title: "Upcoming Tasks",
      value: "6",
      icon: <ScheduleIcon />,
      color: "#ef4444",
      trend: "Next 2 hours",
      details: [
        { label: "Next Hour", value: "2" },
        { label: "Next 2 Hours", value: "4" },
        { label: "Today", value: "6" },
        { label: "Tomorrow", value: "9" },
      ],
    },
  ];

  const dailyProductivity = [
    { hour: "9AM", services: 1, efficiency: 85 },
    { hour: "10AM", services: 2, efficiency: 92 },
    { hour: "11AM", services: 2, efficiency: 88 },
    { hour: "12PM", services: 1, efficiency: 75 },
    { hour: "1PM", services: 0, efficiency: 0 },
    { hour: "2PM", services: 3, efficiency: 95 },
    { hour: "3PM", services: 2, efficiency: 89 },
    { hour: "4PM", services: 1, efficiency: 82 },
  ];

  const serviceTypes = [
    { name: "Oil Changes", value: 35, color: "#10b981" },
    { name: "Brake Service", value: 25, color: "#3b82f6" },
    { name: "Inspections", value: 20, color: "#f59e0b" },
    { name: "Repairs", value: 20, color: "#ef4444" },
  ];

  const todayTasks = [
    {
      id: 1,
      vehicle: "Honda Civic - ABC123",
      service: "Oil Change",
      progress: 85,
      time: "9:00 AM",
      customer: "John Doe",
      priority: "Normal",
    },
    {
      id: 2,
      vehicle: "Toyota Camry - XYZ789",
      service: "Brake Service",
      progress: 45,
      time: "11:00 AM",
      customer: "Jane Smith",
      priority: "High",
    },
    {
      id: 3,
      vehicle: "Ford Focus - DEF456",
      service: "Tire Rotation",
      progress: 0,
      time: "2:00 PM",
      customer: "Mike Johnson",
      priority: "Normal",
    },
    {
      id: 4,
      vehicle: "BMW X5 - GHI012",
      service: "Full Inspection",
      progress: 0,
      time: "3:30 PM",
      customer: "Sarah Wilson",
      priority: "Low",
    },
  ];

  const recentActivity = [
    {
      action: "Completed brake service for Honda Civic",
      time: "10 minutes ago",
      type: "completed",
    },
    {
      action: "Started oil change for Toyota Camry",
      time: "1 hour ago",
      type: "started",
    },
    {
      action: "Updated service progress for Ford Focus",
      time: "2 hours ago",
      type: "updated",
    },
    {
      action: "Received new work assignment",
      time: "3 hours ago",
      type: "assigned",
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

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: "#1e293b",
            mb: 1,
            fontSize: { xs: "2rem", md: "2.5rem" },
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Good Morning! 🔧
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "#64748b",
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
            label="6 Tasks Scheduled Today"
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
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={2.4} key={index}>
            <StatCard {...stat} onClick={() => handleStatClick(stat)} />
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Daily Productivity */}
        <Grid item xs={12} lg={8}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              p: 3,
              height: "100%",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 3, color: "#1e293b" }}
            >
              Today's Productivity
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyProductivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="hour"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="services" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Service Distribution */}
        <Grid item xs={12} lg={4}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              p: 3,
              height: "100%",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 3, color: "#1e293b" }}
            >
              Service Distribution
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
                  {serviceTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Section */}
      <Grid container spacing={3}>
        {/* Today's Tasks */}
        <Grid item xs={12} md={8}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              p: 3,
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
                sx={{ fontWeight: 700, color: "#1e293b" }}
              >
                Today's Schedule
              </Typography>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                sx={{ textTransform: "none" }}
              >
                View All
              </Button>
            </Box>
            <List>
              {todayTasks.map((task) => (
                <ListItem
                  key={task.id}
                  sx={{ mb: 2, bgcolor: "#f8fafc", borderRadius: 2 }}
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
        <Grid item xs={12} md={4}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              p: 3,
              height: "100%",
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 3, fontWeight: 700, color: "#1e293b" }}
            >
              Recent Activity
            </Typography>
            <List>
              {recentActivity.map((activity, index) => (
                <ListItem
                  key={index}
                  sx={{ mb: 2, bgcolor: "#f0f9ff", borderRadius: 2 }}
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

      {/* Stat Modal */}
      <StatModal
        open={modalOpen}
        onClose={handleCloseModal}
        stat={selectedStat}
      />
    </Container>
  );
};

export default EmployeeDashboard;

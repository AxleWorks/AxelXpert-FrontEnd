import React, { useState } from "react";
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
} from "@mui/icons-material";
import StatCard from "../cards/StatCard";
import StatModal from "../cards/StatModal";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const UserDashboard = () => {
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
      title: "My Vehicles",
      value: "3",
      icon: <DirectionsCarIcon />,
      color: "#3b82f6",
      trend: "1 needs service",
      details: [
        { label: "Active Vehicles", value: "3" },
        { label: "Service Due", value: "1" },
        { label: "Recently Serviced", value: "2" },
        { label: "Total Visits", value: "24" },
      ],
    },
    {
      title: "Active Tasks",
      value: "5",
      icon: <AssignmentIcon />,
      color: "#10b981",
      trend: "+2 this week",
      details: [
        { label: "In Progress", value: "2" },
        { label: "Pending", value: "3" },
        { label: "Completed Today", value: "1" },
        { label: "This Month", value: "12" },
      ],
    },
    {
      title: "Service History",
      value: "24",
      icon: <BuildIcon />,
      color: "#f59e0b",
      trend: "+3 this month",
      details: [
        { label: "Oil Changes", value: "8" },
        { label: "Brake Services", value: "4" },
        { label: "Inspections", value: "6" },
        { label: "Other Services", value: "6" },
      ],
    },
    {
      title: "Appointments",
      value: "2",
      icon: <CalendarTodayIcon />,
      color: "#8b5cf6",
      trend: "Next: Tomorrow",
      details: [
        { label: "This Week", value: "2" },
        { label: "This Month", value: "4" },
        { label: "Confirmed", value: "2" },
        { label: "Past Appointments", value: "28" },
      ],
    },
    {
      title: "Satisfaction",
      value: "4.8",
      icon: <StarIcon />,
      color: "#ef4444",
      trend: "Excellent rating",
      details: [
        { label: "Average Rating", value: "4.8/5" },
        { label: "Total Reviews", value: "18" },
        { label: "5-Star Services", value: "15" },
        { label: "Recommendations", value: "12" },
      ],
    },
  ];

  const chartData = [
    { month: "Jan", services: 2, cost: 150 },
    { month: "Feb", services: 1, cost: 80 },
    { month: "Mar", services: 3, cost: 220 },
    { month: "Apr", services: 2, cost: 180 },
    { month: "May", services: 4, cost: 350 },
    { month: "Jun", services: 1, cost: 90 },
  ];

  const serviceBreakdown = [
    { name: "Oil Changes", value: 8, color: "#10b981" },
    { name: "Brake Service", value: 4, color: "#3b82f6" },
    { name: "Inspections", value: 6, color: "#f59e0b" },
    { name: "Other", value: 6, color: "#8b5cf6" },
  ];

  const recentTasks = [
    {
      id: 1,
      title: "Oil Change Service",
      status: "In Progress",
      priority: "High",
      vehicle: "Honda Civic",
      date: "Today",
    },
    {
      id: 2,
      title: "Brake Inspection",
      status: "Scheduled",
      priority: "Medium",
      vehicle: "Toyota Camry",
      date: "Tomorrow",
    },
    {
      id: 3,
      title: "Tire Rotation",
      status: "Pending",
      priority: "Low",
      vehicle: "Ford Focus",
      date: "Next Week",
    },
  ];

  const upcomingServices = [
    {
      service: "Regular Maintenance",
      date: "2025-10-15",
      time: "10:00 AM",
      vehicle: "Honda Civic",
    },
    {
      service: "AC Service",
      date: "2025-10-22",
      time: "2:00 PM",
      vehicle: "Toyota Camry",
    },
    {
      service: "Battery Check",
      date: "2025-11-05",
      time: "11:30 AM",
      vehicle: "Ford Focus",
    },
  ];

  const quickActions = [
    {
      title: "Book Service",
      icon: <CalendarTodayIcon />,
      color: "#10b981",
      description: "Schedule new appointment",
    },
    {
      title: "View History",
      icon: <BuildIcon />,
      color: "#3b82f6",
      description: "Check service records",
    },
    {
      title: "Add Vehicle",
      icon: <DirectionsCarIcon />,
      color: "#f59e0b",
      description: "Register new vehicle",
    },
    {
      title: "Track Service",
      icon: <TrendingUpIcon />,
      color: "#8b5cf6",
      description: "Monitor progress",
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
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome Back! 👋
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
          Here's your automotive service overview
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Chip
            icon={<NotificationsIcon />}
            label="1 Service Due Soon"
            color="warning"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            label="Next Appointment: Tomorrow 10:00 AM"
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
        {/* Service History Chart */}
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
              Service History & Costs
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
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
                <Area
                  type="monotone"
                  dataKey="cost"
                  stroke="#10b981"
                  fill="url(#colorGradient)"
                  strokeWidth={3}
                />
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
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Service Breakdown Pie Chart */}
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
              Service Breakdown
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {serviceBreakdown.map((entry, index) => (
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
            border: "1px solid #e2e8f0",
            p: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, mb: 3, color: "#1e293b" }}
          >
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  elevation={0}
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
                        sx={{ fontWeight: 600, color: "#1e293b" }}
                      >
                        {action.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
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
                Recent Tasks
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
              {recentTasks.map((task) => (
                <ListItem
                  key={task.id}
                  sx={{ mb: 1, bgcolor: "#f8fafc", borderRadius: 2 }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: "#10b981", width: 40, height: 40 }}>
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
                        <Chip
                          label={task.priority}
                          size="small"
                          variant="outlined"
                          color={getPriorityColor(task.priority)}
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
                Upcoming Services
              </Typography>
              <IconButton
                size="small"
                sx={{ bgcolor: "#10b981", color: "white" }}
              >
                <AddIcon />
              </IconButton>
            </Box>
            <List>
              {upcomingServices.map((service, index) => (
                <ListItem
                  key={index}
                  sx={{ mb: 2, bgcolor: "#f0f9ff", borderRadius: 2 }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: "#3b82f6", width: 36, height: 36 }}>
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

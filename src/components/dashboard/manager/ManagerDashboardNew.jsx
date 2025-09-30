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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Container,
  Card,
  Button,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Store as StoreIcon,
  CalendarToday as CalendarTodayIcon,
  Build as BuildIcon,
  AttachMoney as AttachMoneyIcon,
  ArrowForward as ArrowForwardIcon,
  Notifications as NotificationsIcon,
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
  AreaChart,
  Area,
} from "recharts";

const ManagerDashboard = () => {
  const [selectedStat, setSelectedStat] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

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
      title: "Total Revenue",
      value: "$45.2K",
      icon: <AttachMoneyIcon />,
      color: "#10b981",
      trend: "+12.5% this month",
      details: [
        { label: "This Month", value: "$45.2K" },
        { label: "Last Month", value: "$40.1K" },
        { label: "Services", value: "$28.5K" },
        { label: "Parts", value: "$16.7K" },
      ],
    },
    {
      title: "Active Users",
      value: "156",
      icon: <PeopleIcon />,
      color: "#3b82f6",
      trend: "+8 this week",
      details: [
        { label: "Employees", value: "24" },
        { label: "Customers", value: "132" },
        { label: "New This Week", value: "8" },
        { label: "Active Today", value: "45" },
      ],
    },
    {
      title: "Total Bookings",
      value: "89",
      icon: <CalendarTodayIcon />,
      color: "#f59e0b",
      trend: "+15 today",
      details: [
        { label: "Today", value: "15" },
        { label: "This Week", value: "89" },
        { label: "Confirmed", value: "78" },
        { label: "Pending", value: "11" },
      ],
    },
    {
      title: "Service Branches",
      value: "4",
      icon: <StoreIcon />,
      color: "#8b5cf6",
      trend: "All operational",
      details: [
        { label: "Downtown", value: "Active" },
        { label: "Uptown", value: "Active" },
        { label: "Eastside", value: "Active" },
        { label: "Westside", value: "Active" },
      ],
    },
    {
      title: "Performance Score",
      value: "94%",
      icon: <TrendingUpIcon />,
      color: "#ef4444",
      trend: "+2% this month",
      details: [
        { label: "Customer Satisfaction", value: "94%" },
        { label: "Service Quality", value: "92%" },
        { label: "Response Time", value: "96%" },
        { label: "Overall Rating", value: "4.7/5" },
      ],
    },
  ];

  const revenueData = [
    { month: "Jan", revenue: 32000, services: 145, customers: 89 },
    { month: "Feb", revenue: 28000, services: 132, customers: 76 },
    { month: "Mar", revenue: 38000, services: 167, customers: 102 },
    { month: "Apr", revenue: 35000, services: 156, customers: 94 },
    { month: "May", revenue: 42000, services: 189, customers: 118 },
    { month: "Jun", revenue: 45200, services: 201, customers: 132 },
  ];

  const branchPerformance = [
    {
      branch: "Downtown",
      services: 156,
      revenue: 15200,
      efficiency: 94,
      employees: 8,
    },
    {
      branch: "Uptown",
      services: 134,
      revenue: 12800,
      efficiency: 91,
      employees: 6,
    },
    {
      branch: "Eastside",
      services: 98,
      revenue: 9650,
      efficiency: 88,
      employees: 5,
    },
    {
      branch: "Westside",
      services: 87,
      revenue: 7550,
      efficiency: 85,
      employees: 5,
    },
  ];

  const serviceDistribution = [
    { name: "Oil Changes", value: 35, color: "#10b981", count: 145 },
    { name: "Brake Services", value: 25, color: "#3b82f6", count: 104 },
    { name: "Inspections", value: 20, color: "#f59e0b", count: 83 },
    { name: "Repairs", value: 15, color: "#ef4444", count: 62 },
    { name: "Other", value: 5, color: "#8b5cf6", count: 21 },
  ];

  const recentBookings = [
    {
      id: 1,
      customer: "John Doe",
      service: "Oil Change",
      branch: "Downtown",
      status: "Confirmed",
      date: "2025-10-01",
      amount: "$45",
    },
    {
      id: 2,
      customer: "Jane Smith",
      service: "Brake Service",
      branch: "Uptown",
      status: "In Progress",
      date: "2025-10-01",
      amount: "$180",
    },
    {
      id: 3,
      customer: "Mike Johnson",
      service: "Tire Rotation",
      branch: "Eastside",
      status: "Completed",
      date: "2025-09-30",
      amount: "$35",
    },
    {
      id: 4,
      customer: "Sarah Wilson",
      service: "Engine Diagnostic",
      branch: "Westside",
      status: "Scheduled",
      date: "2025-10-02",
      amount: "$120",
    },
    {
      id: 5,
      customer: "Tom Brown",
      service: "AC Service",
      branch: "Downtown",
      status: "Confirmed",
      date: "2025-10-01",
      amount: "$85",
    },
  ];

  const quickActions = [
    {
      title: "Generate Report",
      icon: <AssessmentIcon />,
      color: "#3b82f6",
      description: "Monthly analytics",
    },
    {
      title: "Manage Users",
      icon: <PeopleIcon />,
      color: "#10b981",
      description: "User permissions",
    },
    {
      title: "View Calendar",
      icon: <CalendarTodayIcon />,
      color: "#f59e0b",
      description: "All bookings",
    },
    {
      title: "Branch Overview",
      icon: <StoreIcon />,
      color: "#8b5cf6",
      description: "Performance metrics",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "info";
      case "In Progress":
        return "primary";
      case "Completed":
        return "success";
      case "Scheduled":
        return "warning";
      default:
        return "default";
    }
  };

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 90) return "#10b981";
    if (efficiency >= 80) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: theme.palette.text.primary,
            mb: 1,
            fontSize: { xs: "2rem", md: "2.5rem" },
            background: "linear-gradient(135deg, #e11d48 0%, #be185d 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Management Overview
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
          Monitor business performance and key metrics across all branches
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Chip
            icon={<TrendingUpIcon />}
            label="Revenue +12.5% This Month"
            color="success"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            label="89 Bookings This Week"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            label="All Branches Operational"
            color="info"
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

      {/* Revenue Chart */}
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
            Revenue & Performance Trends
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={revenueData}>
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
                dataKey="revenue"
                stroke="#e11d48"
                fill="url(#revenueGradient)"
                strokeWidth={3}
              />
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e11d48" stopOpacity={0.05} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </Box>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Branch Performance */}
        <Grid item xs={12} lg={8}>
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
              Branch Performance
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={branchPerformance}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme.palette.divider}
                />
                <XAxis
                  dataKey="branch"
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
                <Bar dataKey="services" fill="#e11d48" radius={[4, 4, 0, 0]} />
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
              Service Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {serviceDistribution.map((entry, index) => (
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

      {/* Recent Bookings Table */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
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
                Recent Bookings
              </Typography>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                sx={{ textTransform: "none" }}
              >
                View All Bookings
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Service</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Branch</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentBookings.map((booking) => (
                    <TableRow key={booking.id} hover>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            sx={{ width: 32, height: 32, bgcolor: "#e11d48" }}
                          >
                            {booking.customer.charAt(0)}
                          </Avatar>
                          {booking.customer}
                        </Box>
                      </TableCell>
                      <TableCell>{booking.service}</TableCell>
                      <TableCell>
                        <Chip
                          label={booking.branch}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={booking.status}
                          size="small"
                          color={getStatusColor(booking.status)}
                        />
                      </TableCell>
                      <TableCell>{booking.date}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="success.main"
                        >
                          {booking.amount}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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

export default ManagerDashboard;

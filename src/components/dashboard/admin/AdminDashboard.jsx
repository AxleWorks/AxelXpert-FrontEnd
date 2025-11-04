import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
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
  CircularProgress,
  Alert,
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
  Refresh as RefreshIcon,
  Analytics as AnalyticsIcon,
  Groups as GroupsIcon,
  EventAvailable as EventAvailableIcon,
  BusinessCenter as BusinessCenterIcon,
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
  AreaChart,
  Area,
  Legend,
  ComposedChart,
} from "recharts";

const AdminDashboard = () => {
  const [selectedStat, setSelectedStat] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [branchPerformance, setBranchPerformance] = useState([]);
  const [serviceDistribution, setServiceDistribution] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);

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

      const [statsData, revenue, branches, services, bookings] =
        await Promise.all([
          dashboardService.getAdminStats(),
          dashboardService.getAdminRevenueData(),
          dashboardService.getAdminBranchPerformance(),
          dashboardService.getAdminServiceDistribution(),
          dashboardService.getAdminRecentBookings(),
        ]);

      console.log("Admin Dashboard Data:", {
        statsData,
        revenue,
        branches,
        services,
        bookings,
      });

      setStats(statsData);
      setRevenueData(Array.isArray(revenue) ? revenue : []);
      setBranchPerformance(Array.isArray(branches) ? branches : []);
      setServiceDistribution(Array.isArray(services) ? services : []);
      setRecentBookings(Array.isArray(bookings) ? bookings : []);

      console.log("State updated:", {
        revenueLength: revenue?.length || 0,
        branchesLength: branches?.length || 0,
        servicesLength: services?.length || 0,
        bookingsLength: bookings?.length || 0,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(
        "Failed to load dashboard data. Please check your connection and try again."
      );
      // Set empty arrays to prevent map errors
      setStats(null);
      setRevenueData([]);
      setBranchPerformance([]);
      setServiceDistribution([]);
      setRecentBookings([]);
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
          title: "Total Revenue",
          value: stats.revenue?.value || "$0",
          icon: <AttachMoneyIcon />,
          color: "#10b981",
          trend: stats.revenue?.trend || "",
          details: stats.revenue?.details || [],
        },
        {
          title: "Active Users",
          value: stats.users?.value || "0",
          icon: <PeopleIcon />,
          color: "#3b82f6",
          trend: stats.users?.trend || "",
          details: stats.users?.details || [],
        },
        {
          title: "Total Bookings",
          value: stats.bookings?.value || "0",
          icon: <CalendarTodayIcon />,
          color: "#f59e0b",
          trend: stats.bookings?.trend || "",
          details: stats.bookings?.details || [],
        },
        {
          title: "Service Branches",
          value: stats.branches?.value || "0",
          icon: <StoreIcon />,
          color: "#8b5cf6",
          trend: stats.branches?.trend || "",
          details: stats.branches?.details || [],
        },
        {
          title: "Performance Score",
          value: stats.performance?.value || "0%",
          icon: <TrendingUpIcon />,
          color: "#ef4444",
          trend: stats.performance?.trend || "",
          details: stats.performance?.details || [],
        },
      ]
    : [];

  const quickActions = [
    {
      title: "Generate Report",
      icon: <AssessmentIcon />,
      color: "#3b82f6",
      description: "Monthly analytics",
      action: () => navigate("/admin/reports"),
    },
    {
      title: "Manage Users",
      icon: <PeopleIcon />,
      color: "#10b981",
      description: "User permissions",
      action: () => navigate("/admin/users"),
    },
    {
      title: "View Calendar",
      icon: <CalendarTodayIcon />,
      color: "#f59e0b",
      description: "All bookings",
      action: () => navigate("/admin/calendar"),
    },
    {
      title: "Branch Overview",
      icon: <StoreIcon />,
      color: "#8b5cf6",
      description: "Performance metrics",
      action: () => navigate("/admin/branches"),
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
            Loading admin dashboard...
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

      {/* Debug Info */}
      {process.env.NODE_ENV === "development" && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Debug: Revenue: {revenueData.length}, Branches:{" "}
          {branchPerformance.length}, Services: {serviceDistribution.length},
          Bookings: {recentBookings.length}
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
            background: "linear-gradient(135deg, #e11d48 0%, #be185d 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Admin Overview
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
            label={stats?.revenue?.trend || "Revenue Tracking"}
            color="success"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            icon={<EventAvailableIcon />}
            label={`${stats?.bookings?.value || "0"} Bookings This Week`}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            icon={<BusinessCenterIcon />}
            label="All Branches Operational"
            color="info"
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
            <ComposedChart data={Array.isArray(revenueData) ? revenueData : []}>
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
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
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
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#e11d48"
                fill="url(#revenueGradient)"
                strokeWidth={3}
                name="Revenue ($)"
              />
              <Bar
                yAxisId="right"
                dataKey="services"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                name="Services"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="customers"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Customers"
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
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
      </Box>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Branch Performance */}
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
              Branch Performance Comparison
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={Array.isArray(branchPerformance) ? branchPerformance : []}
              >
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
                <Legend />
                <Bar
                  dataKey="services"
                  fill="#e11d48"
                  radius={[4, 4, 0, 0]}
                  name="Services"
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
              Service Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={
                    Array.isArray(serviceDistribution)
                      ? serviceDistribution
                      : []
                  }
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {Array.isArray(serviceDistribution) &&
                    serviceDistribution.map((entry, index) => (
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

      {/* Recent Bookings Table */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
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
                onClick={() => navigate("/admin/bookings")}
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
                  {Array.isArray(recentBookings) &&
                    recentBookings.map((booking) => (
                      <TableRow key={booking.id} hover>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
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

      <StatModal
        open={modalOpen}
        onClose={handleCloseModal}
        stat={selectedStat}
      />
    </Container>
  );
};

export default AdminDashboard;

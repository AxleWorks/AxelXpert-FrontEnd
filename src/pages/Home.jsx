import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import {
  DirectionsCar,
  Build,
  People,
  Assignment,
  TrendingUp,
  ArrowForwardIos,
  Notifications,
  CheckCircle,
  Schedule,
  Warning,
  AttachMoney,
  Close,
  CalendarToday,
  Settings,
  Analytics,
  Dashboard,
  Assessment,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import StatCard from "../components/dashboard/cards/StatCard";
import StatModal from "../components/dashboard/cards/StatModal";
import SalesChart from "../components/dashboard/charts/SalesChart";
import ServiceBarChart from "../components/dashboard/charts/ServiceBarChart";
import RevenuePieChart from "../components/dashboard/charts/RevenuePieChart";
import RecentActivity from "../components/dashboard/RecentActivity";

const QuickActions = () => {
  const actions = [
    {
      title: "Add Vehicle",
      icon: <DirectionsCar />,
      color: "#3b82f6",
      description: "Register new vehicle",
    },
    {
      title: "Schedule Service",
      icon: <CalendarToday />,
      color: "#10b981",
      description: "Book appointment",
    },
    {
      title: "Create Invoice",
      icon: <Assignment />,
      color: "#f59e0b",
      description: "Generate billing",
    },
    {
      title: "Customer Management",
      icon: <People />,
      color: "#ef4444",
      description: "Manage clients",
    },
    {
      title: "Inventory Check",
      icon: <Assessment />,
      color: "#8b5cf6",
      description: "Parts & supplies",
    },
    {
      title: "Reports",
      icon: <Analytics />,
      color: "#06b6d4",
      description: "View analytics",
    },
  ];

  return (
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
        Quick Actions & Most Used
      </Typography>
      <Grid container spacing={2}>
        {actions.map((action, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
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
  );
};

const Home = () => {
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
      title: "Total Vehicles",
      value: "2,847",
      icon: <DirectionsCar />,
      color: "#3b82f6",
      trend: "+12% this month",
      details: [
        { label: "New This Month", value: "156" },
        { label: "Service Ready", value: "89" },
        { label: "In Workshop", value: "23" },
        { label: "Completed", value: "2,579" },
      ],
    },
    {
      title: "Active Services",
      value: "342",
      icon: <Build />,
      color: "#10b981",
      trend: "+8% this week",
      details: [
        { label: "In Progress", value: "89" },
        { label: "Pending", value: "156" },
        { label: "Scheduled", value: "67" },
        { label: "Completed Today", value: "30" },
      ],
    },
    {
      title: "Total Revenue",
      value: "$847K",
      icon: <AttachMoney />,
      color: "#f59e0b",
      trend: "+24% this month",
      details: [
        { label: "This Month", value: "$124K" },
        { label: "Last Month", value: "$98K" },
        { label: "Services", value: "$456K" },
        { label: "Sales", value: "$391K" },
      ],
    },
    {
      title: "Customers",
      value: "1,205",
      icon: <People />,
      color: "#ef4444",
      trend: "+15% this month",
      details: [
        { label: "New This Month", value: "89" },
        { label: "Active", value: "1,156" },
        { label: "VIP Members", value: "234" },
        { label: "Returning", value: "892" },
      ],
    },
    {
      title: "Appointments",
      value: "89",
      icon: <Assignment />,
      color: "#8b5cf6",
      trend: "+5% today",
      details: [
        { label: "Today", value: "12" },
        { label: "This Week", value: "67" },
        { label: "Confirmed", value: "78" },
        { label: "Pending", value: "11" },
      ],
    },
  ];

  const activities = [
    {
      title: "Oil change completed for BMW X5",
      time: "2 minutes ago",
      icon: <CheckCircle sx={{ fontSize: 16 }} />,
      color: "#10b981",
    },
    {
      title: "New customer registration",
      time: "15 minutes ago",
      icon: <People sx={{ fontSize: 16 }} />,
      color: "#3b82f6",
    },
    {
      title: "Service appointment scheduled",
      time: "30 minutes ago",
      icon: <Schedule sx={{ fontSize: 16 }} />,
      color: "#f59e0b",
    },
    {
      title: "Brake inspection alert",
      time: "1 hour ago",
      icon: <Warning sx={{ fontSize: 16 }} />,
      color: "#ef4444",
    },
  ];

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
            background: "linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Dashboard Overview �
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "#64748b",
            fontSize: "1.1rem",
            fontWeight: 400,
          }}
        >
          Monitor your automotive business performance and key metrics
        </Typography>
      </Box>

      {/* Stats Cards - Full Width with 5 Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <StatCard {...stat} onClick={() => handleStatClick(stat)} />
          </Grid>
        ))}
      </Grid>

      {/* Sales Chart - Full Width */}
      <Box sx={{ mb: 4 }}>
        <SalesChart />
      </Box>

      {/* Charts Section - Bar Chart and Pie Chart */}
      <Grid container spacing={15} sx={{ mb: 4, justifyContent: "center" }}>
        <Grid item xs={12} md={6}>
          <ServiceBarChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <RevenuePieChart />
        </Grid>
      </Grid>

      {/* Quick Actions Section */}
      <Box sx={{ mb: 4 }}>
        <QuickActions />
      </Box>

      {/* Recent Activity Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <RecentActivity activities={activities} />
        </Grid>

        {/* Performance Overview */}
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
              sx={{ fontWeight: 700, color: "#1e293b", mb: 3 }}
            >
              Performance Metrics
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ color: "#64748b", mb: 1 }}>
                Service Completion Rate
              </Typography>
              <LinearProgress
                variant="determinate"
                value={87}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#e2e8f0",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#10b981",
                    borderRadius: 4,
                  },
                }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#1e293b", mt: 1 }}
              >
                87%
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ color: "#64748b", mb: 1 }}>
                Customer Satisfaction
              </Typography>
              <LinearProgress
                variant="determinate"
                value={94}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#e2e8f0",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#3b82f6",
                    borderRadius: 4,
                  },
                }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#1e293b", mt: 1 }}
              >
                94%
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: "#64748b", mb: 1 }}>
                Revenue Growth
              </Typography>
              <LinearProgress
                variant="determinate"
                value={76}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#e2e8f0",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#f59e0b",
                    borderRadius: 4,
                  },
                }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#1e293b", mt: 1 }}
              >
                +76%
              </Typography>
            </Box>
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

export default Home;

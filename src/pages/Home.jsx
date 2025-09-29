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

const StatCard = ({ title, value, icon, color, trend, onClick, details }) => (
  <Card
    elevation={0}
    onClick={onClick}
    sx={{
      p: 3,
      borderRadius: 3,
      border: "1px solid #e2e8f0",
      background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
      transition: "all 0.3s ease-in-out",
      cursor: "pointer",
      height: "65%",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.15)",
        border: `1px solid ${color}`,
      },
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: "#1e293b",
            mb: 0.5,
            fontSize: { xs: "1.8rem", md: "2.2rem" },
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#64748b",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          {title}
        </Typography>
        {trend && (
          <Box sx={{ display: "flex", alignItems: "center", mt: 1.5 }}>
            <TrendingUp sx={{ fontSize: 18, color: "#10b981", mr: 0.5 }} />
            <Typography
              variant="body2"
              sx={{ color: "#10b981", fontWeight: 700 }}
            >
              {trend}
            </Typography>
          </Box>
        )}
      </Box>
      <Avatar
        sx={{
          backgroundColor: color,
          width: 70,
          height: 70,
          boxShadow: `0 8px 20px ${color}40`,
        }}
      >
        {React.cloneElement(icon, { sx: { fontSize: 32 } })}
      </Avatar>
    </Box>
  </Card>
);

const StatModal = ({ open, onClose, stat }) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="sm"
    fullWidth
    PaperProps={{
      sx: {
        borderRadius: 3,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      },
    }}
  >
    <DialogTitle
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        pb: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar sx={{ backgroundColor: stat?.color, width: 48, height: 48 }}>
          {stat?.icon}
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {stat?.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Detailed Analytics
          </Typography>
        </Box>
      </Box>
      <IconButton onClick={onClose} size="small">
        <Close />
      </IconButton>
    </DialogTitle>
    <Divider />
    <DialogContent sx={{ pt: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              variant="h2"
              sx={{ fontWeight: 800, color: stat?.color }}
            >
              {stat?.value}
            </Typography>
            <Typography variant="h6" sx={{ color: "#64748b", mt: 1 }}>
              Current {stat?.title}
            </Typography>
          </Box>
        </Grid>
        {stat?.details &&
          stat.details.map((detail, index) => (
            <Grid item xs={6} key={index}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  backgroundColor: "#f8fafc",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "#1e293b" }}
                >
                  {detail.value}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  {detail.label}
                </Typography>
              </Box>
            </Grid>
          ))}
      </Grid>
    </DialogContent>
    <DialogActions sx={{ p: 3, pt: 0 }}>
      <Button
        onClick={onClose}
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: stat?.color,
          py: 1.5,
          fontWeight: 600,
          textTransform: "none",
        }}
      >
        View Detailed Report
      </Button>
    </DialogActions>
  </Dialog>
);

const RecentActivity = ({ activities }) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: "1px solid #e2e8f0",
      height: "100%",
    }}
  >
    <CardContent>
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, mb: 2, color: "#1e293b" }}
      >
        Recent Activity
      </Typography>
      <List disablePadding>
        {activities.map((activity, index) => (
          <ListItem key={index} disablePadding sx={{ mb: 1 }}>
            <ListItemAvatar>
              <Avatar
                sx={{ backgroundColor: activity.color, width: 32, height: 32 }}
              >
                {activity.icon}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={activity.title}
              secondary={activity.time}
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
              secondaryTypographyProps={{
                fontSize: "0.75rem",
              }}
            />
            <ListItemSecondaryAction>
              <IconButton size="small">
                <ArrowForwardIos sx={{ fontSize: 12 }} />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </CardContent>
  </Card>
);

const SalesChart = () => {
  const salesData = [
    { month: "Jan", sales: 45000, services: 28000 },
    { month: "Feb", sales: 52000, services: 31000 },
    { month: "Mar", sales: 48000, services: 35000 },
    { month: "Apr", sales: 61000, services: 42000 },
    { month: "May", sales: 55000, services: 38000 },
    { month: "Jun", sales: 67000, services: 45000 },
  ];

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        p: 3,
        height: "400px",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, mb: 3, color: "#1e293b" }}
      >
        Sales Overview
      </Typography>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={salesData}>
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="servicesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#64748b" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#64748b" }}
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value) => [`$${value.toLocaleString()}`, ""]}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="url(#salesGradient)"
            name="Sales"
          />
          <Area
            type="monotone"
            dataKey="services"
            stroke="#10b981"
            strokeWidth={3}
            fill="url(#servicesGradient)"
            name="Services"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

const ServiceBarChart = () => {
  const serviceData = [
    { service: "Oil Change", count: 145, revenue: 8700 },
    { service: "Brake Repair", count: 89, revenue: 15680 },
    { service: "Tire Rotation", count: 134, revenue: 6700 },
    { service: "Engine Diagnostic", count: 67, revenue: 20100 },
    { service: "Battery Replacement", count: 92, revenue: 13800 },
  ];

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        p: 3,
        width: "120%",
        height: "400px",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, mb: 3, color: "#1e293b" }}
      >
        Service Performance
      </Typography>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={serviceData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="service"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#64748b" }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#64748b" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Bar
            dataKey="count"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            name="Count"
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

const RevenuePieChart = () => {
  const revenueData = [
    { name: "Vehicle Sales", value: 45, color: "#3b82f6" },
    { name: "Service & Repair", value: 30, color: "#10b981" },
    { name: "Parts", value: 15, color: "#f59e0b" },
    { name: "Maintenance", value: 10, color: "#ef4444" },
  ];

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        p: 3,
        width: "120%",
        height: "400px",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, mb: 3, color: "#1e293b" }}
      >
        Revenue Distribution
      </Typography>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={revenueData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
          >
            {revenueData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value) => [`${value}%`, ""]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: "12px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

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

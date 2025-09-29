import React from "react";
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
} from "@mui/icons-material";

const StatCard = ({ title, value, icon, color, trend }) => (
  <Card
    elevation={0}
    sx={{
      p: 2,
      borderRadius: 3,
      border: "1px solid #e2e8f0",
      background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
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
      <Box>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}
        >
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
          {title}
        </Typography>
        {trend && (
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <TrendingUp sx={{ fontSize: 16, color: "#10b981", mr: 0.5 }} />
            <Typography
              variant="caption"
              sx={{ color: "#10b981", fontWeight: 600 }}
            >
              {trend}
            </Typography>
          </Box>
        )}
      </Box>
      <Avatar
        sx={{
          backgroundColor: color,
          width: 56,
          height: 56,
        }}
      >
        {icon}
      </Avatar>
    </Box>
  </Card>
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

const QuickActions = () => (
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
        Quick Actions
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<DirectionsCar />}
            sx={{
              backgroundColor: "#3b82f6",
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
            }}
          >
            Add Vehicle
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Assignment />}
            sx={{
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              borderColor: "#e2e8f0",
              color: "#64748b",
            }}
          >
            Schedule Service
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<People />}
            sx={{
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              borderColor: "#e2e8f0",
              color: "#64748b",
            }}
          >
            Add Customer
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Build />}
            sx={{
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              borderColor: "#e2e8f0",
              color: "#64748b",
            }}
          >
            Create Service
          </Button>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

const Home = () => {
  const stats = [
    {
      title: "Total Vehicles",
      value: "2,847",
      icon: <DirectionsCar />,
      color: "#3b82f6",
      trend: "+12% this month",
    },
    {
      title: "Active Services",
      value: "342",
      icon: <Build />,
      color: "#10b981",
      trend: "+8% this week",
    },
    {
      title: "Customers",
      value: "1,205",
      icon: <People />,
      color: "#f59e0b",
      trend: "+15% this month",
    },
    {
      title: "Appointments",
      value: "89",
      icon: <Assignment />,
      color: "#ef4444",
      trend: "+5% today",
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
    <Container maxWidth="xl">
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#1e293b",
            mb: 1,
            fontSize: { xs: "1.75rem", md: "2.125rem" },
          }}
        >
          Welcome back! 👋
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "#64748b", fontSize: "1.1rem" }}
        >
          Here's what's happening with your automotive service business today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <RecentActivity activities={activities} />
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <QuickActions />
        </Grid>

        {/* Performance Overview */}
        <Grid item xs={12}>
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
                sx={{ fontWeight: 600, color: "#1e293b" }}
              >
                Service Performance
              </Typography>
              <Chip
                label="This Month"
                variant="outlined"
                size="small"
                sx={{ borderColor: "#e2e8f0" }}
              />
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box>
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
                    sx={{ fontWeight: 600, color: "#1e293b", mt: 1 }}
                  >
                    87%
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box>
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
                    sx={{ fontWeight: 600, color: "#1e293b", mt: 1 }}
                  >
                    94%
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
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
                    sx={{ fontWeight: 600, color: "#1e293b", mt: 1 }}
                  >
                    +76%
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;

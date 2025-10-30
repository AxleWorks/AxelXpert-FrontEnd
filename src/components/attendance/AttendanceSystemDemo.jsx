import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  useTheme,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  CalendarToday,
  People,
  Assessment,
  Settings,
  AutoAwesome,
  Analytics,
  CheckCircle,
  Schedule,
  Warning,
  TrendingUp,
  Fingerprint,
  LocationOn,
  Notifications,
} from "@mui/icons-material";

const AttendanceSystemDemo = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      label: "Calendar View",
      description: "Visual attendance calendar with color-coded indicators",
      icon: CalendarToday,
      color: theme.palette.primary.main,
      features: [
        "Monthly calendar view",
        "Color-coded attendance rates",
        "Interactive date selection",
        "Quick attendance overview",
        "Navigation controls"
      ]
    },
    {
      label: "Employee Details",
      description: "Comprehensive daily attendance management",
      icon: People,
      color: theme.palette.success.main,
      features: [
        "Employee status tracking",
        "Time management (check-in/out)",
        "Overtime calculation",
        "Break time monitoring",
        "Quick edit functionality"
      ]
    },
    {
      label: "Statistics Dashboard",
      description: "Performance analytics and insights",
      icon: Assessment,
      color: theme.palette.info.main,
      features: [
        "Attendance rate metrics",
        "Punctuality analysis",
        "Top performer rankings",
        "Department comparisons",
        "Trend analysis"
      ]
    },
    {
      label: "Employee Management",
      description: "Profile and settings management",
      icon: Settings,
      color: theme.palette.secondary.main,
      features: [
        "Employee directory",
        "QR code generation",
        "Biometric setup",
        "Schedule configuration",
        "Settings management"
      ]
    },
    {
      label: "Advanced Features",
      description: "Automation and problem resolution",
      icon: AutoAwesome,
      color: theme.palette.warning.main,
      features: [
        "Automated warning system",
        "Problem detection",
        "Geo-fencing setup",
        "Smart notifications",
        "Policy enforcement"
      ]
    },
    {
      label: "Reports & Analytics",
      description: "Comprehensive reporting system",
      icon: Analytics,
      color: theme.palette.error.main,
      features: [
        "Multiple report formats",
        "Export capabilities (PDF, Excel)",
        "Custom date ranges",
        "Performance metrics",
        "Email distribution"
      ]
    }
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const keyFeatures = [
    {
      icon: CheckCircle,
      title: "Smart Attendance Tracking",
      description: "Automated check-in/out with multiple authentication methods"
    },
    {
      icon: Schedule,
      title: "Real-time Monitoring",
      description: "Live attendance updates and instant notifications"
    },
    {
      icon: Warning,
      title: "Intelligent Alerts",
      description: "Proactive problem detection and automated warnings"
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Comprehensive insights and productivity metrics"
    },
    {
      icon: Fingerprint,
      title: "Biometric Integration",
      description: "Secure authentication with fingerprint and facial recognition"
    },
    {
      icon: LocationOn,
      title: "Geo-fencing",
      description: "Location-based attendance verification"
    }
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          AxelXpert Attendance System
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Comprehensive Employee Attendance Management Solution
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            🎉 <strong>New Feature:</strong> Advanced attendance management system is now live! 
            Navigate to Manager Panel → Attendance to get started.
          </Typography>
        </Alert>
      </Box>

      {/* Key Features Grid */}
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: "center" }}>
        Key Features
      </Typography>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {keyFeatures.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card elevation={3} sx={{ height: "100%", borderRadius: 3 }}>
                <CardContent sx={{ textAlign: "center", p: 3 }}>
                  <IconComponent 
                    sx={{ 
                      fontSize: 48, 
                      color: theme.palette.primary.main, 
                      mb: 2 
                    }} 
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* System Walkthrough */}
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: "center" }}>
        System Walkthrough
      </Typography>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Step key={step.label}>
                <StepLabel
                  StepIconComponent={() => (
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: step.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                      }}
                    >
                      <IconComponent sx={{ fontSize: 20 }} />
                    </Box>
                  )}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {step.description}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Key Features:
                    </Typography>
                    <List dense>
                      {step.features.map((feature, featureIndex) => (
                        <ListItem key={featureIndex} sx={{ py: 0.5, pl: 0 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircle sx={{ fontSize: 16, color: step.color }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature}
                            primaryTypographyProps={{ variant: "body2" }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                      disabled={index === steps.length - 1}
                    >
                      {index === steps.length - 1 ? 'Finish' : 'Continue'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              🎉 You've completed the system walkthrough!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Ready to start managing employee attendance? Navigate to the Attendance section in your Manager Panel.
            </Typography>
            <Button onClick={handleReset} variant="outlined">
              Reset Walkthrough
            </Button>
          </Paper>
        )}
      </Paper>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ textAlign: "center", borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                6
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Main Features
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ textAlign: "center", borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                20+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sub-features
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ textAlign: "center", borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.info.main }}>
                100%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mobile Responsive
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ textAlign: "center", borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                24/7
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Real-time Tracking
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Get Started Button */}
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Button
          variant="contained"
          size="large"
          sx={{ 
            px: 4, 
            py: 2, 
            fontSize: "1.1rem",
            borderRadius: 3,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
          }}
        >
          Start Managing Attendance →
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Navigate to Manager Panel → Attendance to begin
        </Typography>
      </Box>
    </Box>
  );
};

export default AttendanceSystemDemo;

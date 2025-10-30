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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Warning,
  Block,
  MoneyOff,
  Timer,
  Notifications,
  Schedule,
  LocationOn,
  Wifi,
  WifiOff,
  Camera,
  Fingerprint,
  QrCode,
  TrendingDown,
  EventBusy,
  Assignment,
  AutoAwesome,
  Security,
  Analytics,
} from "@mui/icons-material";

const AttendanceAdvancedFeatures = ({ employees = [], attendanceData = {}, onUpdateEmployee }) => {
  const theme = useTheme();
  const [warningDialogOpen, setWarningDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [warningData, setWarningData] = useState({
    type: "tardiness",
    reason: "",
    severity: "low",
    actionRequired: false,
  });
  const [automationSettings, setAutomationSettings] = useState({
    autoWarnings: true,
    lateThreshold: 15, // minutes
    absenteeismLimit: 3, // days per month
    overtimeAutoApproval: false,
    biometricRequired: false,
    geoFencingEnabled: true,
  });

  const warningTypes = {
    tardiness: { 
      label: "Frequent Tardiness", 
      color: "warning", 
      icon: Schedule,
      description: "Employee consistently arrives late"
    },
    absenteeism: { 
      label: "Excessive Absenteeism", 
      color: "error", 
      icon: EventBusy,
      description: "Multiple unexcused absences"
    },
    earlyDeparture: { 
      label: "Early Departures", 
      color: "info", 
      icon: Timer,
      description: "Leaving before scheduled time"
    },
    policyViolation: { 
      label: "Policy Violation", 
      color: "error", 
      icon: Security,
      description: "Violation of company attendance policy"
    },
  };

  const severityLevels = {
    low: { label: "Low", color: "info" },
    medium: { label: "Medium", color: "warning" },
    high: { label: "High", color: "error" },
    critical: { label: "Critical", color: "error" },
  };

  // Calculate problematic employees
  const getProblematicEmployees = () => {
    const employeeIssues = [];
    
    employees.forEach(employee => {
      const issues = [];
      let lateCount = 0;
      let absentCount = 0;
      let totalDays = 0;

      Object.keys(attendanceData).forEach(date => {
        const dayData = attendanceData[date];
        const empData = dayData.employees?.find(emp => emp.id === employee.id);
        
        if (empData) {
          totalDays++;
          if (empData.status === 'late') lateCount++;
          if (empData.status === 'absent') absentCount++;
        }
      });

      // Check for frequent tardiness
      if (lateCount > 3) {
        issues.push({
          type: 'tardiness',
          count: lateCount,
          severity: lateCount > 7 ? 'high' : 'medium',
        });
      }

      // Check for excessive absenteeism
      if (absentCount > 2) {
        issues.push({
          type: 'absenteeism',
          count: absentCount,
          severity: absentCount > 5 ? 'critical' : 'high',
        });
      }

      if (issues.length > 0) {
        employeeIssues.push({
          employee,
          issues,
          totalDays,
          attendanceRate: totalDays > 0 ? ((totalDays - absentCount) / totalDays) * 100 : 0,
        });
      }
    });

    return employeeIssues.sort((a, b) => b.issues.length - a.issues.length);
  };

  const handleIssueWarning = (employee, issueType) => {
    setSelectedEmployee(employee);
    setWarningData({
      ...warningData,
      type: issueType,
      reason: warningTypes[issueType]?.description || "",
    });
    setWarningDialogOpen(true);
  };

  const handleSubmitWarning = () => {
    // In a real application, this would make an API call
    console.log("Issuing warning:", {
      employee: selectedEmployee,
      warning: warningData,
      timestamp: new Date().toISOString(),
    });
    
    setWarningDialogOpen(false);
    setSelectedEmployee(null);
    setWarningData({
      type: "tardiness",
      reason: "",
      severity: "low",
      actionRequired: false,
    });
  };

  const handleApplyNoPay = (employeeId, days) => {
    console.log(`Applying no-pay for ${days} days to employee ${employeeId}`);
  };

  const handleRestrictAccess = (employeeId, duration) => {
    console.log(`Restricting access for employee ${employeeId} for ${duration}`);
  };

  const problematicEmployees = getProblematicEmployees();

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
        Advanced Attendance Management
      </Typography>

      {/* Automation Settings */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <AutoAwesome sx={{ color: theme.palette.primary.main }} />
          Automation Settings
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={automationSettings.autoWarnings}
                  onChange={(e) => setAutomationSettings({
                    ...automationSettings,
                    autoWarnings: e.target.checked
                  })}
                />
              }
              label="Automatic Warning System"
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", ml: 4 }}>
              Automatically issue warnings for policy violations
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={automationSettings.biometricRequired}
                  onChange={(e) => setAutomationSettings({
                    ...automationSettings,
                    biometricRequired: e.target.checked
                  })}
                />
              }
              label="Biometric Authentication Required"
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", ml: 4 }}>
              Require biometric verification for check-in/out
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={automationSettings.geoFencingEnabled}
                  onChange={(e) => setAutomationSettings({
                    ...automationSettings,
                    geoFencingEnabled: e.target.checked
                  })}
                />
              }
              label="Geo-fencing Enabled"
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", ml: 4 }}>
              Restrict check-in to office premises only
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Late Threshold (minutes)"
              type="number"
              size="small"
              value={automationSettings.lateThreshold}
              onChange={(e) => setAutomationSettings({
                ...automationSettings,
                lateThreshold: parseInt(e.target.value) || 0
              })}
              sx={{ width: 200 }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Problematic Employees Alert */}
      {problematicEmployees.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {problematicEmployees.length} employee(s) require attention
          </Typography>
          <Typography variant="body2">
            Review attendance issues and take appropriate action
          </Typography>
        </Alert>
      )}

      {/* Employee Issues Management */}
      <Grid container spacing={3}>
        {problematicEmployees.map(({ employee, issues, attendanceRate }) => (
          <Grid item xs={12} key={employee.id}>
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {employee.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {employee.position} • {employee.department}
                      </Typography>
                      <Chip
                        label={`${attendanceRate.toFixed(1)}% Attendance`}
                        size="small"
                        color={attendanceRate > 80 ? "success" : attendanceRate > 60 ? "warning" : "error"}
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Issues List */}
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Identified Issues:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {issues.map((issue, index) => {
                    const warningType = warningTypes[issue.type];
                    const severity = severityLevels[issue.severity];
                    const IconComponent = warningType?.icon || Warning;

                    return (
                      <Chip
                        key={index}
                        icon={<IconComponent sx={{ fontSize: 16 }} />}
                        label={`${warningType?.label} (${issue.count})`}
                        color={severity.color}
                        variant="outlined"
                        size="small"
                      />
                    );
                  })}
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="warning"
                    startIcon={<Warning />}
                    onClick={() => handleIssueWarning(employee, issues[0]?.type || 'tardiness')}
                  >
                    Issue Warning
                  </Button>
                  
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<MoneyOff />}
                    onClick={() => handleApplyNoPay(employee.id, 1)}
                  >
                    Apply No Pay
                  </Button>
                  
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<Block />}
                    onClick={() => handleRestrictAccess(employee.id, "3 days")}
                  >
                    Restrict Access
                  </Button>

                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Assignment />}
                  >
                    Schedule Meeting
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Advanced Features Grid */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ height: "100%", borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Analytics sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Smart Analytics
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                AI-powered insights and predictions for attendance patterns
              </Typography>
              <Button variant="outlined" size="small" fullWidth>
                View Analytics Dashboard
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ height: "100%", borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <LocationOn sx={{ color: theme.palette.success.main, mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Geo-tracking
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Track employee location during work hours with GPS
              </Typography>
              <Button variant="outlined" size="small" fullWidth>
                Configure Geo-fencing
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ height: "100%", borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Notifications sx={{ color: theme.palette.warning.main, mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Smart Notifications
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Automated alerts for managers and HR department
              </Typography>
              <Button variant="outlined" size="small" fullWidth>
                Setup Notifications
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Warning Dialog */}
      <Dialog open={warningDialogOpen} onClose={() => setWarningDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Issue Warning
          {selectedEmployee && (
            <Typography variant="body2" color="text.secondary">
              Employee: {selectedEmployee.name}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Warning Type</InputLabel>
                <Select
                  value={warningData.type}
                  label="Warning Type"
                  onChange={(e) => setWarningData({ ...warningData, type: e.target.value })}
                >
                  {Object.entries(warningTypes).map(([key, type]) => (
                    <MenuItem key={key} value={key}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={warningData.severity}
                  label="Severity"
                  onChange={(e) => setWarningData({ ...warningData, severity: e.target.value })}
                >
                  {Object.entries(severityLevels).map(([key, level]) => (
                    <MenuItem key={key} value={key}>
                      {level.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason"
                multiline
                rows={3}
                value={warningData.reason}
                onChange={(e) => setWarningData({ ...warningData, reason: e.target.value })}
                placeholder="Provide detailed reason for the warning..."
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={warningData.actionRequired}
                    onChange={(e) => setWarningData({ ...warningData, actionRequired: e.target.checked })}
                  />
                }
                label="Immediate Action Required"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWarningDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitWarning} variant="contained" color="warning">
            Issue Warning
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AttendanceAdvancedFeatures;

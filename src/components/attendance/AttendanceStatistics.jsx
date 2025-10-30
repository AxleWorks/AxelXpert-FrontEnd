import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Warning,
  Star,
  AccessTime,
  Person,
  CalendarToday,
} from "@mui/icons-material";

const AttendanceStatistics = ({ attendanceData = {}, employees = [] }) => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState("month"); // week, month, quarter, year

  // Calculate attendance statistics
  const calculateStats = () => {
    const dates = Object.keys(attendanceData);
    let totalDays = dates.length;
    let totalPresent = 0;
    let totalLate = 0;
    let totalAbsent = 0;
    let totalOnLeave = 0;
    let totalWarnings = 0;
    let totalOvertime = 0;

    dates.forEach(date => {
      const dayData = attendanceData[date];
      if (dayData.employees) {
        dayData.employees.forEach(emp => {
          switch (emp.status) {
            case 'present':
              totalPresent++;
              break;
            case 'late':
              totalLate++;
              break;
            case 'absent':
              totalAbsent++;
              break;
            case 'leave':
              totalOnLeave++;
              break;
            case 'warning':
              totalWarnings++;
              break;
          }
          
          // Calculate overtime
          if (emp.checkInTime && emp.checkOutTime) {
            const overtime = calculateOvertime(emp.checkInTime, emp.checkOutTime);
            totalOvertime += overtime;
          }
        });
      }
    });

    const totalEntries = totalPresent + totalLate + totalAbsent + totalOnLeave;
    const attendanceRate = totalEntries > 0 ? ((totalPresent + totalLate) / totalEntries) * 100 : 0;

    return {
      totalDays,
      totalPresent,
      totalLate,
      totalAbsent,
      totalOnLeave,
      totalWarnings,
      totalOvertime: totalOvertime.toFixed(1),
      attendanceRate: attendanceRate.toFixed(1),
      punctualityRate: totalPresent > 0 ? ((totalPresent / (totalPresent + totalLate)) * 100).toFixed(1) : 0,
    };
  };

  const calculateOvertime = (checkIn, checkOut, regularHours = 8) => {
    if (!checkIn || !checkOut) return 0;
    try {
      const start = new Date(`2000-01-01T${checkIn}`);
      const end = new Date(`2000-01-01T${checkOut}`);
      const totalHours = (end - start) / (1000 * 60 * 60);
      return Math.max(0, totalHours - regularHours);
    } catch {
      return 0;
    }
  };

  // Get top performers and frequent latecomers
  const getEmployeeInsights = () => {
    const employeeStats = {};
    
    Object.keys(attendanceData).forEach(date => {
      const dayData = attendanceData[date];
      if (dayData.employees) {
        dayData.employees.forEach(emp => {
          if (!employeeStats[emp.id]) {
            employeeStats[emp.id] = {
              id: emp.id,
              name: emp.name,
              avatar: emp.avatar,
              present: 0,
              late: 0,
              absent: 0,
              totalDays: 0,
              overtime: 0,
              warnings: 0,
            };
          }
          
          employeeStats[emp.id].totalDays++;
          
          switch (emp.status) {
            case 'present':
              employeeStats[emp.id].present++;
              break;
            case 'late':
              employeeStats[emp.id].late++;
              break;
            case 'absent':
              employeeStats[emp.id].absent++;
              break;
            case 'warning':
              employeeStats[emp.id].warnings++;
              break;
          }
          
          if (emp.checkInTime && emp.checkOutTime) {
            employeeStats[emp.id].overtime += calculateOvertime(emp.checkInTime, emp.checkOutTime);
          }
        });
      }
    });

    const employeeArray = Object.values(employeeStats);
    
    // Top performers (high attendance rate)
    const topPerformers = employeeArray
      .filter(emp => emp.totalDays > 0)
      .map(emp => ({
        ...emp,
        attendanceRate: ((emp.present + emp.late) / emp.totalDays) * 100,
        punctualityRate: emp.present > 0 ? (emp.present / (emp.present + emp.late)) * 100 : 0,
      }))
      .sort((a, b) => b.attendanceRate - a.attendanceRate)
      .slice(0, 5);

    // Frequent latecomers
    const frequentLatecomers = employeeArray
      .filter(emp => emp.late > 0)
      .sort((a, b) => b.late - a.late)
      .slice(0, 5);

    // Employees with warnings
    const employeesWithWarnings = employeeArray
      .filter(emp => emp.warnings > 0)
      .sort((a, b) => b.warnings - a.warnings)
      .slice(0, 5);

    return { topPerformers, frequentLatecomers, employeesWithWarnings };
  };

  const stats = calculateStats();
  const insights = getEmployeeInsights();

  return (
    <Box>
      {/* Time Range Selector */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Attendance Statistics
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="quarter">This Quarter</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Main Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                  {stats.attendanceRate}%
                </Typography>
                <TrendingUp sx={{ fontSize: 32, color: theme.palette.success.main }} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Overall Attendance Rate
              </Typography>
              <LinearProgress
                variant="determinate"
                value={parseFloat(stats.attendanceRate)}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: theme.palette.grey[200],
                  "& .MuiLinearProgress-bar": {
                    bgcolor: theme.palette.success.main,
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                  {stats.punctualityRate}%
                </Typography>
                <AccessTime sx={{ fontSize: 32, color: theme.palette.primary.main }} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Punctuality Rate
              </Typography>
              <LinearProgress
                variant="determinate"
                value={parseFloat(stats.punctualityRate)}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: theme.palette.grey[200],
                  "& .MuiLinearProgress-bar": {
                    bgcolor: theme.palette.primary.main,
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                  {stats.totalOvertime}h
                </Typography>
                <TrendingUp sx={{ fontSize: 32, color: theme.palette.warning.main }} />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Overtime Hours
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.error.main }}>
                  {stats.totalWarnings}
                </Typography>
                <Warning sx={{ fontSize: 32, color: theme.palette.error.main }} />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Warnings Issued
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Breakdown */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
              {stats.totalPresent}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Present Days
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.warning.main }}>
              {stats.totalLate}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Late Arrivals
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.error.main }}>
              {stats.totalAbsent}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Absent Days
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.info.main }}>
              {stats.totalOnLeave}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              On Leave
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Employee Insights */}
      <Grid container spacing={3}>
        {/* Top Performers */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Star sx={{ color: theme.palette.warning.main, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Top Performers
              </Typography>
            </Box>
            <List dense>
              {insights.topPerformers.map((employee, index) => (
                <React.Fragment key={employee.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar src={employee.avatar} sx={{ width: 32, height: 32 }}>
                        {employee.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={employee.name}
                      secondary={`${employee.attendanceRate.toFixed(1)}% attendance`}
                    />
                    <Chip
                      label={`#${index + 1}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </ListItem>
                  {index < insights.topPerformers.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Frequent Latecomers */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <AccessTime sx={{ color: theme.palette.warning.main, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Frequent Latecomers
              </Typography>
            </Box>
            <List dense>
              {insights.frequentLatecomers.map((employee, index) => (
                <React.Fragment key={employee.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar src={employee.avatar} sx={{ width: 32, height: 32 }}>
                        {employee.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={employee.name}
                      secondary={`${employee.late} late days`}
                    />
                    <Chip
                      label={employee.late}
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  </ListItem>
                  {index < insights.frequentLatecomers.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Employees with Warnings */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Warning sx={{ color: theme.palette.error.main, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Employees with Warnings
              </Typography>
            </Box>
            <List dense>
              {insights.employeesWithWarnings.map((employee, index) => (
                <React.Fragment key={employee.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar src={employee.avatar} sx={{ width: 32, height: 32 }}>
                        {employee.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={employee.name}
                      secondary={`${employee.warnings} warnings`}
                    />
                    <Chip
                      label={employee.warnings}
                      size="small"
                      color="error"
                      variant="outlined"
                    />
                  </ListItem>
                  {index < insights.employeesWithWarnings.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AttendanceStatistics;

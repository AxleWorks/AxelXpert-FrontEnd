import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  useTheme,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";
import {
  Download,
  Print,
  Email,
  PictureAsPdf,
  TableChart,
  Assessment,
  TrendingUp,
  TrendingDown,
  People,
  Schedule,
} from "@mui/icons-material";
// Date picker imports commented out temporarily
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";

const AttendanceReports = ({ employees = [], attendanceData = {} }) => {
  const theme = useTheme();
  const [reportType, setReportType] = useState("summary");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
  });
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState("all");

  const departments = [...new Set(employees.map(emp => emp.department))];

  // Generate comprehensive report data
  const generateReportData = () => {
    const filteredEmployees = employees.filter(emp => 
      selectedDepartment === "all" || emp.department === selectedDepartment
    ).filter(emp =>
      selectedEmployee === "all" || emp.id === selectedEmployee
    );

    return filteredEmployees.map(employee => {
      let totalDays = 0;
      let presentDays = 0;
      let lateDays = 0;
      let absentDays = 0;
      let leaveDays = 0;
      let totalWorkingHours = 0;
      let totalOvertimeHours = 0;
      let warningCount = 0;

      Object.keys(attendanceData).forEach(dateKey => {
        const date = new Date(dateKey);
        if (date >= dateRange.startDate && date <= dateRange.endDate) {
          const dayData = attendanceData[dateKey];
          const empData = dayData.employees?.find(emp => emp.id === employee.id);
          
          if (empData) {
            totalDays++;
            
            switch (empData.status) {
              case 'present':
                presentDays++;
                break;
              case 'late':
                lateDays++;
                break;
              case 'absent':
                absentDays++;
                break;
              case 'leave':
                leaveDays++;
                break;
              case 'warning':
                warningCount++;
                break;
            }

            // Calculate working hours
            if (empData.checkInTime && empData.checkOutTime) {
              const workHours = calculateWorkingHours(empData.checkInTime, empData.checkOutTime);
              totalWorkingHours += workHours;
              
              const overtime = Math.max(0, workHours - 8);
              totalOvertimeHours += overtime;
            }
          }
        }
      });

      const attendanceRate = totalDays > 0 ? ((presentDays + lateDays) / totalDays) * 100 : 0;
      const punctualityRate = (presentDays + lateDays) > 0 ? (presentDays / (presentDays + lateDays)) * 100 : 0;

      return {
        employee,
        totalDays,
        presentDays,
        lateDays,
        absentDays,
        leaveDays,
        warningCount,
        attendanceRate,
        punctualityRate,
        totalWorkingHours,
        averageWorkingHours: totalDays > 0 ? totalWorkingHours / totalDays : 0,
        totalOvertimeHours,
        productivityScore: calculateProductivityScore(attendanceRate, punctualityRate, totalOvertimeHours),
      };
    });
  };

  const calculateWorkingHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    try {
      const start = new Date(`2000-01-01T${checkIn}`);
      const end = new Date(`2000-01-01T${checkOut}`);
      return (end - start) / (1000 * 60 * 60);
    } catch {
      return 0;
    }
  };

  const calculateProductivityScore = (attendance, punctuality, overtime) => {
    const attendanceScore = attendance * 0.4;
    const punctualityScore = punctuality * 0.4;
    const overtimeScore = Math.min(overtime * 2, 20); // Cap at 20 points
    return Math.min(100, attendanceScore + punctualityScore + overtimeScore);
  };

  const handleExportPDF = () => {
    console.log("Exporting PDF report...");
    // Implement PDF export functionality
  };

  const handleExportExcel = () => {
    console.log("Exporting Excel report...");
    // Implement Excel export functionality
  };

  const handleEmailReport = () => {
    console.log("Emailing report...");
    // Implement email functionality
  };

  const handlePrintReport = () => {
    window.print();
  };

  const reportData = generateReportData();

  // Calculate summary statistics
  const summaryStats = {
    totalEmployees: reportData.length,
    averageAttendance: reportData.length > 0 ? 
      reportData.reduce((sum, emp) => sum + emp.attendanceRate, 0) / reportData.length : 0,
    averagePunctuality: reportData.length > 0 ? 
      reportData.reduce((sum, emp) => sum + emp.punctualityRate, 0) / reportData.length : 0,
    totalOvertimeHours: reportData.reduce((sum, emp) => sum + emp.totalOvertimeHours, 0),
    totalWarnings: reportData.reduce((sum, emp) => sum + emp.warningCount, 0),
  };  return (
    <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Attendance Reports & Analytics
        </Typography>

        {/* Report Configuration */}
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  label="Report Type"
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <MenuItem value="summary">Summary Report</MenuItem>
                  <MenuItem value="detailed">Detailed Report</MenuItem>
                  <MenuItem value="departmental">Department Analysis</MenuItem>
                  <MenuItem value="individual">Individual Analysis</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Department</InputLabel>
                <Select
                  value={selectedDepartment}
                  label="Department"
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <MenuItem value="all">All Departments</MenuItem>
                  {departments.map(dept => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Start Date"
                type="date"
                size="small"
                fullWidth
                value={dateRange.startDate.toISOString().split('T')[0]}
                onChange={(e) => setDateRange({ ...dateRange, startDate: new Date(e.target.value) })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="End Date"
                type="date"
                size="small"
                fullWidth
                value={dateRange.endDate.toISOString().split('T')[0]}
                onChange={(e) => setDateRange({ ...dateRange, endDate: new Date(e.target.value) })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PictureAsPdf />}
                  onClick={handleExportPDF}
                >
                  PDF
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<TableChart />}
                  onClick={handleExportExcel}
                >
                  Excel
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Email />}
                  onClick={handleEmailReport}
                >
                  Email
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Print />}
                  onClick={handlePrintReport}
                >
                  Print
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Summary Statistics */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: "center" }}>
                <People sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {summaryStats.totalEmployees}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Employees
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: "center" }}>
                <TrendingUp sx={{ fontSize: 40, color: theme.palette.success.main, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                  {summaryStats.averageAttendance.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Attendance
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: "center" }}>
                <Schedule sx={{ fontSize: 40, color: theme.palette.info.main, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.info.main }}>
                  {summaryStats.averagePunctuality.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Punctuality
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: "center" }}>
                <Assessment sx={{ fontSize: 40, color: theme.palette.warning.main, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                  {summaryStats.totalOvertimeHours.toFixed(1)}h
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Overtime
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Detailed Report Table */}
        <Paper elevation={2} sx={{ borderRadius: 3 }}>
          <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {reportType === "summary" && "Employee Attendance Summary"}
              {reportType === "detailed" && "Detailed Attendance Report"}
              {reportType === "departmental" && "Department-wise Analysis"}
              {reportType === "individual" && "Individual Employee Analysis"}
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: theme.palette.grey[50] }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Total Days</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Present</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Late</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Absent</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Attendance Rate</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Punctuality Rate</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Avg Hours/Day</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Overtime</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Productivity Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.map((data) => (
                  <TableRow key={data.employee.id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                          src={data.employee.avatar}
                          sx={{ width: 32, height: 32 }}
                        >
                          {data.employee.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {data.employee.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {data.employee.employeeId}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={data.employee.department}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{data.totalDays}</TableCell>
                    <TableCell>{data.presentDays}</TableCell>
                    <TableCell>{data.lateDays}</TableCell>
                    <TableCell>{data.absentDays}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={data.attendanceRate}
                          sx={{ 
                            width: 60, 
                            height: 6, 
                            borderRadius: 3,
                            bgcolor: theme.palette.grey[200],
                            "& .MuiLinearProgress-bar": {
                              bgcolor: data.attendanceRate > 90 ? theme.palette.success.main :
                                      data.attendanceRate > 75 ? theme.palette.warning.main :
                                      theme.palette.error.main,
                            },
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {data.attendanceRate.toFixed(1)}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {data.punctualityRate.toFixed(1)}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {data.averageWorkingHours.toFixed(1)}h
                    </TableCell>
                    <TableCell>
                      {data.totalOvertimeHours > 0 ? (
                        <Chip
                          label={`${data.totalOvertimeHours.toFixed(1)}h`}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          None
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${data.productivityScore.toFixed(0)}/100`}
                        size="small"
                        color={
                          data.productivityScore > 80 ? "success" :
                          data.productivityScore > 60 ? "warning" : "error"
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>        </Paper>
      </Box>
  );
};

export default AttendanceReports;

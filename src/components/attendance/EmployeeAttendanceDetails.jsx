import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  Divider,
  Card,
  CardContent,
  Badge,
} from "@mui/material";
import {
  Edit,
  CheckCircle,
  Cancel,
  Warning,
  Schedule,
  Person,
  AccessTime,
  Coffee,
  ExitToApp,
  WorkOff,
  MoneyOff,
  Timer,
  TrendingUp,
} from "@mui/icons-material";
// TimePicker imports commented out temporarily
// import { TimePicker } from "@mui/x-date-pickers/TimePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const EmployeeAttendanceDetails = ({ selectedDate, employees = [], onUpdateAttendance, selectedBranch, branchName }) => {
  const theme = useTheme();
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editData, setEditData] = useState({});

  const statusConfig = {
    present: { 
      color: theme.palette.success.main, 
      bg: theme.palette.success.light, 
      icon: CheckCircle, 
      label: "Present" 
    },
    late: { 
      color: theme.palette.warning.main, 
      bg: theme.palette.warning.light, 
      icon: Schedule, 
      label: "Late" 
    },
    absent: { 
      color: theme.palette.error.main, 
      bg: theme.palette.error.light, 
      icon: Cancel, 
      label: "Absent" 
    },
    leave: { 
      color: theme.palette.info.main, 
      bg: theme.palette.info.light, 
      icon: WorkOff, 
      label: "On Leave" 
    },
    halfDay: { 
      color: theme.palette.secondary.main, 
      bg: theme.palette.secondary.light, 
      icon: Timer, 
      label: "Half Day" 
    },
    warning: { 
      color: theme.palette.error.dark, 
      bg: theme.palette.error.light, 
      icon: Warning, 
      label: "Warning" 
    },
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    try {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timeString;
    }
  };

  const calculateWorkingHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return "N/A";
    try {
      const start = new Date(`2000-01-01T${checkIn}`);
      const end = new Date(`2000-01-01T${checkOut}`);
      const diff = (end - start) / (1000 * 60 * 60);
      return `${diff.toFixed(1)}h`;
    } catch {
      return "N/A";
    }
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
  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee.userId || employee.id);
    setEditData({
      status: mapBackendStatus(employee.status),
      checkInTime: employee.arrivalTime || "",
      checkOutTime: employee.leaveTime || "",
      notes: employee.notes || "",
    });
  };
  const handleSaveEdit = () => {
    if (onUpdateAttendance) {
      // Send the edited data with mapped status
      const updateData = {
        ...editData,
        status: mapFrontendStatus(editData.status)
      };
      onUpdateAttendance(editingEmployee, updateData);
    }
    setEditingEmployee(null);
    setEditData({});
  };

  const handleCancelEdit = () => {
    setEditingEmployee(null);
    setEditData({});
  };
  const getEmployeeStats = () => {
    const total = employees.length;
    
    // Map backend enum values to frontend status
    const statusMap = {
      'PRESENT': 'present',
      'ABSENT': 'absent',
      'LATE_ARRIVAL': 'late',
      'SHORT_LEAVE': 'leave',
      'EARLY_DEPARTURE': 'halfDay'
    };

    const present = employees.filter(emp => statusMap[emp.status] === 'present').length;
    const late = employees.filter(emp => statusMap[emp.status] === 'late').length;
    const absent = employees.filter(emp => statusMap[emp.status] === 'absent').length;
    const onLeave = employees.filter(emp => statusMap[emp.status] === 'leave').length;
    const halfDay = employees.filter(emp => statusMap[emp.status] === 'halfDay').length;

    return { total, present, late, absent, onLeave, halfDay };
  };

  // Helper function to convert backend status to frontend status
  const mapBackendStatus = (backendStatus) => {
    const statusMap = {
      'PRESENT': 'present',
      'ABSENT': 'absent',
      'LATE_ARRIVAL': 'late',
      'SHORT_LEAVE': 'leave',
      'EARLY_DEPARTURE': 'halfDay'
    };
    return statusMap[backendStatus] || 'absent';
  };

  // Helper function to convert frontend status to backend status
  const mapFrontendStatus = (frontendStatus) => {
    const statusMap = {
      'present': 'PRESENT',
      'absent': 'ABSENT',
      'late': 'LATE_ARRIVAL',
      'leave': 'SHORT_LEAVE',
      'halfDay': 'EARLY_DEPARTURE'
    };
    return statusMap[frontendStatus] || 'ABSENT';
  };

  const stats = getEmployeeStats();

  if (!selectedDate) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Schedule sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Select a date to view employee attendance
        </Typography>
      </Box>
    );
  }

  return (
    <Box>      {/* Header with Date and Stats */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Attendance for {selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Typography>
        {branchName && (
          <Typography variant="h6" color="primary" sx={{ fontWeight: 500, mb: 2 }}>
            {branchName} Branch
          </Typography>
        )}

        {/* Quick Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={2}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <Badge badgeContent={stats.total} color="primary">
                  <Person sx={{ fontSize: 32, color: theme.palette.primary.main }} />
                </Badge>
                <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                  {stats.total}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Employees
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <CheckCircle sx={{ fontSize: 32, color: theme.palette.success.main }} />
                <Typography variant="h6" sx={{ mt: 1, fontWeight: 600, color: theme.palette.success.main }}>
                  {stats.present}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Present
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <Schedule sx={{ fontSize: 32, color: theme.palette.warning.main }} />
                <Typography variant="h6" sx={{ mt: 1, fontWeight: 600, color: theme.palette.warning.main }}>
                  {stats.late}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Late
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <Cancel sx={{ fontSize: 32, color: theme.palette.error.main }} />
                <Typography variant="h6" sx={{ mt: 1, fontWeight: 600, color: theme.palette.error.main }}>
                  {stats.absent}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Absent
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <WorkOff sx={{ fontSize: 32, color: theme.palette.info.main }} />
                <Typography variant="h6" sx={{ mt: 1, fontWeight: 600, color: theme.palette.info.main }}>
                  {stats.onLeave}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  On Leave
                </Typography>
              </CardContent>
            </Card>
          </Grid>          <Grid item xs={12} sm={6} md={2}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <Timer sx={{ fontSize: 32, color: theme.palette.secondary.main }} />
                <Typography variant="h6" sx={{ mt: 1, fontWeight: 600, color: theme.palette.secondary.main }}>
                  {stats.halfDay}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Half Day
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Employee Attendance Table */}
      <Paper elevation={2} sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: theme.palette.grey[50] }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Check In</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Check Out</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Working Hours</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Overtime</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Break Time</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Notes</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>            <TableBody>
              {employees.map((employee) => {
                const mappedStatus = mapBackendStatus(employee.status);
                const statusInfo = statusConfig[mappedStatus] || statusConfig.present;
                const StatusIcon = statusInfo.icon;
                const overtime = calculateOvertime(employee.arrivalTime, employee.leaveTime);

                return (
                  <TableRow 
                    key={employee.id || employee.userId} 
                    hover
                    sx={{
                      '&:hover': {
                        bgcolor: theme.palette.action.hover,
                      }
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ width: 40, height: 40 }}>
                          {(employee.username || employee.name || 'U').charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {employee.username || employee.name || 'Unknown User'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {employee.userEmail || employee.email || 'No email'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        icon={<StatusIcon sx={{ fontSize: 16 }} />}
                        label={statusInfo.label}
                        size="small"
                        sx={{
                          bgcolor: statusInfo.bg,
                          color: statusInfo.color,
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <AccessTime sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                        <Typography variant="body2">
                          {formatTime(employee.arrivalTime)}
                        </Typography>
                      </Box>
                    </TableCell>                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <ExitToApp sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                        <Typography variant="body2">
                          {formatTime(employee.leaveTime)}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {calculateWorkingHours(employee.arrivalTime, employee.leaveTime)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {overtime > 0 ? (
                        <Chip
                          icon={<TrendingUp sx={{ fontSize: 14 }} />}
                          label={`+${overtime.toFixed(1)}h`}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          None
                        </Typography>
                      )}
                    </TableCell>                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Coffee sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                        <Typography variant="body2">
                          {/* Break time is not in the API, show default */}
                          -
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          maxWidth: 150, 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {employee.notes || "-"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEditEmployee(employee)}
                        sx={{ color: theme.palette.primary.main }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Edit Employee Dialog */}
      <Dialog 
        open={editingEmployee !== null} 
        onClose={handleCancelEdit}
        maxWidth="sm"
        fullWidth
      >        <DialogTitle>
          Edit Attendance
          {editingEmployee && (
            <Typography variant="body2" color="text.secondary">
              {employees.find(emp => (emp.userId || emp.id) === editingEmployee)?.username || 
               employees.find(emp => (emp.userId || emp.id) === editingEmployee)?.name || 'Unknown User'}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editData.status || ""}
                  label="Status"
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                >                  <MenuItem value="present">Present</MenuItem>
                  <MenuItem value="late">Late Arrival</MenuItem>
                  <MenuItem value="absent">Absent</MenuItem>
                  <MenuItem value="leave">Short Leave</MenuItem>
                  <MenuItem value="halfDay">Early Departure</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Check In Time"
                type="time"
                value={editData.checkInTime || ""}
                onChange={(e) => setEditData({ ...editData, checkInTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Check Out Time"
                type="time"
                value={editData.checkOutTime || ""}
                onChange={(e) => setEditData({ ...editData, checkOutTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={editData.notes || ""}
                onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeAttendanceDetails;

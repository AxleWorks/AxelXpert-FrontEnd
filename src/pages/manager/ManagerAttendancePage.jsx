import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  useTheme,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,  Chip,
  CircularProgress,
  Snackbar,
  Tooltip,
} from "@mui/material";
import {
  LocationOn,
  Business,
  Refresh,
} from "@mui/icons-material";

import ManagerLayout from "../../layouts/manager/ManagerLayout";
import AttendanceCalendar from "../../components/attendance/AttendanceCalendar";
import EmployeeAttendanceDetails from "../../components/attendance/EmployeeAttendanceDetails";
import { attendanceService } from "../../services/attendanceService";
import { branchService } from "../../services/branchService";
import { useAuth } from "../../contexts/AuthContext";


const ManagerAttendancePage = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeTab, setActiveTab] = useState(0);  const [selectedBranch, setSelectedBranch] = useState(''); // Default to empty until branches load
  const [attendanceData, setAttendanceData] = useState({});
  const [calendarData, setCalendarData] = useState([]);
  const [branches, setBranches] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load calendar data when branch changes
  useEffect(() => {
    if (selectedBranch) {
      loadCalendarData();
    }
  }, [selectedBranch]);

  // Load attendance details when date is selected
  useEffect(() => {
    if (selectedDate && selectedBranch) {
      loadAttendanceDetails();
    }
  }, [selectedDate, selectedBranch]);  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For managers, only load their assigned branch
      if (user && user.role === 'manager' && user.branchId) {
        // Set the manager's branch as the selected branch
        setSelectedBranch(user.branchId);
          // Load only the manager's branch data
        try {
          const branchData = await branchService.getBranchById(user.branchId);
          setBranches(branchData ? [branchData] : []);
        } catch (branchErr) {
          console.error('Error loading manager branch:', branchErr);
          setBranches([]);
          setError('Failed to load your branch information.');
        }      } else {
        // For admins or other roles, load all branches
        const branchesData = await branchService.getAllBranches();
        setBranches(Array.isArray(branchesData) ? branchesData : []);
        
        // Set default branch if not set
        if (Array.isArray(branchesData) && branchesData.length > 0 && !selectedBranch) {
          setSelectedBranch(branchesData[0].id);
        }
      }
      
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Failed to load branches. Please ensure you are logged in and the server is running.');
    } finally {
      setLoading(false);
    }
  };const loadCalendarData = async () => {
    try {
      setLoading(true);
      
      // Get current month's start and end dates
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      const calendarResponse = await attendanceService.getAttendanceCalendarData(
        selectedBranch,
        attendanceService.formatDateForAPI(startDate),
        attendanceService.formatDateForAPI(endDate)
      );
      
      setCalendarData(calendarResponse || []);
      
    } catch (err) {
      console.error('Error loading calendar data:', err);
      setError('Failed to load calendar data. Please ensure you are logged in and the server is running.');
    } finally {
      setLoading(false);
    }
  };  const loadAttendanceDetails = async () => {
    try {
      setLoading(true);
      
      const dateStr = attendanceService.formatDateForAPI(selectedDate);
      
      // Fetch all employees for the branch
      const allEmployees = await branchService.getEmployeesByBranch(selectedBranch);
      
      // Fetch attendance data for the selected date
      const attendanceData = await attendanceService.getAttendanceByBranchAndDate(
        selectedBranch,
        dateStr
      );
      
      // Create a map of attendance data by employee ID for quick lookup
      const attendanceMap = {};
      (attendanceData || []).forEach(record => {
        attendanceMap[record.userId] = record;
      });
      
      // Merge all employees with their attendance data
      const mergedEmployees = (allEmployees || []).map(employee => {
        const attendanceRecord = attendanceMap[employee.id];
        return {
          // Employee data
          userId: employee.id,
          username: employee.username,
          email: employee.email,
          firstName: employee.firstName,
          lastName: employee.lastName,
          role: employee.role,
          
          // Attendance data (if exists)
          id: attendanceRecord?.id || null,
          arrivalTime: attendanceRecord?.arrivalTime || null,
          leaveTime: attendanceRecord?.leaveTime || null,
          status: attendanceRecord?.status || 'ABSENT',
          notes: attendanceRecord?.notes || '',
          date: attendanceRecord?.date || dateStr,
          
          // Indicate if this is a new record (no existing attendance)
          isNewRecord: !attendanceRecord
        };
      });
      
      setEmployees(mergedEmployees);
      
    } catch (err) {
      console.error('Error loading attendance details:', err);
      setError('Failed to load attendance details. Please ensure you are logged in and the server is running.');
    } finally {
      setLoading(false);
    }
  };
  const refreshData = () => {
    loadCalendarData();
    if (selectedDate) {
      loadAttendanceDetails();
    }
  };
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setActiveTab(1); // Switch to employee details tab
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const handleBranchChange = (event) => {
    // Only allow branch change if user is not a manager
    if (user && user.role === 'manager') {
      return; // Prevent branch change for managers
    }
    setSelectedBranch(event.target.value);
    setSelectedDate(null); // Reset selected date when branch changes
    setActiveTab(0); // Go back to calendar view
  };
  const handleUpdateAttendance = async (employeeId, updatedData) => {
    try {
      setLoading(true);
      
      // Find the employee record
      const employeeRecord = employees.find(emp => emp.userId === employeeId);
      
      if (employeeRecord) {
        // Map frontend status to backend enum
        const statusMap = {
          'present': 'PRESENT',
          'absent': 'ABSENT',
          'late': 'LATE_ARRIVAL',
          'leave': 'SHORT_LEAVE',
          'halfDay': 'EARLY_DEPARTURE'
        };

        const payload = {
          userId: employeeId,
          date: attendanceService.formatDateForAPI(selectedDate),
          arrivalTime: attendanceService.formatTimeForAPI(updatedData.checkInTime),
          leaveTime: attendanceService.formatTimeForAPI(updatedData.checkOutTime),
          status: statusMap[updatedData.status] || updatedData.status,
          notes: updatedData.notes || ''
        };

        if (employeeRecord.isNewRecord) {
          // Create new attendance record
          await attendanceService.createAttendance(payload);
          setSuccess('Attendance record created successfully!');
        } else {
          // Update existing attendance record
          await attendanceService.updateAttendance(employeeRecord.id, payload);
          setSuccess('Attendance updated successfully!');
        }
        
        // Refresh the attendance data
        await loadAttendanceDetails();
      }
      
    } catch (err) {
      console.error('Error updating attendance:', err);
      setError('Failed to update attendance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentBranch = () => {
    return branches.find(branch => branch.id === selectedBranch);
  };

  const processCalendarData = () => {
    // Convert calendar data to the format expected by the calendar component
    const processedData = {};
    
    calendarData.forEach(dayData => {
      const dateKey = dayData.date;
      processedData[dateKey] = {
        totalEmployees: dayData.totalEmployees,
        presentCount: dayData.presentCount,
        absentCount: dayData.absentCount,
        shortLeaveCount: dayData.shortLeaveCount,
        lateArrivalCount: dayData.lateArrivalCount,
        earlyDepartureCount: dayData.earlyDepartureCount
      };
    });
    
    return processedData;
  };
  const getCurrentBranchEmployees = () => {
    return employees || [];
  };

  const getBranchAttendanceData = () => {
    return processCalendarData();
  };

  const getSelectedDateEmployees = () => {
    return employees || [];
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleCloseSuccess = () => {
    setSuccess(null);
  };

  return (
    <ManagerLayout>
      <Container maxWidth="xl" sx={{ py: 3 }}>        {/* Page Header */}        {/* Error and Success Messages */}
        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar 
          open={!!success} 
          autoHideDuration={4000} 
          onClose={handleCloseSuccess}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Employee Attendance Management
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                Track and manage employee attendance, punctuality, and working hours
              </Typography>
              {user && user.role === 'manager' && (
                <Chip
                  label={`Manager View - ${getCurrentBranch()?.name || 'Your Branch'}`}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                />
              )}
            </Box>

            {/* Refresh Button */}
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={refreshData}
              disabled={loading}
              sx={{ mr: 2 }}
            >
              Refresh
            </Button>            {/* Branch Selection */}
            <Box sx={{ minWidth: 280 }}>
              {!loading && branches.length > 0 ? (
                <Tooltip 
                  title={user && user.role === 'manager' ? 'Managers can only view their assigned branch' : ''} 
                  arrow
                >
                  <FormControl fullWidth size="medium">
                  <InputLabel 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Business sx={{ fontSize: 20 }} />
                    {user && user.role === 'manager' ? 'Your Branch' : 'Select Branch'}
                  </InputLabel>
                  <Select
                    value={selectedBranch}
                    label={user && user.role === 'manager' ? 'Your Branch' : 'Select Branch'}
                    onChange={handleBranchChange}
                    disabled={user && user.role === 'manager'}
                    sx={{
                      '& .MuiSelect-select': {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                      },
                      ...(user && user.role === 'manager' && {
                        backgroundColor: theme.palette.action.disabled,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.action.disabled,
                        }
                      })
                    }}
                  >{branches && branches.length > 0 && branches.map((branch) => (
                    branch && branch.id ? (
                      <MenuItem key={branch.id} value={branch.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                          <LocationOn sx={{ fontSize: 20, color: theme.palette.primary.main }} />
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {branch.name || 'Unknown Branch'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {branch.location || 'No location'}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ) : null
                  ))}
                </Select>              </FormControl>
              </Tooltip>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 56 }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    Loading branches...
                  </Typography>
                </Box>
              )}
                {/* Current Branch Indicator */}
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  icon={<Business sx={{ fontSize: 16 }} />}
                  label={`Current: ${getCurrentBranch()?.name || 'Loading...'}`}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
                {selectedDate && (
                  <Typography variant="caption" color="text.secondary">
                    {getCurrentBranchEmployees().length} employees
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Paper elevation={1} sx={{ borderRadius: 3 }}>          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              px: 3,
              pt: 2,
            }}
          >
            <Tab 
              label="Calendar View" 
              sx={{ textTransform: "none", fontWeight: 600 }}
            />            <Tab 
              label={`Employee Management${selectedDate ? ` - ${selectedDate.toLocaleDateString()}` : ''}`}
              sx={{ textTransform: "none", fontWeight: 600 }}
              disabled={!selectedDate}
            />
          </Tabs>          <Box sx={{ p: 3 }}>
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {!loading && activeTab === 0 && (
              <Box>
                <AttendanceCalendar
                  onDateSelect={handleDateSelect}
                  selectedDate={selectedDate}
                  attendanceData={getBranchAttendanceData()}
                  selectedBranch={selectedBranch}
                  branchName={getCurrentBranch()?.name}
                />
              </Box>
            )}            {!loading && activeTab === 1 && (
              <Box>
                {selectedDate ? (
                  <>                    {/* Debug info - remove in production */}
                    {process.env.NODE_ENV === 'development' && (
                      <Box sx={{ mb: 2, p: 2, bgcolor: theme.palette.grey[100], borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                          Debug: {employees.length} employees loaded for {selectedDate.toDateString()} in branch {selectedBranch}
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block' }}>
                          New records: {employees.filter(emp => emp.isNewRecord).length}, 
                          Existing records: {employees.filter(emp => !emp.isNewRecord).length}
                        </Typography>
                      </Box>
                    )}                    {employees.length > 0 ? (
                      <EmployeeAttendanceDetails
                        selectedDate={selectedDate}
                        employees={getSelectedDateEmployees()}
                        onUpdateAttendance={handleUpdateAttendance}
                        selectedBranch={selectedBranch}
                        branchName={getCurrentBranch()?.name}
                      />
                    ) : (
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        py: 8,
                        textAlign: 'center'
                      }}>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                          No Employees Found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          No employees are assigned to {getCurrentBranch()?.name || 'this branch'} yet.
                        </Typography>
                      </Box>
                    )}
                  </>
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    py: 8,
                    textAlign: 'center'
                  }}>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                      Select a Date to Manage Employee Attendance
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Click on any date in the calendar to view and edit employee attendance for that day
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => setActiveTab(0)}
                      sx={{ mt: 3 }}
                    >
                      Go to Calendar
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </ManagerLayout>
  );
};

export default ManagerAttendancePage;

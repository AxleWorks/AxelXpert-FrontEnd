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
  MenuItem,
  Chip,
  CircularProgress,
  Snackbar,
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


const ManagerAttendancePage = () => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState(''); // Default to empty until branches load
  const [attendanceData, setAttendanceData] = useState({});
  const [calendarData, setCalendarData] = useState([]);
  const [branches, setBranches] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
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
      
      // Load branches from API
      const branchesData = await branchService.getAllBranches();
      setBranches(branchesData);
      
      // Set default branch if not set
      if (branchesData.length > 0 && !selectedBranch) {
        setSelectedBranch(branchesData[0].id);
      }
      
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Failed to load branches. Please ensure you are logged in and the server is running.');
    } finally {
      setLoading(false);
    }
  };  const loadCalendarData = async () => {
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
      const attendanceResponse = await attendanceService.getAttendanceByBranchAndDate(
        selectedBranch,
        dateStr
      );
      
      setEmployees(attendanceResponse || []);
      
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
    setSelectedBranch(event.target.value);
    setSelectedDate(null); // Reset selected date when branch changes
    setActiveTab(0); // Go back to calendar view
  };

  const handleUpdateAttendance = async (employeeId, updatedData) => {
    try {
      setLoading(true);
      
      // Find the attendance record to update
      const attendanceRecord = employees.find(emp => emp.userId === employeeId);
      
      if (attendanceRecord) {
        // Map frontend status to backend enum
        const statusMap = {
          'present': 'PRESENT',
          'absent': 'ABSENT',
          'late': 'LATE_ARRIVAL',
          'leave': 'SHORT_LEAVE',
          'halfDay': 'EARLY_DEPARTURE'
        };

        const updatePayload = {
          arrivalTime: attendanceService.formatTimeForAPI(updatedData.checkInTime),
          leaveTime: attendanceService.formatTimeForAPI(updatedData.checkOutTime),
          status: statusMap[updatedData.status] || updatedData.status,
          notes: updatedData.notes || ''
        };

        await attendanceService.updateAttendance(attendanceRecord.id, updatePayload);
        
        // Refresh the attendance data
        await loadAttendanceDetails();
        
        setSuccess('Attendance updated successfully!');
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Employee Attendance Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track and manage employee attendance, punctuality, and working hours
              </Typography>
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
            </Button>
            
            {/* Branch Selection */}
            <Box sx={{ minWidth: 280 }}>
              <FormControl fullWidth size="medium">
                <InputLabel 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Business sx={{ fontSize: 20 }} />
                  Select Branch
                </InputLabel>
                <Select
                  value={selectedBranch}
                  label="Select Branch"
                  onChange={handleBranchChange}
                  sx={{
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                    }
                  }}
                >
                  {branches.map((branch) => (
                    <MenuItem key={branch.id} value={branch.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                        <LocationOn sx={{ fontSize: 20, color: theme.palette.primary.main }} />
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {branch.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {branch.location}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
              label={`Employee Details${selectedDate ? ` - ${selectedDate.toLocaleDateString()}` : ''}`}
              sx={{ textTransform: "none", fontWeight: 600 }}
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
            )}

            {!loading && activeTab === 1 && (
              <Box>
                <EmployeeAttendanceDetails
                  selectedDate={selectedDate}
                  employees={getSelectedDateEmployees()}
                  onUpdateAttendance={handleUpdateAttendance}
                  selectedBranch={selectedBranch}
                  branchName={getCurrentBranch()?.name}
                />
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </ManagerLayout>
  );
};

export default ManagerAttendancePage;

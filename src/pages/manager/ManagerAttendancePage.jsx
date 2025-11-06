import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Snackbar,
  Tooltip,
} from "@mui/material";
import { LocationOn, Business, Refresh } from "@mui/icons-material";

import ManagerLayout from "../../layouts/manager/ManagerLayout";
import AttendanceCalendar from "../../components/attendance/AttendanceCalendar";
import EmployeeAttendanceDetails from "../../components/attendance/EmployeeAttendanceDetails";
import { attendanceService } from "../../services/attendanceService";
import { branchService } from "../../services/branchService";
import { useAuth } from "../../contexts/AuthContext";
import { authenticatedAxios as axios } from "../../utils/axiosConfig";

const ManagerAttendancePage = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [calendarData, setCalendarData] = useState([]);
  const [branches, setBranches] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedBranch) loadCalendarData();
  }, [selectedBranch]);

  useEffect(() => {
    if (selectedDate && selectedBranch) loadAttendanceDetails();
  }, [selectedDate, selectedBranch]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (user && user.role === "manager" && user.branchId) {
        setSelectedBranch(user.branchId);

        try {
          const branchData = await branchService.getBranchById(user.branchId);
          setBranches(branchData ? [branchData] : []);
        } catch {
          setBranches([]);
          setError("Failed to load your branch information.");
        }
      } else {
        const branchesData = await branchService.getAllBranches();
        setBranches(Array.isArray(branchesData) ? branchesData : []);

        if (
          Array.isArray(branchesData) &&
          branchesData.length > 0 &&
          !selectedBranch
        ) {
          setSelectedBranch(branchesData[0].id);
        }
      }
    } catch {
      setError("Failed to load branches. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadCalendarData = async () => {
    try {
      setLoading(true);

      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const calendarResponse =
        await attendanceService.getAttendanceCalendarData(
          selectedBranch,
          attendanceService.formatDateForAPI(startDate),
          attendanceService.formatDateForAPI(endDate)
        );

      setCalendarData(calendarResponse || []);
    } catch {
      setError("Failed to load calendar data.");
    } finally {
      setLoading(false);
    }
  };

  const loadAttendanceDetails = async () => {
    try {
      setLoading(true);

      const dateStr = attendanceService.formatDateForAPI(selectedDate);

      let allEmployees = [];
      try {
        const employeesResponse = await axios.get("/api/users/employees");
        allEmployees = employeesResponse.data.filter(
          (emp) => emp.branchId === selectedBranch
        );
      } catch {
        try {
          allEmployees = await branchService.getEmployeesByBranch(
            selectedBranch
          );
        } catch {}
      }

      const attendanceData =
        await attendanceService.getAttendanceByBranchAndDate(
          selectedBranch,
          dateStr
        );

      const attendanceMap = {};
      (attendanceData || []).forEach((record) => {
        attendanceMap[record.userId] = record;
      });

      const mergedEmployees = (allEmployees || []).map((employee) => {
        const attendanceRecord = attendanceMap[employee.id];

        return {
          userId: employee.id,
          username: employee.username,
          email: employee.email,
          firstName: employee.firstName,
          lastName: employee.lastName,
          role: employee.role,
          id: attendanceRecord?.id || null,
          arrivalTime: attendanceRecord?.arrivalTime || null,
          leaveTime: attendanceRecord?.leaveTime || null,
          status: attendanceRecord?.status || "ABSENT",
          notes: attendanceRecord?.notes || "",
          date: attendanceRecord?.date || dateStr,
          isNewRecord: !attendanceRecord,
        };
      });

      setEmployees(mergedEmployees);
    } catch {
      setError("Failed to load attendance details.");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadCalendarData();
    if (selectedDate) loadAttendanceDetails();
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setActiveTab(1);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleBranchChange = (event) => {
    if (user && user.role === "manager") return;
    setSelectedBranch(event.target.value);
    setSelectedDate(null);
    setActiveTab(0);
  };

  const handleUpdateAttendance = async (employeeId, updatedData) => {
    try {
      setLoading(true);

      const employeeRecord = employees.find(
        (emp) => emp.userId === employeeId
      );

      if (employeeRecord) {
        const statusMap = {
          present: "PRESENT",
          absent: "ABSENT",
          late: "LATE_ARRIVAL",
          leave: "SHORT_LEAVE",
          halfDay: "EARLY_DEPARTURE",
        };

        const payload = {
          userId: employeeId,
          date: attendanceService.formatDateForAPI(selectedDate),
          arrivalTime: attendanceService.formatTimeForAPI(
            updatedData.checkInTime
          ),
          leaveTime: attendanceService.formatTimeForAPI(
            updatedData.checkOutTime
          ),
          status: statusMap[updatedData.status] || updatedData.status,
          notes: updatedData.notes || "",
        };

        if (employeeRecord.isNewRecord) {
          await attendanceService.createAttendance(payload);
          setSuccess("Attendance record created successfully!");
        } else {
          await attendanceService.updateAttendance(employeeRecord.id, payload);
          setSuccess("Attendance updated successfully!");
        }

        await loadAttendanceDetails();
      }
    } catch {
      setError("Failed to update attendance.");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentBranch = () => {
    return branches.find((branch) => branch.id === selectedBranch);
  };

  const processCalendarData = () => {
    const processed = {};
    calendarData.forEach((day) => {
      processed[day.date] = {
        totalEmployees: day.totalEmployees,
        presentCount: day.presentCount,
        absentCount: day.absentCount,
        shortLeaveCount: day.shortLeaveCount,
        lateArrivalCount: day.lateArrivalCount,
        earlyDepartureCount: day.earlyDepartureCount,
      };
    });
    return processed;
  };

  const handleCloseError = () => setError(null);
  const handleCloseSuccess = () => setSuccess(null);

  return (
    <ManagerLayout>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity="error">{error}</Alert>
        </Snackbar>

        <Snackbar
          open={!!success}
          autoHideDuration={4000}
          onClose={handleCloseSuccess}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity="success">{success}</Alert>
        </Snackbar>

        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 3,
              gap: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Employee Attendance Management
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Track and manage employee attendance, punctuality, and hours
              </Typography>

              {user?.role === "manager" && getCurrentBranch() && (
                <Chip
                  label={`Manager View - ${getCurrentBranch().name}`}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                />
              )}
              {user?.role === "admin" && (
                <Chip
                  label="Administrator - All Branches Access"
                  color="error"
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                />
              )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={refreshData}
                disabled={loading}
                size="small"
                sx={{ borderRadius: 2 }}
              >
                Refresh
              </Button>

              <Box sx={{ minWidth: 240 }}>
                {!loading && branches.length > 0 ? (
                  <Tooltip
                    title={
                      user?.role === "manager"
                        ? "Managers cannot change branch"
                        : ""
                    }
                    arrow
                  >
                    <FormControl fullWidth size="small">
                      <InputLabel>
                        {user?.role === "manager"
                          ? "Your Branch"
                          : "Select Branch"}
                      </InputLabel>
                      <Select
                        value={selectedBranch}
                        onChange={handleBranchChange}
                        disabled={user?.role === "manager"}
                        startAdornment={<Business sx={{ mr: 1 }} />}
                      >
                        {branches.map((branch) => (
                          <MenuItem key={branch.id} value={branch.id}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                              }}
                            >
                              <LocationOn color="primary" />
                              <Box>
                                <Typography>{branch.name}</Typography>
                                <Typography variant="caption">
                                  {branch.location}
                                </Typography>
                              </Box>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Tooltip>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: 40,
                      px: 2,
                    }}
                  >
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    <Typography>Loading...</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        <Paper sx={{ borderRadius: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{ borderBottom: 1, borderColor: "divider", px: 3, pt: 2 }}
          >
            <Tab label="Calendar View" sx={{ fontWeight: 600 }} />
            <Tab
              label={
                selectedDate
                  ? `Employee Management - ${selectedDate.toLocaleDateString()}`
                  : "Employee Management"
              }
              sx={{ fontWeight: 600 }}
              disabled={!selectedDate}
            />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {!loading && activeTab === 0 && (
              <AttendanceCalendar
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
                attendanceData={processCalendarData()}
                selectedBranch={selectedBranch}
                branchName={getCurrentBranch()?.name}
              />
            )}

            {!loading && activeTab === 1 && (
              <>
                {selectedDate ? (
                  employees.length > 0 ? (
                    <EmployeeAttendanceDetails
                      selectedDate={selectedDate}
                      employees={employees}
                      onUpdateAttendance={handleUpdateAttendance}
                      selectedBranch={selectedBranch}
                      branchName={getCurrentBranch()?.name}
                    />
                  ) : (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                      <Typography variant="h6" color="text.secondary">
                        No Employees Found
                      </Typography>
                      <Typography color="text.secondary">
                        No employees assigned to this branch.
                      </Typography>
                    </Box>
                  )
                ) : (
                  <Box sx={{ textAlign: "center", py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                      Select a date to manage attendance
                    </Typography>
                    <Button
                      variant="outlined"
                      sx={{ mt: 3 }}
                      onClick={() => setActiveTab(0)}
                    >
                      Go to Calendar
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Paper>
      </Container>
    </ManagerLayout>
  );
};

export default ManagerAttendancePage;

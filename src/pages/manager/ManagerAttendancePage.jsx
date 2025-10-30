import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  useTheme,  Button,
  Alert,
} from "@mui/material";

import ManagerLayout from "../../layouts/manager/ManagerLayout";
import AttendanceCalendar from "../../components/attendance/AttendanceCalendar";
import EmployeeAttendanceDetails from "../../components/attendance/EmployeeAttendanceDetails";
import AttendanceStatistics from "../../components/attendance/AttendanceStatistics";
import AttendanceReports from "../../components/attendance/AttendanceReports";

const ManagerAttendancePage = () => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeTab, setActiveTab] = useState(0);  const [attendanceData, setAttendanceData] = useState({});
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data - Replace with actual API calls
  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    // Mock employees data
    const mockEmployees = [
      {
        id: "EMP001",
        name: "John Doe",
        employeeId: "EMP001",
        department: "Technical",
        position: "Senior Mechanic",
        email: "john.doe@axelxpert.com",
        phone: "+1234567890",
        avatar: null,
      },
      {
        id: "EMP002", 
        name: "Jane Smith",
        employeeId: "EMP002",
        department: "Customer Service",
        position: "Service Advisor",
        email: "jane.smith@axelxpert.com",
        phone: "+1234567891",
        avatar: null,
      },
      {
        id: "EMP003",
        name: "Mike Johnson",
        employeeId: "EMP003", 
        department: "Technical",
        position: "Technician",
        email: "mike.johnson@axelxpert.com",
        phone: "+1234567892",
        avatar: null,
      },
      {
        id: "EMP004",
        name: "Sarah Wilson",
        employeeId: "EMP004",
        department: "Administration",
        position: "HR Manager",
        email: "sarah.wilson@axelxpert.com",
        phone: "+1234567893",
        avatar: null,
      },
      {
        id: "EMP005",
        name: "David Brown",
        employeeId: "EMP005",
        department: "Technical",
        position: "Junior Mechanic",
        email: "david.brown@axelxpert.com",
        phone: "+1234567894",
        avatar: null,
      },
    ];

    // Mock attendance data for the past month
    const mockAttendanceData = {};
    const today = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      
      // Skip weekends for attendance
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        mockAttendanceData[dateKey] = {
          employees: mockEmployees.map(emp => {
            const randomStatus = Math.random();
            let status, checkInTime, checkOutTime, notes = "";
            
            if (randomStatus > 0.9) {
              status = "absent";
              checkInTime = null;
              checkOutTime = null;
              notes = "Sick leave";
            } else if (randomStatus > 0.8) {
              status = "leave";
              checkInTime = null;
              checkOutTime = null;
              notes = "Planned leave";
            } else if (randomStatus > 0.7) {
              status = "late";
              checkInTime = "09:30:00";
              checkOutTime = "18:30:00";
              notes = "Traffic delay";
            } else if (randomStatus > 0.05) {
              status = "present";
              checkInTime = "08:00:00";
              checkOutTime = Math.random() > 0.3 ? "17:00:00" : "19:00:00";
              notes = "";
            } else {
              status = "warning";
              checkInTime = "10:00:00";
              checkOutTime = "17:00:00";
              notes = "Multiple late arrivals this week";
            }
            
            return {
              ...emp,
              status,
              checkInTime,
              checkOutTime,
              breakTime: Math.floor(Math.random() * 30) + 30, // 30-60 minutes
              notes,
              warningReason: status === 'warning' ? "Frequent tardiness" : "",
            };
          }),
        };
      }
    }

    setEmployees(mockEmployees);
    setAttendanceData(mockAttendanceData);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setActiveTab(1); // Switch to employee details tab
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleUpdateAttendance = (employeeId, updatedData) => {
    if (!selectedDate) return;
    
    const dateKey = selectedDate.toISOString().split('T')[0];
    const updatedAttendanceData = { ...attendanceData };
    
    if (updatedAttendanceData[dateKey]) {
      const employeeIndex = updatedAttendanceData[dateKey].employees.findIndex(
        emp => emp.id === employeeId
      );
      
      if (employeeIndex !== -1) {
        updatedAttendanceData[dateKey].employees[employeeIndex] = {
          ...updatedAttendanceData[dateKey].employees[employeeIndex],
          ...updatedData,
        };
        
        setAttendanceData(updatedAttendanceData);
      }
    }
  };

  const getSelectedDateEmployees = () => {
    if (!selectedDate) return [];
    const dateKey = selectedDate.toISOString().split('T')[0];
    return attendanceData[dateKey]?.employees || [];
  };

  return (
    <ManagerLayout>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Employee Attendance Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage employee attendance, punctuality, and working hours
          </Typography>
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
          </Tabs>

          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              <Box>
                <AttendanceCalendar
                  onDateSelect={handleDateSelect}
                  selectedDate={selectedDate}
                  attendanceData={attendanceData}
                />
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <EmployeeAttendanceDetails
                  selectedDate={selectedDate}
                  employees={getSelectedDateEmployees()}
                  onUpdateAttendance={handleUpdateAttendance}
                />
              </Box>            )}
          </Box>
        </Paper>
      </Container>
    </ManagerLayout>
  );
};

export default ManagerAttendancePage;

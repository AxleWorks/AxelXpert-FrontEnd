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
} from "@mui/material";
import {
  LocationOn,
  Business,
} from "@mui/icons-material";

import ManagerLayout from "../../layouts/manager/ManagerLayout";
import AttendanceCalendar from "../../components/attendance/AttendanceCalendar";
import EmployeeAttendanceDetails from "../../components/attendance/EmployeeAttendanceDetails";
import AttendanceStatistics from "../../components/attendance/AttendanceStatistics";
import AttendanceReports from "../../components/attendance/AttendanceReports";

const ManagerAttendancePage = () => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState('kiribathgoda'); // Default to Kiribathgoda
  const [attendanceData, setAttendanceData] = useState({});
  const [allEmployees, setAllEmployees] = useState({}); // Store employees by branch
  const [loading, setLoading] = useState(false);

  // Available branches
  const branches = [
    { id: 'kiribathgoda', name: 'Kiribathgoda', location: 'Kiribathgoda, Gampaha' },
    { id: 'galle', name: 'Galle', location: 'Galle, Southern Province' },
    { id: 'kandy', name: 'Kandy', location: 'Kandy, Central Province' },
    { id: 'negombo', name: 'Negombo', location: 'Negombo, Western Province' },
  ];

  // Mock data - Replace with actual API calls
  useEffect(() => {
    loadMockData();
  }, []);
  const loadMockData = () => {
    // Mock employees data by branch
    const mockEmployeesByBranch = {
      kiribathgoda: [
        {
          id: "KIR001",
          name: "John Doe",
          employeeId: "KIR001",
          department: "Technical",
          position: "Senior Mechanic",
          email: "john.doe@axelxpert.com",
          phone: "+1234567890",
          avatar: null,
          branch: "kiribathgoda",
        },
        {
          id: "KIR002", 
          name: "Jane Smith",
          employeeId: "KIR002",
          department: "Customer Service",
          position: "Service Advisor",
          email: "jane.smith@axelxpert.com",
          phone: "+1234567891",
          avatar: null,
          branch: "kiribathgoda",
        },
        {
          id: "KIR003",
          name: "Mike Johnson",
          employeeId: "KIR003", 
          department: "Technical",
          position: "Technician",
          email: "mike.johnson@axelxpert.com",
          phone: "+1234567892",
          avatar: null,
          branch: "kiribathgoda",
        },
        {
          id: "KIR004",
          name: "Sarah Wilson",
          employeeId: "KIR004",
          department: "Administration",
          position: "HR Manager",
          email: "sarah.wilson@axelxpert.com",
          phone: "+1234567893",
          avatar: null,
          branch: "kiribathgoda",
        },
        {
          id: "KIR005",
          name: "David Brown",
          employeeId: "KIR005",
          department: "Technical",
          position: "Junior Mechanic",
          email: "david.brown@axelxpert.com",
          phone: "+1234567894",
          avatar: null,
          branch: "kiribathgoda",
        },
      ],
      galle: [
        {
          id: "GAL001",
          name: "Priya Fernando",
          employeeId: "GAL001",
          department: "Technical",
          position: "Senior Mechanic",
          email: "priya.fernando@axelxpert.com",
          phone: "+9471234567",
          avatar: null,
          branch: "galle",
        },
        {
          id: "GAL002",
          name: "Kasun Perera",
          employeeId: "GAL002",
          department: "Customer Service",
          position: "Service Advisor",
          email: "kasun.perera@axelxpert.com",
          phone: "+9471234568",
          avatar: null,
          branch: "galle",
        },
        {
          id: "GAL003",
          name: "Nilani Silva",
          employeeId: "GAL003",
          department: "Technical",
          position: "Technician",
          email: "nilani.silva@axelxpert.com",
          phone: "+9471234569",
          avatar: null,
          branch: "galle",
        },
        {
          id: "GAL004",
          name: "Ruwan Kumara",
          employeeId: "GAL004",
          department: "Administration",
          position: "Branch Manager",
          email: "ruwan.kumara@axelxpert.com",
          phone: "+9471234570",
          avatar: null,
          branch: "galle",
        },
      ],
      kandy: [
        {
          id: "KAN001",
          name: "Chamara Jayasinghe",
          employeeId: "KAN001",
          department: "Technical",
          position: "Senior Mechanic",
          email: "chamara.jayasinghe@axelxpert.com",
          phone: "+9478123456",
          avatar: null,
          branch: "kandy",
        },
        {
          id: "KAN002",
          name: "Anusha Rathnayake",
          employeeId: "KAN002",
          department: "Customer Service",
          position: "Service Advisor",
          email: "anusha.rathnayake@axelxpert.com",
          phone: "+9478123457",
          avatar: null,
          branch: "kandy",
        },
        {
          id: "KAN003",
          name: "Tharindu Wickramasinghe",
          employeeId: "KAN003",
          department: "Technical",
          position: "Technician",
          email: "tharindu.wickramasinghe@axelxpert.com",
          phone: "+9478123458",
          avatar: null,
          branch: "kandy",
        },
      ],
      negombo: [
        {
          id: "NEG001",
          name: "Ishara Mendis",
          employeeId: "NEG001",
          department: "Technical",
          position: "Senior Mechanic",
          email: "ishara.mendis@axelxpert.com",
          phone: "+9477123456",
          avatar: null,
          branch: "negombo",
        },
        {
          id: "NEG002",
          name: "Lakshani Gunawardena",
          employeeId: "NEG002",
          department: "Customer Service",
          position: "Service Advisor",
          email: "lakshani.gunawardena@axelxpert.com",
          phone: "+9477123457",
          avatar: null,
          branch: "negombo",
        },
      ],
    };    // Mock attendance data for the past month
    const mockAttendanceData = {};
    const today = new Date();
    
    // Generate attendance data for each branch
    branches.forEach(branch => {
      mockAttendanceData[branch.id] = {};
      
      for (let i = 30; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        
        // Skip weekends for attendance
        if (date.getDay() !== 0 && date.getDay() !== 6) {
          mockAttendanceData[branch.id][dateKey] = {
            employees: mockEmployeesByBranch[branch.id].map(emp => {
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
    });

    setAllEmployees(mockEmployeesByBranch);
    setAttendanceData(mockAttendanceData);
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
  const handleUpdateAttendance = (employeeId, updatedData) => {
    if (!selectedDate || !selectedBranch) return;
    
    const dateKey = selectedDate.toISOString().split('T')[0];
    const updatedAttendanceData = { ...attendanceData };
    
    if (updatedAttendanceData[selectedBranch] && updatedAttendanceData[selectedBranch][dateKey]) {
      const employeeIndex = updatedAttendanceData[selectedBranch][dateKey].employees.findIndex(
        emp => emp.id === employeeId
      );
      
      if (employeeIndex !== -1) {
        updatedAttendanceData[selectedBranch][dateKey].employees[employeeIndex] = {
          ...updatedAttendanceData[selectedBranch][dateKey].employees[employeeIndex],
          ...updatedData,
        };
        
        setAttendanceData(updatedAttendanceData);
      }
    }
  };

  const getSelectedDateEmployees = () => {
    if (!selectedDate || !selectedBranch) return [];
    const dateKey = selectedDate.toISOString().split('T')[0];
    return attendanceData[selectedBranch]?.[dateKey]?.employees || [];
  };

  const getCurrentBranchEmployees = () => {
    return allEmployees[selectedBranch] || [];
  };

  const getBranchAttendanceData = () => {
    return attendanceData[selectedBranch] || {};
  };

  return (
    <ManagerLayout>
      <Container maxWidth="xl" sx={{ py: 3 }}>        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Employee Attendance Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track and manage employee attendance, punctuality, and working hours
              </Typography>
            </Box>
            
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
                  label={`Current: ${branches.find(b => b.id === selectedBranch)?.name}`}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
                <Typography variant="caption" color="text.secondary">
                  {getCurrentBranchEmployees().length} employees
                </Typography>
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
          </Tabs>

          <Box sx={{ p: 3 }}>            {activeTab === 0 && (
              <Box>
                <AttendanceCalendar
                  onDateSelect={handleDateSelect}
                  selectedDate={selectedDate}
                  attendanceData={getBranchAttendanceData()}
                  selectedBranch={selectedBranch}
                  branchName={branches.find(b => b.id === selectedBranch)?.name}
                />
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <EmployeeAttendanceDetails
                  selectedDate={selectedDate}
                  employees={getSelectedDateEmployees()}
                  onUpdateAttendance={handleUpdateAttendance}
                  selectedBranch={selectedBranch}
                  branchName={branches.find(b => b.id === selectedBranch)?.name}
                />
              </Box>            )}
          </Box>
        </Paper>
      </Container>
    </ManagerLayout>
  );
};

export default ManagerAttendancePage;

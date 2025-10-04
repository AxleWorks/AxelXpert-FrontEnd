import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Button,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
  Chip,
  Stack,
  Badge,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Today as TodayIcon,
  Search as SearchIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import ManagerLayout from "../../layouts/manager/ManagerLayout";
import { useTheme } from "@mui/material/styles";
import CalendarHeader from "../../components/calendar/Booking_Manage/CalendarHeader";
import CalendarGrid from "../../components/calendar/Booking_Manage/CalendarGrid";
import AppointmentPopup from "../../components/calendar/Booking_Manage/AppointmentPopup";

// Small contract
// - Inputs: none (demo data inside). Branch & filters control displayed appointments.
// - Outputs: UI to inspect, approve (assign employee), reschedule (demo), cancel appointments.
// - Error modes: none external; UI-only state updates.

const branches = ["Downtown", "Westside", "North Branch", "South Branch"];

const employees = [
  { id: 1, name: "Michael Chen", role: "Senior Technician", available: true },
  { id: 2, name: "Sarah Wilson", role: "Technician", available: true },
  { id: 3, name: "David Martinez", role: "Technician", available: false },
  { id: 4, name: "Emily Thompson", role: "Junior Technician", available: true },
];

const initialAppointments = [
  {
    id: 1,
    customer: "John Doe",
    vehicle: "Honda Civic 2020",
    service: "Oil Change",
    date: new Date(2025, 9, 15),
    time: "10:00 AM",
    status: "Approved",
    branch: "Downtown",
    phone: "(555) 123-4567",
    assignedEmployee: "Michael Chen",
    notes: "Please check tire pressure as well",
  },
  {
    id: 2,
    customer: "Jane Smith",
    vehicle: "Toyota Camry 2019",
    service: "Brake Service",
    date: new Date(2025, 9, 15),
    time: "11:00 AM",
    status: "Pending",
    branch: "Downtown",
    phone: "(555) 234-5678",
  },
  {
    id: 3,
    customer: "Mike Johnson",
    vehicle: "Ford F-150 2021",
    service: "Tire Rotation",
    date: new Date(2025, 9, 16),
    time: "2:00 PM",
    status: "Approved",
    branch: "Downtown",
    phone: "(555) 345-6789",
    assignedEmployee: "Sarah Wilson",
  },
  {
    id: 4,
    customer: "Sarah Williams",
    vehicle: "BMW 3 Series 2022",
    service: "Battery Replacement",
    date: new Date(2025, 9, 16),
    time: "9:00 AM",
    status: "Pending",
    branch: "Downtown",
    phone: "(555) 456-7890",
  },
  {
    id: 5,
    customer: "Robert Brown",
    vehicle: "Mercedes C-Class 2021",
    service: "AC Service",
    date: new Date(2025, 9, 18),
    time: "1:00 PM",
    status: "Completed",
    branch: "Downtown",
    phone: "(555) 567-8901",
    assignedEmployee: "Michael Chen",
  },
];

function getStatusColor(mode, status) {
  // return background color for chip based on MUI mode
  const dark = mode === "dark";
  switch (status) {
    case "Pending":
      return dark ? "#d97706" : "#f59e0b"; // amber
    case "Approved":
      return dark ? "#15803d" : "#16a34a"; // green
    case "Completed":
      return dark ? "#1e3a8a" : "#2563eb"; // blue
    case "Cancelled":
      return dark ? "#b91c1c" : "#dc2626"; // red
    default:
      return dark ? "#374151" : "#6b7280"; // gray
  }
}

const ManagerBookingCalendarPage = () => {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBranch, setSelectedBranch] = useState("Downtown");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [appointments, setAppointments] = useState(initialAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchesBranch =
        selectedBranch === "All" || apt.branch === selectedBranch;
      const matchesStatus =
        statusFilter === "All" || apt.status === statusFilter;
      const matchesSearch = apt.customer
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesBranch && matchesStatus && matchesSearch;
    });
  }, [appointments, selectedBranch, statusFilter, searchQuery]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const dayDate = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date: dayDate,
        dayNumber: dayDate.getDate(),
        isCurrentMonth: false,
        appointments: [],
      });
    }

    // current month
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      const dayAppointments = filteredAppointments.filter(
        (apt) =>
          apt.date.getDate() === i &&
          apt.date.getMonth() === month &&
          apt.date.getFullYear() === year
      );
      days.push({
        date: dayDate,
        dayNumber: i,
        isCurrentMonth: true,
        isToday: false,
        appointments: dayAppointments,
      });
    }

    // next month to fill 42 cells
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const dayDate = new Date(year, month + 1, i);
      days.push({
        date: dayDate,
        dayNumber: dayDate.getDate(),
        isCurrentMonth: false,
        appointments: [],
      });
    }

    return days;
  };

  const days = useMemo(
    () => getDaysInMonth(currentDate),
    [currentDate, filteredAppointments]
  );

  const previousMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  const goToToday = () => setCurrentDate(new Date());

  const handleAppointmentClick = (apt) => {
    setSelectedAppointment(apt);
    setDrawerOpen(true);
  };

  const handleApprove = () => {
    if (!selectedEmployee) {
      setSnackbar({
        open: true,
        message: "Please select an employee",
        severity: "error",
      });
      return;
    }

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === selectedAppointment.id
          ? { ...a, status: "Approved", assignedEmployee: selectedEmployee }
          : a
      )
    );

    setSnackbar({
      open: true,
      message: `Assigned to ${selectedEmployee} and approved`,
      severity: "success",
    });
    setApproveDialogOpen(false);
    setDrawerOpen(false);
    setSelectedEmployee("");
  };

  const handleCancel = () => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === selectedAppointment.id ? { ...a, status: "Cancelled" } : a
      )
    );
    setSnackbar({
      open: true,
      message: "Appointment cancelled",
      severity: "info",
    });
    setDrawerOpen(false);
  };

  const handleReschedule = () => {
    setSnackbar({
      open: true,
      message: "Reschedule requested (demo)",
      severity: "success",
    });
    setDrawerOpen(false);
  };

  const getMonthYear = (date) =>
    date.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const counts = useMemo(() => {
    return {
      pending: filteredAppointments.filter((a) => a.status === "Pending")
        .length,
      approved: filteredAppointments.filter((a) => a.status === "Approved")
        .length,
      completed: filteredAppointments.filter((a) => a.status === "Completed")
        .length,
    };
  }, [filteredAppointments]);

  return (
    <ManagerLayout>
      <Box sx={{ pb: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Branch Booking Calendar
        </Typography>

        <CalendarHeader
          currentDate={currentDate}
          onPrev={previousMonth}
          onNext={nextMonth}
          onToday={goToToday}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          counts={counts}
          branches={branches}
        />

        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ mb: 1 }}>
            <CalendarGrid
              days={days}
              onAppointmentClick={handleAppointmentClick}
              themeMode={theme.palette.mode}
            />
          </Box>
        </Paper>

        <AppointmentPopup
          open={!!selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          appointment={selectedAppointment}
          employees={employees}
          onApprove={(employeeName) => {
            if (!employeeName) {
              setSnackbar({
                open: true,
                message: "Please select an employee",
                severity: "error",
              });
              return;
            }
            setAppointments((prev) =>
              prev.map((a) =>
                a.id === selectedAppointment.id
                  ? { ...a, status: "Approved", assignedEmployee: employeeName }
                  : a
              )
            );
            setSnackbar({
              open: true,
              message: `Assigned to ${employeeName} and approved`,
              severity: "success",
            });
            setSelectedAppointment(null);
          }}
          onReject={() => {
            setAppointments((prev) =>
              prev.map((a) =>
                a.id === selectedAppointment.id
                  ? { ...a, status: "Cancelled" }
                  : a
              )
            );
            setSnackbar({
              open: true,
              message: "Appointment rejected",
              severity: "info",
            });
            setSelectedAppointment(null);
          }}
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
        />

        {/* Approve Dialog */}
        <Dialog
          open={approveDialogOpen}
          onClose={() => setApproveDialogOpen(false)}
        >
          <DialogTitle>Approve & Assign Employee</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 1 }}>
              <Select
                fullWidth
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                displayEmpty
              >
                <MenuItem value="">Select employee</MenuItem>
                {employees.map((emp) => (
                  <MenuItem
                    key={emp.id}
                    value={emp.name}
                    disabled={!emp.available}
                  >
                    {emp.name} — {emp.role} {emp.available ? "" : "(Busy)"}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setApproveDialogOpen(false)}>Close</Button>
            <Button onClick={handleApprove} variant="contained" color="success">
              Confirm & Approve
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          <Alert
            onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ManagerLayout>
  );
};

export default ManagerBookingCalendarPage;

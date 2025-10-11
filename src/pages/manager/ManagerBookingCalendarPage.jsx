import React, { useMemo, useState, useEffect } from "react";
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

// Branches will be loaded from the API

// employees will be loaded from the API

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
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [appointments, setAppointments] = useState(initialAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  // selectedEmployee will be an employee object (or null)
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  // fetch branches from backend on mount
  useEffect(() => {
    const ac = new AbortController();
    async function loadBranches() {
      try {
        const res = await fetch("http://localhost:8080/api/branches/all", {
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // map server shape to UI shape: branch name
        const mapped = (data || []).map((b) => b.branchName || b.name || "");
        setBranches(mapped);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to load branches", err);
          setSnackbar({
            open: true,
            message: "Failed to load branches",
            severity: "error",
          });
        }
      }
    }
    loadBranches();
    return () => ac.abort();
  }, []);

  // fetch employees from backend on mount
  useEffect(() => {
    const ac = new AbortController();
    async function load() {
      try {
        const res = await fetch("http://localhost:8080/api/users/employees", {
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // map server shape to UI shape: {id, name, role, available}
        const mapped = (data || []).map((u) => ({
          id: u.id,
          name: u.username || u.email || `emp-${u.id}`,
          role: u.role || "employee",
          available: !!u.is_Active && !u.is_Blocked,
          phone: u.phoneNumber,
        }));
        setEmployees(mapped);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to load employees", err);
          setSnackbar({
            open: true,
            message: "Failed to load employees",
            severity: "error",
          });
        }
      }
    }
    load();
    return () => ac.abort();
  }, []);

  // fetch bookings and map them to the appointment shape used by the calendar
  useEffect(() => {
    const ac = new AbortController();
    async function loadBookings() {
      try {
        const res = await fetch("http://localhost:8080/api/bookings/all", {
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log("API Response - Bookings:", data);
        const mapped = (data || []).map((b) => {
          const start = b.startAt ? new Date(b.startAt) : null;
          const end = b.endAt ? new Date(b.endAt) : null;
          const timeStr = start
            ? start.toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
              })
            : "";

          console.log(
            `Processing appointment ${b.id}, Branch: ${b.branchName}, Date: ${b.startAt}, Parsed: ${start}`
          );
          const status = (b.status || "").toLowerCase();
          const prettyStatus =
            status === "pending"
              ? "Pending"
              : status === "approved"
              ? "Approved"
              : status === "completed"
              ? "Completed"
              : status === "cancelled" || status === "canceled"
              ? "Cancelled"
              : b.status === "PENDING"
              ? "Pending"
              : b.status === "APPROVED"
              ? "Approved"
              : b.status === "COMPLETED"
              ? "Completed"
              : b.status === "CANCELLED" || b.status === "CANCELED"
              ? "Cancelled"
              : b.status || "";

          return {
            id: b.id,
            customer: b.customerName || b.customer || "—",
            vehicle: b.vehicle,
            service: b.serviceName || "",
            date: start || new Date(),
            time: timeStr,
            status: prettyStatus,
            branch: b.branchName || "",
            phone: b.customerPhone || "",
            assignedEmployee: b.assignedEmployeeName || "",
            notes: b.notes || "",
            raw: b,
            startAt: b.startAt,
            endAt: b.endAt,
            // Log for debugging
            branchId: b.branchId,
          };
        });
        setAppointments(mapped);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to load bookings", err);
          setSnackbar({
            open: true,
            message: "Failed to load bookings",
            severity: "error",
          });
        }
      }
    }
    loadBookings();
    return () => ac.abort();
  }, []);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchesBranch =
        selectedBranch === "All" || apt.branch === selectedBranch;
      const matchesStatus =
        statusFilter === "All" ||
        apt.status === statusFilter ||
        apt.status?.toUpperCase() === statusFilter?.toUpperCase();
      const matchesSearch = apt.customer
        ?.toLowerCase()
        .includes((searchQuery || "").toLowerCase());

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
      const dayAppointments = filteredAppointments.filter((apt) => {
        // Handle both Date objects and ISO strings
        const aptDate =
          apt.date instanceof Date ? apt.date : new Date(apt.date);
        return (
          aptDate.getDate() === i &&
          aptDate.getMonth() === month &&
          aptDate.getFullYear() === year
        );
      });
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
          ? {
              ...a,
              status: "Approved",
              assignedEmployee: selectedEmployee.name,
            }
          : a
      )
    );

    setSnackbar({
      open: true,
      message: `Assigned to ${selectedEmployee.name} and approved`,
      severity: "success",
    });
    setApproveDialogOpen(false);
    setDrawerOpen(false);
    setSelectedEmployee(null);
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
          onApprove={(employee) => {
            if (!employee) {
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
                  ? {
                      ...a,
                      status: "Approved",
                      assignedEmployee: employee.name,
                    }
                  : a
              )
            );
            setSnackbar({
              open: true,
              message: `Assigned to ${employee.name} and approved`,
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
                value={selectedEmployee ? selectedEmployee.id : ""}
                onChange={(e) => {
                  const id = e.target.value;
                  const emp = employees.find((x) => x.id === id) || null;
                  setSelectedEmployee(emp);
                }}
                displayEmpty
              >
                <MenuItem value="">Select employee</MenuItem>
                {employees.map((emp) => (
                  <MenuItem
                    key={emp.id}
                    value={emp.id}
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

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
import ManagerBookingCalendar from "../../components/calendar/Booking_Manage/ui/ManagerBookingCalendar";
import {
  BRANCHES_URL,
  EMPLOYEES_URL,
  BOOKINGS_URL,
} from "../../config/apiEndpoints";

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
  // appointments will be loaded from the bookings API on mount
  const [appointments, setAppointments] = useState([]);
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
        const res = await fetch(`${BRANCHES_URL}/all`, {
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
        const res = await fetch(EMPLOYEES_URL, {
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
        const res = await fetch(BOOKINGS_URL, {
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

        <ManagerBookingCalendar />
      </Box>
    </ManagerLayout>
  );
};

export default ManagerBookingCalendarPage;

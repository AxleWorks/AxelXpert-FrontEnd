import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CalendarHeader from "../CalendarHeader";
import CalendarGrid from "../CalendarGrid";
import AppointmentPopup from "../AppointmentPopup";

function getStatusColor(mode, status) {
  const dark = mode === "dark";
  switch (status) {
    case "Pending":
      return dark ? "#d97706" : "#f59e0b";
    case "Approved":
      return dark ? "#15803d" : "#16a34a";
    case "Completed":
      return dark ? "#1e3a8a" : "#2563eb";
    case "Cancelled":
      return dark ? "#b91c1c" : "#dc2626";
    default:
      return dark ? "#374151" : "#6b7280";
  }
}

export default function ManagerBookingCalendar({
  apiBase = "http://localhost:8080/api",
}) {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const ac = new AbortController();
    async function loadBranches() {
      try {
        const res = await fetch(`${apiBase}/branches/all`, {
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
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
  }, [apiBase]);

  useEffect(() => {
    const ac = new AbortController();
    async function loadEmployees() {
      try {
        const res = await fetch(`${apiBase}/users/employees`, {
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
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
    loadEmployees();
    return () => ac.abort();
  }, [apiBase]);

  useEffect(() => {
    const ac = new AbortController();
    async function loadBookings() {
      try {
        const res = await fetch(`${apiBase}/bookings/all`, {
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const mapped = (data || []).map((b) => {
          const start = b.startAt ? new Date(b.startAt) : null;
          const timeStr = start
            ? start.toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
              })
            : "";
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
  }, [apiBase]);

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

    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      const dayAppointments = filteredAppointments.filter((apt) => {
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
  };

  const counts = useMemo(
    () => ({
      pending: filteredAppointments.filter((a) => a.status === "Pending")
        .length,
      approved: filteredAppointments.filter((a) => a.status === "Approved")
        .length,
      completed: filteredAppointments.filter((a) => a.status === "Completed")
        .length,
    }),
    [filteredAppointments]
  );

  return (
    <Box sx={{ pb: 3 }}>
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
                ? { ...a, status: "Approved", assignedEmployee: employee.name }
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

      <Dialog open={false} onClose={() => {}}>
        <DialogTitle>Placeholder</DialogTitle>
        <DialogContent />
        <DialogActions>
          <Button>Close</Button>
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
  );
}

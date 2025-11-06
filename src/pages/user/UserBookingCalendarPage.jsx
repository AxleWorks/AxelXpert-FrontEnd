import React, { useMemo, useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Box,
  Container,
  useTheme,
  CircularProgress,
  Alert,
  Snackbar,
  Button,
  IconButton,
} from "@mui/material";
import UserLayout from "../../layouts/user/UserLayout";
import CalendarGrid from "../../components/calendar/Booking_Manage/CalendarGrid";
import CustomerBookingModal from "../../components/calendar/CustomerBookingModal";
import AppointmentDetailModal from "../../components/calendar/AppointmentDetailModal";
import { useAuth } from "../../contexts/AuthContext";
import {
  createBooking,
  getCustomerBookings,
  deleteBooking,
} from "../../services/bookingService";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const UserBookingCalendarPage = () => {
  const theme = useTheme();
  const { user } = useAuth?.() || { user: null };
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Default 4 slots for every day
  const DEFAULT_DAY_TIMES = ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM"];

  // No explicit slots: we start with 4 default slots per day (see DEFAULT_DAY_TIMES)

  // Only the current customer's own bookings should be visible here
  const [bookings, setBookings] = useState([]);

  // Fetch customer's bookings on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const customerBookings = await getCustomerBookings(user.id);

        // Transform backend BookingDTO to frontend format
        const transformedBookings = customerBookings.map((booking) => ({
          id: booking.id,
          date: booking.startAt, // Backend returns startAt as ISO string
          time: extractTime(booking.startAt), // Extract time from startAt
          service: booking.serviceName,
          status: booking.status,
          customer: booking.customerName,
          vehicle: booking.vehicle,
          branch: booking.branchId,
          branchName: booking.branchName,
          customerPhone: booking.customerPhone,
          notes: booking.notes,
          totalPrice: booking.totalPrice,
        }));

        setBookings(transformedBookings);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load your bookings. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?.id]);

  // Helper function to extract time from ISO datetime string
  const extractTime = (isoString) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      return "";
    }
  };

  const appointments = useMemo(() => {
    // Filter ONLY this user's bookings (already isolated in `bookings` state) and current month
    return bookings.filter((apt) => {
      const d = new Date(apt.date);
      const inMonth =
        d.getMonth() === currentDate.getMonth() &&
        d.getFullYear() === currentDate.getFullYear();
      return inMonth;
    });
  }, [bookings, currentDate]);

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
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      const dayAppointments = appointments.filter((apt) => {
        const ad = new Date(apt.date);
        return (
          ad.getDate() === i &&
          ad.getMonth() === month &&
          ad.getFullYear() === year
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
    [currentDate, appointments]
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

  // Helpers for grid props
  const dateKey = (d) => {
    if (!d) return "";
    const dd = new Date(d);
    return `${dd.getFullYear()}-${String(dd.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(dd.getDate()).padStart(2, "0")}`;
  };

  const getAvailableTimesForDate = (date) => {
    if (!date) return [];
    const day = new Date(date);
    const today = new Date();

    // Disable past days (compare using local date only, not time)
    const dayLocal = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    const todayLocal = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    if (dayLocal < todayLocal) return [];

    // Start with defaults (4 slots per day)
    const base = new Set(DEFAULT_DAY_TIMES);

    // Count bookings for this specific date (using local date components)
    const bookingsOnThisDay = bookings.filter((b) => {
      const bookingDate = new Date(b.date);
      // Compare date components in local timezone
      return (
        bookingDate.getDate() === day.getDate() &&
        bookingDate.getMonth() === day.getMonth() &&
        bookingDate.getFullYear() === day.getFullYear()
      );
    });

    // Remove booked times from available slots
    bookingsOnThisDay.forEach((b) => {
      // Try to match and remove the booked time slot
      if (b.time && base.has(b.time)) {
        base.delete(b.time);
      }
    });

    return Array.from(base);
  };

  // Build slot counts for each day in the visible grid
  const slotMap = useMemo(() => {
    const map = {};
    // Use currently computed days for the month
    const monthDays = getDaysInMonth(currentDate);
    monthDays.forEach((d) => {
      const key = dateKey(d.date);
      const availableSlots = getAvailableTimesForDate(d.date);
      map[key] = availableSlots.length; // This will be 4 minus number of bookings
    });
    return map;
  }, [currentDate, bookings]);

  const handleDayClick = (date) => {
    // Only allow today and future (compare local dates without time)
    const today = new Date();
    const d = new Date(date);

    const todayLocal = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const selectedLocal = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    if (selectedLocal < todayLocal) return;

    setSelectedDate(date);
    setSelectedTimeSlot(null);
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = async (bookingData) => {
    try {
      // The bookingData from CustomerBookingModal is already formatted correctly
      const created = await createBooking(bookingData);

      // Transform backend response to frontend format
      const newBooking = {
        id: created.id,
        date: created.startAt,
        time: extractTime(created.startAt),
        service: created.serviceName,
        status: created.status,
        customer: created.customerName,
        vehicle: created.vehicle,
        branch: created.branchId,
        branchName: created.branchName,
        customerPhone: created.customerPhone,
        notes: created.notes,
        totalPrice: created.totalPrice,
      };

      setBookings((prev) => [...prev, newBooking]);

      // Close modal and reset selection
      setIsBookingModalOpen(false);
      setSelectedDate(null);
      setSelectedTimeSlot(null);

      // Success notification
      setSnackbar({
        open: true,
        message: "Booking created successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error("Error creating booking", err);
      setSnackbar({
        open: true,
        message: `Error creating booking: ${
          err.message || "Please try again."
        }`,
        severity: "error",
      });
      throw err; // Re-throw so modal can handle it
    }
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      console.log("handleDeleteAppointment called with ID:", appointmentId);
      await deleteBooking(appointmentId);

      // Remove the deleted appointment from the bookings state
      setBookings((prev) =>
        prev.filter((booking) => booking.id !== appointmentId)
      );

      // Show success message
      setSnackbar({
        open: true,
        message: "Appointment deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting appointment:", error);
      // Re-throw with more context
      throw new Error(
        error.message ||
          "Unable to delete appointment. Please check your connection and try again."
      );
    }
  };

  return (
    <UserLayout>
      <Container maxWidth="xl" sx={{ py: 3, minHeight: "100vh" }}>
        {/* Show loading state */}
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 8,
            }}
          >
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Loading your bookings...
            </Typography>
          </Box>
        )}

        {/* Show error state */}
        {error && !loading && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Show calendar content */}
        {!loading && (
          <>
            {/* Status Legend */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                mb: 3,
                justifyContent: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: 1,
                    bgcolor:
                      theme.palette.mode === "dark" ? "#d97706" : "#f59e0b",
                  }}
                />
                <Typography variant="body2">Pending</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: 1,
                    bgcolor:
                      theme.palette.mode === "dark" ? "#15803d" : "#16a34a",
                  }}
                />
                <Typography variant="body2">Approved</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: 1,
                    bgcolor:
                      theme.palette.mode === "dark" ? "#1e3a8a" : "#2563eb",
                  }}
                />
                <Typography variant="body2">Completed</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: 1,
                    bgcolor:
                      theme.palette.mode === "dark" ? "#b91c1c" : "#dc2626",
                  }}
                />
                <Typography variant="body2">Cancelled</Typography>
              </Box>
            </Box>

            {/* Simple header with navigation */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {currentDate.toLocaleDateString(undefined, {
                  month: "long",
                  year: "numeric",
                })}
              </Typography>
              <Button variant="outlined" onClick={goToToday} sx={{ mr: 1 }}>
                Today
              </Button>
              <IconButton onClick={previousMonth}>
                <ChevronLeft />
              </IconButton>
              <IconButton onClick={nextMonth}>
                <ChevronRight />
              </IconButton>
            </Box>

            <Paper sx={{ p: 2, mb: 2 }}>
              <Box sx={{ mb: 1 }}>
                <CalendarGrid
                  days={days}
                  onAppointmentClick={handleAppointmentClick}
                  themeMode={theme.palette.mode}
                  onDayClick={handleDayClick}
                  availableSlotsByDate={slotMap}
                />
              </Box>
            </Paper>
          </>
        )}

        {/* Booking Modal */}
        <CustomerBookingModal
          open={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedDate(null);
            setSelectedTimeSlot(null);
          }}
          selectedDate={selectedDate}
          selectedTimeSlot={selectedTimeSlot}
          onSubmit={handleBookingSubmit}
          // pass only today's available slot times (defaults minus any bookings)
          dayTimeSlots={
            selectedDate ? getAvailableTimesForDate(selectedDate) : []
          }
        />

        {/* Appointment Detail Modal */}
        <AppointmentDetailModal
          open={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          appointment={selectedAppointment}
          onDelete={handleDeleteAppointment}
        />

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </UserLayout>
  );
};

export default UserBookingCalendarPage;

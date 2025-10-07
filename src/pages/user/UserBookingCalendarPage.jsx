import React, { useMemo, useState } from "react";
import { Typography, Paper, Box, Container, useTheme } from "@mui/material";
import UserLayout from "../../layouts/user/UserLayout";
import CalendarHeader from "../../components/calendar/Booking_Manage/CalendarHeader";
import CalendarGrid from "../../components/calendar/Booking_Manage/CalendarGrid";
import BookingModal from "../../components/calendar/BookingModal";

const UserBookingCalendarPage = () => {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBranch, setSelectedBranch] = useState("Downtown");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // Default 4 slots for every day
  const DEFAULT_DAY_TIMES = ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM"];

  // No explicit slots: we start with 4 default slots per day (see DEFAULT_DAY_TIMES)

  // Only the current customer's own bookings should be visible here
  const [bookings, setBookings] = useState([]);

  const branches = ["Downtown", "Westside", "North Branch", "South Branch"]; // demo

  const filteredAppointments = useMemo(() => {
    // Filter ONLY this user's bookings (already isolated in `bookings` state)
    return bookings.filter((apt) => {
      const d = new Date(apt.date);
      const matchesStatus = statusFilter === "All" || apt.status === statusFilter;
      const inMonth =
        d.getMonth() === currentDate.getMonth() &&
        d.getFullYear() === currentDate.getFullYear();
      return matchesStatus && inMonth;
    });
  }, [bookings, statusFilter, currentDate]);

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
      const dayAppointments = filteredAppointments.filter((apt) => {
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

  const days = useMemo(() => getDaysInMonth(currentDate), [currentDate, filteredAppointments]);

  const previousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Helpers for grid props
  const dateKey = (d) => {
    if (!d) return "";
    const dd = new Date(d);
    return `${dd.getFullYear()}-${String(dd.getMonth() + 1).padStart(2, "0")}-${String(dd.getDate()).padStart(2, "0")}`;
  };

  const getAvailableTimesForDate = (date) => {
    if (!date) return [];
    const day = new Date(date);
    // Disable past days
    if (day.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) return [];

    // Start with defaults
    const base = new Set(DEFAULT_DAY_TIMES);

    // Remove any times already booked by the current user that day
    bookings
      .filter((b) => new Date(b.date).toDateString() === day.toDateString())
      .forEach((b) => base.delete(b.time));

    return Array.from(base);
  };

  // Build slot counts for each day in the visible grid
  const slotMap = useMemo(() => {
    const map = {};
    // Use currently computed days for the month
    const monthDays = getDaysInMonth(currentDate);
    monthDays.forEach((d) => {
      const key = dateKey(d.date);
      map[key] = getAvailableTimesForDate(d.date).length;
    });
    return map;
  }, [currentDate, bookings]);

  const handleDayClick = (date) => {
    // Only allow today and future
    const today = new Date();
    const d = new Date(date);
    if (d.setHours(0, 0, 0, 0) < new Date(today.setHours(0, 0, 0, 0))) return;
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = (bookingData) => {
    const newBooking = {
      id: Date.now(),
      date: bookingData.date?.toISOString?.() || new Date(bookingData.date).toISOString(),
      time: bookingData.time || bookingData.timeSlot,
      service: bookingData.service,
      status: "Pending",
      customer: bookingData.customer,
      vehicle: bookingData.vehicle,
      branch: bookingData.branch,
      notes: bookingData.notes,
    };
    setBookings((prev) => [...prev, newBooking]);
    // No need to mutate configured availableSlots for default slots; booked time is excluded by getAvailableTimesForDate
    setIsBookingModalOpen(false);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
  };

  return (
    <UserLayout>
      <Container maxWidth="xl" sx={{ py: 3, minHeight: "100vh" }}>
        {/* Reuse manager header for identical look */}
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
          counts={{
            pending: bookings.filter((a) => a.status === "Pending").length,
            approved: bookings.filter((a) => a.status === "Approved").length,
            completed: bookings.filter((a) => a.status === "Completed").length,
          }}
          branches={branches}
        />

        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ mb: 1 }}>
            <CalendarGrid
              days={days}
              onAppointmentClick={() => {}}
              themeMode={theme.palette.mode}
              onDayClick={handleDayClick}
              availableSlotsByDate={slotMap}
            />
          </Box>
        </Paper>

        <BookingModal
          open={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedDate(null);
            setSelectedTimeSlot(null);
          }}
          selectedDate={selectedDate}
          selectedTimeSlot={selectedTimeSlot}
          onSubmit={handleBookingSubmit}
          branchId={selectedBranch}
          // pass only today's available slot times (defaults minus any bookings)
          dayTimeSlots={selectedDate ? getAvailableTimesForDate(selectedDate) : []}
        />
      </Container>
    </UserLayout>
  );
};

export default UserBookingCalendarPage;

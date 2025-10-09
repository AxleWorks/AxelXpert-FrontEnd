import React, { useMemo, useState } from "react";
import { Typography, Paper, Box, Container, useTheme } from "@mui/material";
import UserLayout from "../../layouts/user/UserLayout";
import CalendarHeader from "../../components/calendar/Booking_Manage/CalendarHeader";
import CalendarGrid from "../../components/calendar/Booking_Manage/CalendarGrid";
import CustomerBookingModal from "../../components/calendar/CustomerBookingModal";
import { useAuth } from "../../contexts/AuthContext";

const UserBookingCalendarPage = () => {
  const theme = useTheme();
  const { user } = useAuth?.() || { user: null };
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

  // Provided services and vehicles (can move to API later)
  const SERVICES = [
    { id: 1, name: "Oil Change", price: 29.99, durationMinutes: 30 },
    { id: 2, name: "Tire Rotation", price: 49.99, durationMinutes: 45 },
    { id: 3, name: "Brake Inspection", price: 79.99, durationMinutes: 60 },
    { id: 4, name: "Battery Replacement", price: 119.99, durationMinutes: 30 },
    { id: 5, name: "Full Service", price: 249.99, durationMinutes: 180 },
    { id: 6, name: "AC Service", price: 99.99, durationMinutes: 60 },
  ];

  const VEHICLES = [
    { id: 1, type: "Car", year: 2018, make: "Toyota", model: "Corolla", fuelType: "petrol", plateNumber: "PLT-1001", chassisNumber: "CHASSIS1001", lastServiceDate: "2024-08-01", userId: 1 },
    { id: 2, type: "Car", year: 2020, make: "Honda", model: "Civic", fuelType: "petrol", plateNumber: "PLT-1002", chassisNumber: "CHASSIS1002", lastServiceDate: "2025-02-05", userId: 2 },
    { id: 3, type: "Truck", year: 2015, make: "Ford", model: "F-150", fuelType: "diesel", plateNumber: "PLT-1003", chassisNumber: "CHASSIS1003", lastServiceDate: "2024-12-10", userId: 3 },
    { id: 4, type: "Car", year: 2019, make: "Nissan", model: "Altima", fuelType: "petrol", plateNumber: "PLT-1004", chassisNumber: "CHASSIS1004", lastServiceDate: "2025-01-15", userId: 4 },
    { id: 5, type: "SUV", year: 2021, make: "Mazda", model: "CX-5", fuelType: "petrol", plateNumber: "PLT-1005", chassisNumber: "CHASSIS1005", lastServiceDate: "2025-04-20", userId: 5 },
    { id: 6, type: "Car", year: 2017, make: "Kia", model: "Rio", fuelType: "petrol", plateNumber: "PLT-1006", chassisNumber: "CHASSIS1006", lastServiceDate: "2024-06-11", userId: 6 },
    { id: 7, type: "Car", year: 2016, make: "Hyundai", model: "Elantra", fuelType: "petrol", plateNumber: "PLT-1007", chassisNumber: "CHASSIS1007", lastServiceDate: "2024-03-30", userId: 7 },
    { id: 8, type: "SUV", year: 2022, make: "Subaru", model: "Forester", fuelType: "petrol", plateNumber: "PLT-1008", chassisNumber: "CHASSIS1008", lastServiceDate: "2025-06-02", userId: 8 },
    { id: 9, type: "Van", year: 2014, make: "Mercedes", model: "Vito", fuelType: "diesel", plateNumber: "PLT-1009", chassisNumber: "CHASSIS1009", lastServiceDate: "2024-11-20", userId: 9 },
    { id: 10, type: "Car", year: 2023, make: "Tesla", model: "Model 3", fuelType: "electric", plateNumber: "PLT-1010", chassisNumber: "CHASSIS1010", lastServiceDate: "2025-08-01", userId: 10 },
  ];

  const availableVehicles = useMemo(() => {
    if (user?.id) return VEHICLES.filter(v => v.userId === user.id);
    return VEHICLES;
  }, [user]);

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
          branchId={selectedBranch}
          // pass only today's available slot times (defaults minus any bookings)
          dayTimeSlots={selectedDate ? getAvailableTimesForDate(selectedDate) : []}
          services={SERVICES}
          vehicles={availableVehicles}
        />
      </Container>
    </UserLayout>
  );
};

export default UserBookingCalendarPage;

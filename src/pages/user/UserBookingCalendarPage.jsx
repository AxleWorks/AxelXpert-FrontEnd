import React, { useMemo, useState, useEffect } from "react";
import { Typography, Paper, Box, Container, useTheme, CircularProgress, Alert } from "@mui/material";
import UserLayout from "../../layouts/user/UserLayout";
import CalendarHeader from "../../components/calendar/Booking_Manage/CalendarHeader";
import CalendarGrid from "../../components/calendar/Booking_Manage/CalendarGrid";
import CustomerBookingModal from "../../components/calendar/CustomerBookingModal";
import AppointmentDetailModal from "../../components/calendar/AppointmentDetailModal";
import { useAuth } from "../../contexts/AuthContext";
import { createBooking, getCustomerBookings, deleteBooking } from "../../services/bookingService";

const UserBookingCalendarPage = () => {
  const theme = useTheme();
  const { user } = useAuth?.() || { user: null };
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBranch, setSelectedBranch] = useState("Downtown");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const transformedBookings = customerBookings.map(booking => ({
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
          totalPrice: booking.totalPrice
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
        hour12: true 
      });
    } catch (e) {
      return "";
    }
  };

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
    const today = new Date();
    
    // Disable past days (compare using local date only, not time)
    const dayLocal = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
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
    
    const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
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
        totalPrice: created.totalPrice
      };

      setBookings((prev) => [...prev, newBooking]);
      
      // Close modal and reset selection
      setIsBookingModalOpen(false);
      setSelectedDate(null);
      setSelectedTimeSlot(null);
      
      // Success notification
      window.alert("Booking created successfully!");
    } catch (err) {
      console.error("Error creating booking", err);
      window.alert("Error creating booking: " + (err.message || "Please try again."));
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
      setBookings((prev) => prev.filter((booking) => booking.id !== appointmentId));
      
      // Show success message
      window.alert("Appointment deleted successfully!");
    } catch (error) {
      console.error("Error deleting appointment:", error);
      // Re-throw with more context
      throw new Error(error.message || "Unable to delete appointment. Please check your connection and try again.");
    }
  };

  return (
    <UserLayout>
      <Container maxWidth="xl" sx={{ py: 3, minHeight: "100vh" }}>
        {/* Show loading state */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
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
          branchId={selectedBranch}
          // pass only today's available slot times (defaults minus any bookings)
          dayTimeSlots={selectedDate ? getAvailableTimesForDate(selectedDate) : []}
          services={SERVICES}
          vehicles={availableVehicles}
        />

        {/* Appointment Detail Modal */}
        <AppointmentDetailModal
          open={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          appointment={selectedAppointment}
          onDelete={handleDeleteAppointment}
        />
      </Container>
    </UserLayout>
  );
};

export default UserBookingCalendarPage;

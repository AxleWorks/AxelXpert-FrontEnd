import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Grid,
  Chip,
  useTheme,
  useMediaQuery,
  Tooltip,
  Fade,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  CheckCircle,
  Error,
  Warning,
  Info,
} from '@mui/icons-material';
import CalendarDay from './CalendarDay';
import CustomerBookingModal from './CustomerBookingModal';
import './Calendar.css';

const Calendar = ({ branchId, availableSlots = [], existingBookings = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [slideDirection, setSlideDirection] = useState('left');
  const [isTransitioning, setIsTransitioning] = useState(false);
  // keep a local copy so we can append new pending bookings immediately
  const [bookings, setBookings] = useState(existingBookings);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info" // success, error, warning, info
  });

  useEffect(() => {
    // if parent props change, refresh local state
    setBookings(existingBookings);
  }, [existingBookings]);

  // Snackbar helper functions
  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const hideSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Get first day of current month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of month
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    calendarDays.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  }

  const handlePreviousMonth = () => {
    setSlideDirection('right');
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
      setIsTransitioning(false);
    }, 150);
  };

  const handleNextMonth = () => {
    setSlideDirection('left');
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
      setIsTransitioning(false);
    }, 150);
  };

  const handleToday = () => {
    setSlideDirection('fade');
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentDate(new Date());
      setIsTransitioning(false);
    }, 150);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowLeft' && !isBookingModalOpen) {
        handlePreviousMonth();
      } else if (event.key === 'ArrowRight' && !isBookingModalOpen) {
        handleNextMonth();
      } else if (event.key === 'Home' && !isBookingModalOpen) {
        handleToday();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isBookingModalOpen, currentDate]);

  const handleDateClick = (date, timeSlot = null) => {
    setSelectedDate(date);
    setSelectedTimeSlot(timeSlot);
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = (bookingData) => {
    try {
      showSnackbar("Creating booking...", "info");
      
      // TODO: send to backend; for now optimistic update local calendar
      const newBooking = {
        id: Date.now(),
        date: bookingData.date?.toISOString?.() || new Date(bookingData.date).toISOString(),
        time: bookingData.time || bookingData.timeSlot,
        service: bookingData.service,
        status: 'Pending',
        customer: bookingData.customer,
        vehicle: bookingData.vehicle,
        branch: bookingData.branch,
        notes: bookingData.notes,
      };

      setBookings((prev) => [...prev, newBooking]);
      console.log('Booking submitted (pending):', newBooking);
      
      showSnackbar("Booking created successfully!", "success");

      // Close the modal
      setIsBookingModalOpen(false);
      setSelectedDate(null);
      setSelectedTimeSlot(null);
    } catch (error) {
      console.error('Error creating booking:', error);
      showSnackbar("Failed to create booking. Please try again.", "error");
    }
  };

  const getBookingsForDate = (date) => {
    if (!date) return [];
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate.toDateString() === date.toDateString();
    });
  };

  const getAvailableSlotsForDate = (date) => {
    if (!date) return [];
    return availableSlots.filter(slot => {
      const slotDate = new Date(slot.date);
      return slotDate.toDateString() === date.toDateString();
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Box 
      className="calendar-container"
      sx={{ 
        width: '100%', 
        maxWidth: 1200, 
        margin: '0 auto', 
        p: 2,
        bgcolor: '#ffffff'
      }}
    >
      <Paper elevation={0} sx={{ 
        p: 3,
        bgcolor: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: 2
      }}>
        {/* Calendar Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          flexWrap: 'wrap',
          gap: 2 
        }}>
          <Typography variant="h4" component="h1" sx={{ 
            fontWeight: 700,
            color: '#1a1a1a',
            fontSize: { xs: '1.75rem', md: '2.125rem' }
          }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Typography>
          
          {/* Enhanced Navigation Buttons */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            bgcolor: '#f8f9fa',
            borderRadius: '50px',
            padding: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #e9ecef'
          }}>
            <Tooltip title="Previous month (←)" arrow placement="top">
              <IconButton 
                onClick={handlePreviousMonth}
                className="nav-button prev-button"
                disabled={isTransitioning}
                aria-label="Go to previous month"
                sx={{ 
                  width: 44,
                  height: 44,
                  bgcolor: 'transparent',
                  color: '#6c757d',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { 
                    bgcolor: '#ffffff',
                    color: '#495057',
                    transform: 'translateX(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  },
                  '&:active': {
                    transform: 'translateX(-1px) scale(0.95)'
                  },
                  '&:disabled': {
                    opacity: 0.5,
                    cursor: 'not-allowed'
                  }
                }}
              >
                <ChevronLeft sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Go to today (Home)" arrow placement="top">
              <IconButton 
                onClick={handleToday}
                className="nav-button today-button"
                disabled={isTransitioning}
                aria-label="Go to current date"
                sx={{ 
                  width: 44,
                  height: 44,
                  bgcolor: '#007bff',
                  color: 'white',
                  mx: 0.5,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { 
                    bgcolor: '#0056b3',
                    transform: 'scale(1.05)',
                    boxShadow: '0 6px 20px rgba(0,123,255,0.4)'
                  },
                  '&:active': {
                    transform: 'scale(0.95)'
                  },
                  '&:disabled': {
                    opacity: 0.7,
                    cursor: 'not-allowed'
                  }
                }}
              >
                <Today sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Next month (→)" arrow placement="top">
              <IconButton 
                onClick={handleNextMonth}
                className="nav-button next-button"
                disabled={isTransitioning}
                aria-label="Go to next month"
                sx={{ 
                  width: 44,
                  height: 44,
                  bgcolor: 'transparent',
                  color: '#6c757d',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { 
                    bgcolor: '#ffffff',
                    color: '#495057',
                    transform: 'translateX(2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  },
                  '&:active': {
                    transform: 'translateX(1px) scale(0.95)'
                  },
                  '&:disabled': {
                    opacity: 0.5,
                    cursor: 'not-allowed'
                  }
                }}
              >
                <ChevronRight sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Week Day Headers */}
        <Grid container spacing={0} sx={{ mb: 1 }}>
          {weekDays.map((day) => (
            <Grid item xs={12/7} key={day} sx={{ textAlign: 'center' }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                  py: 1
                }}
              >
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Calendar Grid */}
        <Fade in={!isTransitioning} timeout={300}>
          <Grid container spacing={0} sx={{ 
            border: '1px solid #e0e0e0',
            transition: 'opacity 0.3s ease-in-out',
            opacity: isTransitioning ? 0.7 : 1
          }}>
            {calendarDays.map((date, index) => (
              <Grid 
                item 
                xs={12/7} 
                key={`${currentDate.getMonth()}-${currentDate.getFullYear()}-${index}`}
                sx={{ 
                  display: 'flex',
                  minHeight: 120,
                  maxHeight: 120,
                  border: '1px solid #e0e0e0',
                  borderTop: index < 7 ? 'none' : '1px solid #e0e0e0',
                  borderLeft: index % 7 === 0 ? 'none' : '1px solid #e0e0e0'
                }}
              >
                <CalendarDay
                  date={date}
                  bookings={getBookingsForDate(date)}
                  availableSlots={getAvailableSlotsForDate(date)}
                  onDateClick={handleDateClick}
                  isCurrentMonth={date && date.getMonth() === currentDate.getMonth()}
                  isToday={date && date.toDateString() === new Date().toDateString()}
                />
              </Grid>
            ))}
          </Grid>
        </Fade>

        {/* Legend */}
        <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Chip label="Available" size="small" sx={{ bgcolor: theme.palette.success.light, color: 'white' }} />
          <Chip label="Pending" size="small" sx={{ bgcolor: theme.palette.warning.main, color: 'white' }} />
          <Chip label="Approved" size="small" sx={{ bgcolor: theme.palette.success.main, color: 'white' }} />
          <Chip label="Completed" size="small" sx={{ bgcolor: theme.palette.info.main, color: 'white' }} />
        </Box>

        {/* Keyboard shortcuts hint */}
        <Box sx={{ 
          mt: 2, 
          textAlign: 'center',
          opacity: 0.6,
          transition: 'opacity 0.3s ease',
          '&:hover': { opacity: 1 }
        }}>
          <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '0.75rem' }}>
            Use ← → arrow keys to navigate months, Home for today
          </Typography>
        </Box>
      </Paper>

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
        branchId={branchId}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={hideSnackbar} 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            '& .MuiAlert-icon': {
              fontSize: '1.2rem'
            }
          }}
          iconMapping={{
            success: <CheckCircle fontSize="inherit" />,
            error: <Error fontSize="inherit" />,
            warning: <Warning fontSize="inherit" />,
            info: <Info fontSize="inherit" />
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Calendar;
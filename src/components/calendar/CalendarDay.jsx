import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  useTheme,
} from '@mui/material';

const CalendarDay = ({ 
  date, 
  bookings = [], 
  availableSlots = [], 
  onDateClick, 
  isCurrentMonth = true,
  isToday = false 
}) => {
  const theme = useTheme();

  if (!date) {
    return (
      <Box sx={{ 
        height: 120, 
        width: '100%',
        p: 1,
        bgcolor: '#fafafa',
        border: 'none'
      }} />
    );
  }

  const handleDayClick = () => {
    // Only allow clicking on present day and future dates
    if (!isPastDate) {
      onDateClick(date);
    }
  };

  const handleSlotClick = (slot, event) => {
    event.stopPropagation();
    onDateClick(date, slot);
  };

  const getStatusColor = (status) => {
    const s = String(status || '').toLowerCase();
    if (s === 'pending') return theme.palette.warning.main;
    if (s === 'approved' || s === 'confirmed') return theme.palette.success.main;
    if (s === 'completed') return theme.palette.info.main;
    if (s === 'cancelled') return theme.palette.error.main;
    return theme.palette.grey[500];
  };

  const isPastDate = date < new Date().setHours(0, 0, 0, 0);
  const hasAvailableSlots = availableSlots.length > 0;
  // Only allow clicking on present day and future dates
  const isClickable = !isPastDate;

  return (
    <Paper
      className="calendar-day"
      elevation={0}
      sx={{
        height: '100%',
        width: '100%',
        minHeight: 120,
        maxHeight: 120,
        p: 1,
        cursor: isClickable ? 'pointer' : 'not-allowed',
        bgcolor: isPastDate 
          ? '#f5f5f5'
          : isToday 
            ? '#e3f2fd'
            : isCurrentMonth 
              ? '#ffffff' 
              : '#f9f9f9',
        border: 'none',
        borderRadius: 0,
        '&:hover': isClickable ? {
          bgcolor: '#f0f0f0',
          transform: 'none',
        } : {
          bgcolor: isPastDate ? '#f5f5f5' : '#f0f0f0',
        },
        transition: 'all 0.2s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
      onClick={handleDayClick}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        overflow: 'hidden'
      }}>
        {/* Date Number */}
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: isToday ? 700 : 500,
            color: isPastDate
              ? theme.palette.text.disabled
              : isToday 
                ? theme.palette.primary.main 
                : isCurrentMonth 
                  ? theme.palette.text.primary
                  : theme.palette.text.disabled,
            mb: 0.5,
            position: 'relative',
            zIndex: 1
          }}
        >
          {date.getDate()}
        </Typography>

        {/* Available Slots */}
        {availableSlots.length > 0 && (
          <Box sx={{ mb: 0.5 }}>
            <Chip
              label={`${availableSlots.length} slots`}
              size="small"
              sx={{
                height: 18,
                fontSize: '0.7rem',
                bgcolor: theme.palette.success.light,
                color: 'white',
                '&:hover': {
                  bgcolor: theme.palette.success.main,
                }
              }}
              onClick={(e) => handleSlotClick(availableSlots[0], e)}
            />
          </Box>
        )}

        {/* Existing Bookings (render as chips like manager grid) */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 0.25,
          overflow: 'hidden',
          flex: 1
        }}>
          {bookings.slice(0, 3).map((booking, index) => (
            <Chip
              key={booking.id || index}
              label={`${booking.time} • ${booking.customer || booking.service || 'Booking'}`}
              size="small"
              sx={{
                bgcolor: getStatusColor(booking.status),
                color: '#fff',
                width: '100%',
              }}
              onClick={(e) => e.stopPropagation()}
            />
          ))}
          
          {bookings.length > 3 && (
            <Typography 
              variant="caption" 
              sx={{ 
                color: theme.palette.text.secondary,
                textAlign: 'center',
                fontSize: '0.65rem'
              }}
            >
              +{bookings.length - 3} more
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default CalendarDay;
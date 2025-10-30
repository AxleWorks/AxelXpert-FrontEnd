import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
  useTheme,
  Button,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Today,
  CalendarToday as CalendarMonth,
} from "@mui/icons-material";

const AttendanceCalendar = ({ onDateSelect, selectedDate, attendanceData = {}, selectedBranch, branchName }) => {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Previous month's last days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const dayDate = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date: dayDate,
        dayNumber: dayDate.getDate(),
        isCurrentMonth: false,
        attendanceData: null,
      });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        date: dayDate,
        dayNumber: day,
        isCurrentMonth: true,
        attendanceData: attendanceData[dateKey] || null,
      });
    }
    
    // Next month's first days to fill the grid
    const remaining = 42 - days.length;
    for (let day = 1; day <= remaining; day++) {
      const dayDate = new Date(year, month + 1, day);
      days.push({
        date: dayDate,
        dayNumber: day,
        isCurrentMonth: false,
        attendanceData: null,
      });
    }
    
    return days;
  };
  const formatDateKey = (date) => {
    if (!date || !date.date) return "";
    const actualDate = date.date || date;
    if (typeof actualDate.toISOString !== 'function') return "";
    return actualDate.toISOString().split('T')[0];
  };

  const getAttendanceStats = (date) => {
    const dateKey = formatDateKey(date);
    const dayData = attendanceData[dateKey] || {};
    
    const total = dayData.employees?.length || 0;
    const present = dayData.employees?.filter(emp => emp.status === 'present').length || 0;
    const late = dayData.employees?.filter(emp => emp.status === 'late').length || 0;
    const absent = dayData.employees?.filter(emp => emp.status === 'absent').length || 0;
    const onLeave = dayData.employees?.filter(emp => emp.status === 'leave').length || 0;

    return { total, present, late, absent, onLeave };
  };  const getAttendanceColor = (dayData) => {
    if (!dayData || !dayData.date) return "transparent";
    
    const stats = getAttendanceStats(dayData);
    if (stats.total === 0) return theme.palette.grey[200];
    
    const attendanceRate = (stats.present + stats.late) / stats.total;
    
    // Using vibrant, rich colors instead of light ones
    if (attendanceRate >= 0.9) return "#22c55e"; // Rich green
    if (attendanceRate >= 0.7) return "#f59e0b"; // Rich amber/orange
    return "#ef4444"; // Rich red
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };
  const isToday = (dayData) => {
    if (!dayData || !dayData.date) return false;
    const today = new Date();
    return dayData.date.toDateString() === today.toDateString();
  };

  const isSelected = (dayData) => {
    if (!dayData || !dayData.date || !selectedDate) return false;
    return dayData.date.toDateString() === selectedDate.toDateString();
  };

  const days = getDaysInMonth(currentDate);

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>      {/* Calendar Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CalendarMonth sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Typography>
            {branchName && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {branchName} Branch Calendar
              </Typography>
            )}
          </Box>
        </Box>
        
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Today />}
            onClick={goToToday}
            sx={{ borderRadius: 2 }}
          >
            Today
          </Button>
          <IconButton onClick={() => navigateMonth(-1)} sx={{ borderRadius: 2 }}>
            <ChevronLeft />
          </IconButton>
          <IconButton onClick={() => navigateMonth(1)} sx={{ borderRadius: 2 }}>
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>{/* Legend */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Chip
          size="small"
          label="High Attendance (90%+)"
          sx={{ 
            bgcolor: "#22c55e", 
            color: "white",
            fontWeight: 600,
            boxShadow: "0 2px 4px rgba(34, 197, 94, 0.3)"
          }}
        />
        <Chip
          size="small"
          label="Medium Attendance (70-89%)"
          sx={{ 
            bgcolor: "#f59e0b", 
            color: "white",
            fontWeight: 600,
            boxShadow: "0 2px 4px rgba(245, 158, 11, 0.3)"
          }}
        />
        <Chip
          size="small"
          label="Low Attendance (<70%)"
          sx={{ 
            bgcolor: "#ef4444", 
            color: "white",
            fontWeight: 600,
            boxShadow: "0 2px 4px rgba(239, 68, 68, 0.3)"
          }}
        />
      </Box>{/* Days of Week Header */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, mb: 1 }}>
        {daysOfWeek.map((day) => (
          <Box key={day} sx={{ textAlign: "center", py: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
              {day}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Calendar Grid */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
        {days.map((dayData, index) => {
          const stats = dayData ? getAttendanceStats(dayData) : null;
          
          return (
            <Tooltip
              key={index}
              title={
                dayData && dayData.date && stats
                  ? `${dayData.date.getDate()}/${dayData.date.getMonth() + 1}: ${stats.present} Present, ${stats.late} Late, ${stats.absent} Absent, ${stats.onLeave} On Leave`
                  : ""
              }
              arrow
            >              <Box
                sx={{
                  height: 120,
                  border: 1,
                  borderColor: theme.palette.divider,
                  borderRadius: 2,
                  cursor: dayData && dayData.date ? "pointer" : "default",
                  bgcolor: dayData ? getAttendanceColor(dayData) : "transparent",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  transition: "all 0.2s ease",
                  opacity: dayData && dayData.isCurrentMonth ? 1 : 0.3,
                  // Add subtle gradient and shadow for rich appearance
                  backgroundImage: dayData && stats && stats.total > 0 ? 
                    `linear-gradient(135deg, ${getAttendanceColor(dayData)}, ${getAttendanceColor(dayData)}dd)` : 
                    "none",
                  boxShadow: dayData && stats && stats.total > 0 ? 
                    `0 2px 8px ${getAttendanceColor(dayData)}40` : 
                    "none",
                  "&:hover": dayData && dayData.date ? {
                    transform: "scale(1.05)",
                    boxShadow: dayData && stats && stats.total > 0 ? 
                      `0 4px 16px ${getAttendanceColor(dayData)}60` : 
                      theme.shadows[4],
                    zIndex: 1,
                  } : {},
                  ...(isSelected(dayData) && {
                    border: 3,
                    borderColor: "#6366f1", // Indigo color for selection
                    boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.3)",
                  }),
                  ...(isToday(dayData) && {
                    border: 3,
                    borderColor: "#8b5cf6", // Purple color for today
                    boxShadow: "0 0 0 2px rgba(139, 92, 246, 0.3)",
                  }),
                }}
                onClick={() => dayData && dayData.date && onDateSelect(dayData.date)}
              >                {dayData && dayData.date && (
                  <>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isToday(dayData) ? 700 : isSelected(dayData) ? 600 : 600,
                        color: stats && stats.total > 0 ? "white" : "inherit",
                        textShadow: stats && stats.total > 0 ? "0 1px 2px rgba(0,0,0,0.3)" : "none",
                        fontSize: "1rem",
                      }}
                    >
                      {dayData.dayNumber}
                    </Typography>
                    {stats && stats.total > 0 && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          mt: 0.5,
                          color: "white",
                          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                          bgcolor: "rgba(0,0,0,0.2)",
                          borderRadius: 1,
                          px: 0.5,
                          py: 0.25,
                        }}
                      >
                        {stats.present}/{stats.total}
                      </Typography>
                    )}
                  </>
                )}
              </Box>
            </Tooltip>
          );
        })}      </Box>
    </Paper>
  );
};

export default AttendanceCalendar;

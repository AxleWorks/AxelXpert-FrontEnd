import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Grid,
  Chip,
  useTheme,
  Button,
  Tooltip,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Today,
  CalendarMonth,
} from "@mui/icons-material";

const AttendanceCalendar = ({ onDateSelect, selectedDate, attendanceData = {} }) => {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month"); // month, week

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
    const firstDayWeekday = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDateKey = (date) => {
    if (!date) return "";
    return date.toISOString().split('T')[0];
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
  };

  const getAttendanceColor = (date) => {
    if (!date) return "transparent";
    
    const stats = getAttendanceStats(date);
    if (stats.total === 0) return theme.palette.grey[100];
    
    const attendanceRate = (stats.present + stats.late) / stats.total;
    
    if (attendanceRate >= 0.9) return theme.palette.success.light;
    if (attendanceRate >= 0.7) return theme.palette.warning.light;
    return theme.palette.error.light;
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

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const days = getDaysInMonth(currentDate);

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      {/* Calendar Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CalendarMonth sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Typography>
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
      </Box>

      {/* Legend */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Chip
          size="small"
          label="High Attendance (90%+)"
          sx={{ bgcolor: theme.palette.success.light, color: "white" }}
        />
        <Chip
          size="small"
          label="Medium Attendance (70-89%)"
          sx={{ bgcolor: theme.palette.warning.light, color: "white" }}
        />
        <Chip
          size="small"
          label="Low Attendance (<70%)"
          sx={{ bgcolor: theme.palette.error.light, color: "white" }}
        />
      </Box>

      {/* Days of Week Header */}
      <Grid container spacing={1} sx={{ mb: 1 }}>
        {daysOfWeek.map((day) => (
          <Grid item xs key={day}>
            <Box sx={{ textAlign: "center", py: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                {day}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Calendar Grid */}
      <Grid container spacing={1}>
        {days.map((date, index) => {
          const stats = date ? getAttendanceStats(date) : null;
          
          return (
            <Grid item xs key={index}>
              <Tooltip
                title={
                  date && stats
                    ? `${date.getDate()}/${date.getMonth() + 1}: ${stats.present} Present, ${stats.late} Late, ${stats.absent} Absent, ${stats.onLeave} On Leave`
                    : ""
                }
                arrow
              >
                <Box
                  sx={{
                    height: 80,
                    border: 1,
                    borderColor: theme.palette.divider,
                    borderRadius: 2,
                    cursor: date ? "pointer" : "default",
                    bgcolor: date ? getAttendanceColor(date) : "transparent",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    transition: "all 0.2s ease",
                    "&:hover": date ? {
                      transform: "scale(1.02)",
                      boxShadow: theme.shadows[4],
                    } : {},
                    ...(isSelected(date) && {
                      border: 2,
                      borderColor: theme.palette.primary.main,
                      boxShadow: theme.shadows[4],
                    }),
                    ...(isToday(date) && {
                      border: 2,
                      borderColor: theme.palette.secondary.main,
                    }),
                  }}
                  onClick={() => date && onDateSelect(date)}
                >
                  {date && (
                    <>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isToday(date) ? 700 : isSelected(date) ? 600 : 500,
                          color: isToday(date) ? theme.palette.secondary.main : "inherit",
                        }}
                      >
                        {date.getDate()}
                      </Typography>
                      {stats && stats.total > 0 && (
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: "0.65rem",
                            color: theme.palette.text.secondary,
                            mt: 0.5,
                          }}
                        >
                          {stats.present + stats.late}/{stats.total}
                        </Typography>
                      )}
                    </>
                  )}
                </Box>
              </Tooltip>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default AttendanceCalendar;

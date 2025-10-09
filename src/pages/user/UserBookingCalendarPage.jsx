import React from "react";
import { useState } from "react";
import { Typography, Paper, Box, Container } from "@mui/material";
import UserLayout from "../../layouts/user/UserLayout";
import { CalendarToday } from "@mui/icons-material";
import Calendar from "../../components/calendar/Calendar";

const UserBookingCalendarPage = () => {
  const [selectedBranch] = useState("branch-001"); // This would come from user selection

  // Mock data - In a real app, this would come from your API
  const [availableSlots] = useState([
    // Yesterday's slots (past date example)
    {
      id: 0,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      time: "09:00 AM",
      duration: 60,
      available: true,
    },
    // Today's slots
    {
      id: 1,
      date: new Date().toISOString(),
      time: "09:00 AM",
      duration: 60,
      available: true,
    },
    {
      id: 2,
      date: new Date().toISOString(),
      time: "10:30 AM",
      duration: 60,
      available: true,
    },
    {
      id: 3,
      date: new Date().toISOString(),
      time: "02:00 PM",
      duration: 90,
      available: true,
    },
    // Tomorrow's slots
    {
      id: 4,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      time: "09:00 AM",
      duration: 60,
      available: true,
    },
    {
      id: 5,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      time: "11:00 AM",
      duration: 90,
      available: true,
    },
    {
      id: 6,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      time: "03:30 PM",
      duration: 60,
      available: true,
    },
    // Day after tomorrow
    {
      id: 7,
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      time: "10:00 AM",
      duration: 60,
      available: true,
    },
    {
      id: 8,
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      time: "01:00 PM",
      duration: 120,
      available: true,
    },
    // Next week slots (future dates)
    {
      id: 9,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      time: "09:00 AM",
      duration: 60,
      available: true,
    },
    {
      id: 10,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      time: "11:30 AM",
      duration: 90,
      available: true,
    },
    {
      id: 11,
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      time: "02:00 PM",
      duration: 60,
      available: true,
    },
  ]);

  const [existingBookings] = useState([
    {
      id: 1,
      date: new Date().toISOString(),
      time: "11:30 AM",
      service: "Oil Change",
      status: "confirmed",
      customer: "John Doe",
      vehicle: "2020 Toyota Camry",
    },
    {
      id: 2,
      date: new Date().toISOString(),
      time: "03:00 PM",
      service: "Brake Service",
      status: "pending",
      customer: "Jane Smith",
      vehicle: "2019 Honda Civic",
    },
    {
      id: 3,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      time: "01:30 PM",
      service: "General Inspection",
      status: "confirmed",
      customer: "Mike Johnson",
      vehicle: "2021 Ford F-150",
    },
  ]);

  return (
    <UserLayout>
      <Container
        maxWidth="xl"
        sx={{
          py: 3,
          bgcolor: "#ffffff",
          minHeight: "100vh",
        }}
      >
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CalendarToday color="primary" />
            Appointment Calendar
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View available slots and manage appointments for your selected
            branch
          </Typography>
        </Box>

        {/* Calendar Only - Full Width */}
        <Calendar
          branchId={selectedBranch}
          availableSlots={availableSlots}
          existingBookings={existingBookings}
        />
      </Container>
    </UserLayout>
  );
};

export default UserBookingCalendarPage;

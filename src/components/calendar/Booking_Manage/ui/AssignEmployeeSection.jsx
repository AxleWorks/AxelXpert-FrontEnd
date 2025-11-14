import React from "react";
import {
  Box,
  Stack,
  TextField,
  InputAdornment,
  Typography,
  Divider,
  Chip,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GroupIcon from "@mui/icons-material/Group";
import EmployeeSearchList from "../EmployeeSearchList";

export default function AssignEmployeeSection({
  employees,
  searchTerm,
  setSearchTerm,
  selectedEmployee,
  setSelectedEmployee,
}) {
  const availableEmployees = employees.filter(
    (e) => e.available || e.status === "available"
  );
  const busyEmployees = employees.filter(
    (e) => !e.available && e.status !== "available"
  );

  const availableCount = availableEmployees.length;
  const busyCount = busyEmployees.length;
  const totalCount = employees.length;

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <GroupIcon sx={{ color: "primary.main", fontSize: 24 }} />
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          Select Employee
        </Typography>
        <Stack direction="row" spacing={1} sx={{ ml: "auto" }}>
          <Chip
            label={`${availableCount} Available`}
            color="success"
            size="small"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            label={`${busyCount} Busy`}
            color="default"
            size="small"
            sx={{ fontWeight: 500 }}
          />
          <Chip
            label={`${totalCount} Total`}
            variant="outlined"
            size="small"
            sx={{ fontWeight: 500 }}
          />
        </Stack>
      </Stack>

      <TextField
        size="small"
        placeholder="Search by name, role, or branch..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "text.secondary" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": {
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.05)"
                : "white",
            borderRadius: 2,
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 2px 8px rgba(0,0,0,0.2)"
                : "0 2px 8px rgba(0,0,0,0.1)",
            "&:hover": {
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 4px 12px rgba(0,0,0,0.3)"
                  : "0 4px 12px rgba(0,0,0,0.15)",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "primary.main",
              },
            },
            "&.Mui-focused": {
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 4px 16px rgba(33, 150, 243, 0.3)"
                  : "0 4px 16px rgba(33, 150, 243, 0.2)",
            },
          },
        }}
      />

      {selectedEmployee && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, fontWeight: 600, color: "primary.main" }}
          >
            Selected Employee
          </Typography>
          <Box
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              borderRadius: 2,
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(33, 150, 243, 0.1)"
                  : "primary.50",
              border: "2px solid",
              borderColor: "primary.main",
            })}
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                fontWeight: 600,
              }}
            >
              {selectedEmployee.name?.[0]?.toUpperCase() ||
                selectedEmployee.username?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {selectedEmployee.name || selectedEmployee.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedEmployee.role} •{" "}
                {selectedEmployee.branchName || "Branch"}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
        </Box>
      )}

      {/* Available Employees Section */}
      {availableEmployees.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
          >
            Available Employees ({availableEmployees.length})
          </Typography>
          <EmployeeSearchList
            employees={availableEmployees}
            searchTerm={searchTerm}
            selectedEmployee={selectedEmployee}
            setSelectedEmployee={setSelectedEmployee}
            columns={2}
          />
        </Box>
      )}

      {/* Busy Employees Section */}
      {busyEmployees.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
          >
            Busy Employees ({busyEmployees.length})
          </Typography>
          <EmployeeSearchList
            employees={busyEmployees}
            searchTerm={searchTerm}
            selectedEmployee={selectedEmployee}
            setSelectedEmployee={setSelectedEmployee}
            columns={2}
          />
        </Box>
      )}

      {employees.length === 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 4,
            px: 2,
          }}
        >
          <GroupIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No employees available
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            There are currently no employees to assign to this appointment.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

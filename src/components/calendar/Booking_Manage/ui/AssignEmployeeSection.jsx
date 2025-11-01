import React from "react";
import { Box, Stack, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EmployeeSearchList from "../EmployeeSearchList";

export default function AssignEmployeeSection({
  employees,
  searchTerm,
  setSearchTerm,
  selectedEmployee,
  setSelectedEmployee,
}) {
  return (
    <Box>
      <TextField
        size="small"
        placeholder="Search employees by name or role..."
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
          mb: 1.5,
          "& .MuiOutlinedInput-root": {
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.05)"
                : "white",
            borderRadius: 2,
            "&:hover": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "primary.main",
              },
            },
          },
        }}
      />

      <EmployeeSearchList
        employees={employees}
        searchTerm={searchTerm}
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
      />
    </Box>
  );
}

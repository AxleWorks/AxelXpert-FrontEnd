import React from "react";
import { Box, Stack, TextField } from "@mui/material";
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
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ mt: 1, mb: 1 }}
      >
        <SearchIcon color="action" />
        <TextField
          size="small"
          placeholder="Search employees by name or role"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ ml: 1 }}
          fullWidth
        />
      </Stack>

      <EmployeeSearchList
        employees={employees}
        searchTerm={searchTerm}
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
      />
    </Box>
  );
}

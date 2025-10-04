import React from "react";
import {
  Box,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Button,
  Stack,
  Chip,
  Typography,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Today as TodayIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

export default function CalendarHeader({
  currentDate,
  onPrev,
  onNext,
  onToday,
  selectedBranch,
  setSelectedBranch,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  counts,
  branches,
}) {
  const getMonthYear = (date) =>
    date.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  return (
    <>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          size="small"
        >
          <MenuItem value="All">All Branches</MenuItem>
          {branches.map((b) => (
            <MenuItem key={b} value={b}>
              {b}
            </MenuItem>
          ))}
        </Select>

        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          size="small"
        >
          <MenuItem value="All">All Status</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Approved">Approved</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </Select>

        <TextField
          size="small"
          placeholder="Search by customer name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
            ),
          }}
          sx={{ minWidth: 240 }}
        />

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" startIcon={<TodayIcon />} onClick={onToday}>
          Today
        </Button>
        <IconButton onClick={onPrev}>
          <ChevronLeft />
        </IconButton>
        <IconButton onClick={onNext}>
          <ChevronRight />
        </IconButton>
      </Stack>

      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography variant="h6">{getMonthYear(currentDate)}</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Chip
          label={`Pending: ${counts.pending}`}
          color="warning"
          sx={{ mr: 1 }}
        />
        <Chip
          label={`Approved: ${counts.approved}`}
          color="success"
          sx={{ mr: 1 }}
        />
        <Chip label={`Completed: ${counts.completed}`} color="primary" />
      </Box>
    </>
  );
}

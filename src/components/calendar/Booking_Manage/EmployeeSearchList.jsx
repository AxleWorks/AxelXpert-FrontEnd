import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Typography,
  Chip,
  Stack,
  Badge,
  Tooltip,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import WorkIcon from "@mui/icons-material/Work";
import LocationOnIcon from "@mui/icons-material/LocationOn";

function initials(name) {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0] || "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function EmployeeSearchList({
  employees = [],
  searchTerm = "",
  selectedEmployee,
  setSelectedEmployee,
  columns = 1,
}) {
  const filtered = React.useMemo(() => {
    const q = (searchTerm || "").toLowerCase().trim();
    if (!q) return employees;
    return employees.filter((e) =>
      ((e.name || e.username) + " " + (e.role || "")).toLowerCase().includes(q)
    );
  }, [employees, searchTerm]);

  if (filtered.length === 0) {
    return (
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
        <PersonIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No employees found
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Try adjusting your search criteria or check if employees are available
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {filtered.map((emp) => {
        const isSelected = selectedEmployee?.id === emp.id;
        const isAvailable = emp.available || emp.status === "available";

        return (
          <Grid item xs={12} sm={columns === 2 ? 6 : 12} key={emp.id}>
            <Card
              onClick={() => setSelectedEmployee(emp)}
              sx={(theme) => ({
                cursor: "pointer",
                border: "2px solid",
                borderColor: isSelected ? "primary.main" : "transparent",
                borderRadius: 3,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: isSelected ? "translateY(-4px)" : "translateY(0)",
                boxShadow: isSelected
                  ? theme.palette.mode === "dark"
                    ? "0 8px 32px rgba(33, 150, 243, 0.3)"
                    : "0 8px 32px rgba(33, 150, 243, 0.2)"
                  : theme.palette.mode === "dark"
                  ? "0 2px 8px rgba(0,0,0,0.3)"
                  : "0 2px 8px rgba(0,0,0,0.1)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 6px 24px rgba(0,0,0,0.4)"
                      : "0 6px 24px rgba(0,0,0,0.15)",
                  borderColor: isSelected ? "primary.main" : "primary.light",
                },
                position: "relative",
                overflow: "visible",
              })}
            >
              {isSelected && (
                <Box
                  sx={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    zIndex: 1,
                  }}
                >
                  <Badge
                    badgeContent={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      "& .MuiBadge-badge": {
                        bgcolor: "primary.main",
                        color: "white",
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        boxShadow: 2,
                      },
                    }}
                  />
                </Box>
              )}

              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: isAvailable ? "success.main" : "grey.500",
                          border: "2px solid white",
                        }}
                      />
                    }
                  >
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: isAvailable ? "success.main" : "grey.500",
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        boxShadow: 2,
                      }}
                    >
                      {initials(emp.name || emp.username)}
                    </Avatar>
                  </Badge>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        mb: 0.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {emp.name || emp.username}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <WorkIcon
                        sx={{ fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        {emp.role || "Employee"}
                      </Typography>
                    </Stack>

                    {emp.branchName && (
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mb: 1 }}
                      >
                        <LocationOnIcon
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {emp.branchName}
                        </Typography>
                      </Stack>
                    )}

                    {emp.phone && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PhoneIcon
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {emp.phone}
                        </Typography>
                      </Stack>
                    )}
                  </Box>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}
                >
                  <Chip
                    label={isAvailable ? "Available" : "Busy"}
                    color={isAvailable ? "success" : "default"}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      height: 24,
                    }}
                  />
                  {emp.email && (
                    <Tooltip title={emp.email}>
                      <Chip
                        label="Contact"
                        size="small"
                        variant="outlined"
                        sx={{
                          fontWeight: 500,
                          fontSize: "0.75rem",
                          height: 24,
                        }}
                      />
                    </Tooltip>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

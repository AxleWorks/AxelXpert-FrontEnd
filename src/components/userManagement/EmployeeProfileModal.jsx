import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Typography,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { Button } from "../ui/button";
import axios from "axios";
import { USERS_URL } from "../../config/apiEndpoints.jsx";

export default function EmployeeProfileModal({ open, onClose, employee }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [userData, setUserData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (open && employee?.id) {
      setLoading(true);
      // Fetch fresh data from backend
      axios
        .get(`${USERS_URL}/${employee.id}`)
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
          // Fallback to provided employee data
          setUserData(employee);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, employee]);

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor: isDark
        ? "rgba(255, 255, 255, 0.02)"
        : "rgba(0, 0, 0, 0.02)",
      "& fieldset": {
        borderColor: isDark
          ? "rgba(255, 255, 255, 0.12)"
          : "rgba(0, 0, 0, 0.12)",
      },
      "&:hover fieldset": {
        borderColor: isDark
          ? "rgba(255, 255, 255, 0.12)"
          : "rgba(0, 0, 0, 0.12)",
      },
      "&.Mui-focused fieldset": {
        borderColor: isDark
          ? "rgba(255, 255, 255, 0.12)"
          : "rgba(0, 0, 0, 0.12)",
      },
      "&.Mui-disabled": {
        backgroundColor: isDark
          ? "rgba(255, 255, 255, 0.02)"
          : "rgba(0, 0, 0, 0.02)",
      },
    },
    "& .MuiInputBase-input": {
      padding: "12px 14px",
      cursor: "default",
    },
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: isDark
        ? "rgba(255, 255, 255, 0.87)"
        : "rgba(0, 0, 0, 0.87)",
    },
  };

  const labelStyles = {
    mb: 1,
    color: "text.secondary",
    fontSize: "0.875rem",
    fontWeight: 500,
  };

  if (loading || !userData) {
    return (
      <Dialog
        open={!!open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: isDark ? "grey.900" : "background.paper",
            backgroundImage: "none",
            borderRadius: 3,
            boxShadow: isDark
              ? "0 20px 60px rgba(0, 0, 0, 0.6)"
              : "0 20px 60px rgba(0, 0, 0, 0.15)",
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: "blur(10px)",
              backgroundColor: isDark
                ? "rgba(0, 0, 0, 0.75)"
                : "rgba(0, 0, 0, 0.4)",
            },
          },
        }}
      >
        <DialogContent sx={{ px: 3, py: 4, textAlign: "center" }}>
          <Typography>Loading...</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={!!open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: isDark ? "grey.900" : "background.paper",
          backgroundImage: "none",
          borderRadius: 3,
          boxShadow: isDark
            ? "0 20px 60px rgba(0, 0, 0, 0.6)"
            : "0 20px 60px rgba(0, 0, 0, 0.15)",
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(10px)",
            backgroundColor: isDark
              ? "rgba(0, 0, 0, 0.75)"
              : "rgba(0, 0, 0, 0.4)",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
          pt: 3,
          px: 3,
          borderBottom: 1,
          borderColor: isDark ? "grey.800" : "grey.200",
          bgcolor: isDark
            ? alpha(theme.palette.info.dark, 0.05)
            : alpha(theme.palette.info.light, 0.05),
        }}
      >
        <Box
          sx={{
            fontSize: "1.35rem",
            fontWeight: 700,
            color: isDark ? "grey.50" : "grey.900",
            letterSpacing: "-0.02em",
          }}
        >
          View Profile
        </Box>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          size="small"
          sx={{
            color: isDark ? "grey.400" : "grey.600",
            transition: "all 0.2s ease",
            "&:hover": {
              color: isDark ? "grey.100" : "grey.900",
              bgcolor: isDark
                ? alpha(theme.palette.error.dark, 0.2)
                : alpha(theme.palette.error.light, 0.15),
              transform: "rotate(90deg)",
            },
          }}
        >
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: 3, py: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
          {/* User Name */}
          <Box>
            <Typography variant="body2" sx={labelStyles}>
              User Name
            </Typography>
            <TextField
              value={userData.username || ""}
              fullWidth
              disabled
              sx={inputStyles}
            />
          </Box>

          {/* Email */}
          <Box>
            <Typography variant="body2" sx={labelStyles}>
              Email
            </Typography>
            <TextField
              value={userData.email || ""}
              fullWidth
              disabled
              sx={inputStyles}
            />
          </Box>

          {/* Role */}
          <Box>
            <Typography variant="body2" sx={labelStyles}>
              Role
            </Typography>
            <TextField
              value={userData.role || ""}
              fullWidth
              disabled
              sx={{
                ...inputStyles,
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: isDark
                    ? "rgba(255, 255, 255, 0.87)"
                    : "rgba(0, 0, 0, 0.87)",
                  textTransform: "capitalize",
                },
              }}
            />
          </Box>

          {/* Branch */}
          <Box>
            <Typography variant="body2" sx={labelStyles}>
              Branch
            </Typography>
            <TextField
              value={userData.branchName || "No Branch"}
              fullWidth
              disabled
              sx={inputStyles}
            />
          </Box>

          {/* Phone Number */}
          <Box>
            <Typography variant="body2" sx={labelStyles}>
              Phone Number
            </Typography>
            <TextField
              value={userData.phoneNumber || "N/A"}
              fullWidth
              disabled
              sx={inputStyles}
            />
          </Box>

          {/* Address */}
          <Box>
            <Typography variant="body2" sx={labelStyles}>
              Address
            </Typography>
            <TextField
              value={userData.address || "N/A"}
              fullWidth
              disabled
              sx={inputStyles}
            />
          </Box>

          {/* Status */}
          <Box>
            <Typography variant="body2" sx={labelStyles}>
              Status
            </Typography>
            <TextField
              value={
                userData.isBlocked
                  ? "Blocked"
                  : userData.isActive
                  ? "Active"
                  : "Inactive"
              }
              fullWidth
              disabled
              sx={{
                ...inputStyles,
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: userData.isBlocked
                    ? "#ef4444"
                    : userData.isActive
                    ? "#10b981"
                    : "#f59e0b",
                  fontWeight: 500,
                },
              }}
            />
          </Box>

          {/* Created At */}
          <Box>
            <Typography variant="body2" sx={labelStyles}>
              Created At
            </Typography>
            <TextField
              value={
                userData.createdAt
                  ? new Date(userData.createdAt).toLocaleString()
                  : "N/A"
              }
              fullWidth
              disabled
              sx={inputStyles}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{ px: 3, pb: 3, pt: 2, gap: 2, justifyContent: "flex-end" }}
      >
        <Button
          onClick={onClose}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1.5,
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 500,
            backgroundColor: "#0b75d9",
            color: "white",
            "&:hover": {
              backgroundColor: "#0765b6",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

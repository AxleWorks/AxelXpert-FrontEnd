import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Typography,
} from "@mui/material";
import { Button } from "../ui/button";
import axios from "axios";
import { USERS_URL } from "../../config/apiEndpoints.jsx";

export default function EmployeeProfileModal({ open, onClose, employee }) {
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
      backgroundColor: "rgba(0, 0, 0, 0.02)",
      "& fieldset": {
        borderColor: "rgba(0, 0, 0, 0.12)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(0, 0, 0, 0.12)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "rgba(0, 0, 0, 0.12)",
      },
      "&.Mui-disabled": {
        backgroundColor: "rgba(0, 0, 0, 0.02)",
      },
    },
    "& .MuiInputBase-input": {
      padding: "12px 14px",
      cursor: "default",
    },
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "rgba(0, 0, 0, 0.87)",
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
            borderRadius: 3,
            p: 1,
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
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1.5rem",
          fontWeight: 600,
          pb: 2,
          pt: 3,
          px: 3,
        }}
      >
        View Profile
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
                  WebkitTextFillColor: "rgba(0, 0, 0, 0.87)",
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

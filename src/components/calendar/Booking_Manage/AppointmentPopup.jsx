import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Modal,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  IconButton,
  Avatar,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SearchIcon from "@mui/icons-material/Search";
import EmployeeSearchList from "./EmployeeSearchList";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(92vw, 520px)",
  maxHeight: "86vh",
  overflowY: "auto",
  p: 3,
  borderRadius: 2,
  boxShadow: "0 12px 40px rgba(2,6,23,0.4)",
};

function initials(name) {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0] || "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * AppointmentPopup - single default export
 *
 * Props:
 *  - open, onClose, appointment
 *  - employees (array)
 *  - onApprove(selectedEmployee), onReject()
 *  - selectedEmployee (object | null), setSelectedEmployee(fn)
 */
export default function AppointmentPopup({
  open,
  onClose,
  appointment,
  employees = [],
  onApprove,
  onReject,
  selectedEmployee,
  setSelectedEmployee,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!open) {
      setSearchTerm("");
      // optionally: clear selection when modal closes
      // setSelectedEmployee && setSelectedEmployee(null);
    }
  }, [open, setSelectedEmployee]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropProps={{
        sx: {
          backdropFilter: "blur(6px)",
          backgroundColor: "rgba(0,0,0,0.36)",
        },
      }}
    >
      <Paper sx={style}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <Box>
            <Typography variant="h6">Slot Details</Typography>
            <Typography variant="caption" color="text.secondary">
              Review and assign an employee or reject the request
            </Typography>
          </Box>
          <IconButton onClick={onClose} color="inherit">
            <CloseIcon />
          </IconButton>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {appointment ? (
          <Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                {initials(appointment.customer)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1">
                  {appointment.customer}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {appointment.vehicle} • {appointment.service}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                  <Chip label={appointment.time} size="small" />
                  <Chip
                    label={appointment.branch}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={appointment.status}
                    size="small"
                    color={
                      appointment.status === "Pending"
                        ? "warning"
                        : appointment.status === "Approved"
                        ? "success"
                        : appointment.status === "Completed"
                        ? "primary"
                        : "default"
                    }
                  />
                </Stack>
              </Box>
            </Stack>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Contact</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {appointment.phone || "—"}
              </Typography>

              {appointment.notes && (
                <>
                  <Typography variant="subtitle2">Customer Notes</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {appointment.notes}
                  </Typography>
                </>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2">Assign Employee</Typography>

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

              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                  startIcon={<CheckCircleIcon />}
                  variant="contained"
                  color="success"
                  onClick={() => onApprove(selectedEmployee)}
                  disabled={!selectedEmployee}
                >
                  Approve & Assign
                </Button>

                <Button
                  startIcon={<HighlightOffIcon />}
                  variant="outlined"
                  color="error"
                  onClick={() => onReject()}
                >
                  Reject
                </Button>

                <Box sx={{ flexGrow: 1 }} />
                <Button onClick={onClose}>Close</Button>
              </Stack>
            </Box>
          </Box>
        ) : null}
      </Paper>
    </Modal>
  );
}

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
  Alert,
  AlertTitle,
  CircularProgress,
} from "@mui/material";
import {
  AssignmentInd as AssignmentIndIcon,
  PersonRemove as PersonRemoveIcon,
} from "@mui/icons-material";
import AppointmentHeader from "./ui/AppointmentHeader";
import AppointmentDetails from "./ui/AppointmentDetails";
import AssignEmployeeSection from "./ui/AssignEmployeeSection";
import { API_BASE, API_PREFIX } from "../../../config/apiEndpoints.jsx";
import AppointmentActions from "./ui/AppointmentActions";
import RejectionDialog from "./ui/RejectionDialog";
import { getAuthHeader } from "../../../utils/jwtUtils";

const getModalStyle = (theme) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(95vw, 900px)",
  maxHeight: "90vh",
  overflowY: "auto",
  p: 0,
  borderRadius: 4,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 25px 80px rgba(0,0,0,0.8)"
      : "0 25px 80px rgba(0,0,0,0.3)",
  background:
    theme.palette.mode === "dark"
      ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`
      : "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
  border:
    theme.palette.mode === "dark"
      ? `1px solid ${theme.palette.divider}`
      : "none",
});

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
  apiBase = `${API_BASE}${API_PREFIX}`,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isUnassigning, setIsUnassigning] = useState(false);
  const [unassignConfirmOpen, setUnassignConfirmOpen] = useState(false);

  // Check if appointment is already approved/assigned
  const isAlreadyAssigned = useMemo(() => {
    return appointment?.assignedEmployee || appointment?.assignedEmployeeName;
  }, [appointment]);

  // Unassign employee (set to null) using PUT method
  const handleUnassignEmployee = async () => {
    if (!appointment) return;

    setIsUnassigning(true);
    try {
      const authHeader = getAuthHeader();
      const res = await fetch(`${apiBase}/bookings/${appointment.id}/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authHeader && { Authorization: authHeader }),
        },
        body: JSON.stringify({ employeeId: null }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Unassign failed:", errText);
        alert("Failed to unassign employee. Please try again.");
        return;
      }

      const updated = await res.json();
      // Clear selected employee and notify parent
      setSelectedEmployee && setSelectedEmployee(null);
      onApprove && onApprove(null, updated);
      // Don't close modal, allow reassignment
    } catch (err) {
      console.error("Unassign error:", err);
      alert("Error unassigning employee. Please try again.");
    } finally {
      setIsUnassigning(false);
    }
  };

  // Approve and assign an employee by calling backend, then notify parent
  const handleApproveClick = async (employee) => {
    if (!appointment) return;
    if (!employee) {
      // guard - UI already disables button, but double-check
      console.warn("No employee selected for approval");
      return;
    }

    try {
      const authHeader = getAuthHeader();
      const res = await fetch(`${apiBase}/bookings/${appointment.id}/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authHeader && { Authorization: authHeader }),
        },
        body: JSON.stringify({ employeeId: employee.id }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Assign failed:", errText);
        return;
      }

      const updated = await res.json();
      // let parent update its local state
      onApprove && onApprove(employee, updated);
      onClose && onClose();
    } catch (err) {
      console.error("Assign error:", err);
    }
  };

  // Open rejection dialog
  const handleRejectClick = () => {
    setRejectionDialogOpen(true);
  };

  // Handle rejection with custom reason
  const handleConfirmReject = async (reason) => {
    if (!appointment) return;

    setIsRejecting(true);
    try {
      const authHeader = getAuthHeader();
      const res = await fetch(`${apiBase}/bookings/${appointment.id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authHeader && { Authorization: authHeader }),
        },
        body: JSON.stringify({ reason: reason.trim() }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Reject failed:", errText);
        return;
      }

      const updated = await res.json();
      onReject && onReject(updated);
      setRejectionDialogOpen(false);
      onClose && onClose();
    } catch (err) {
      console.error("Reject error:", err);
    } finally {
      setIsRejecting(false);
    }
  };

  // Handle unassign confirmation
  const handleUnassignClick = () => {
    setUnassignConfirmOpen(true);
  };

  const handleUnassignConfirm = async () => {
    setUnassignConfirmOpen(false);
    await handleUnassignEmployee();
  };

  const handleUnassignCancel = () => {
    setUnassignConfirmOpen(false);
  };

  // Handle rejection dialog close
  const handleRejectDialogClose = () => {
    setRejectionDialogOpen(false);
  };

  useEffect(() => {
    if (!open) {
      setSearchTerm("");
      setRejectionDialogOpen(false);
      setIsRejecting(false);
      setUnassignConfirmOpen(false);
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
          backdropFilter: "blur(12px)",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(0,0,0,0.8)"
              : "rgba(0,0,0,0.6)",
        },
      }}
    >
      <Paper sx={(theme) => getModalStyle(theme)} elevation={24}>
        <Box sx={{ p: 4, pb: 3 }}>
          <AppointmentHeader
            title="Appointment Management"
            subtitle={
              isAlreadyAssigned
                ? "Review current assignment and manage employee allocation"
                : "Review details and assign an available employee"
            }
            onClose={onClose}
          />
        </Box>

        <Divider />

        {appointment ? (
          <Box
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              minHeight: "70vh",
            }}
          >
            <AppointmentDetails appointment={appointment} />

            {/* Current Assignment Management Section */}
            {isAlreadyAssigned && (
              <Box
                sx={(theme) => ({
                  mb: 4,
                  p: 3,
                  borderRadius: 3,
                  border: "2px solid",
                  borderColor: "warning.main",
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 193, 7, 0.1)"
                      : "rgba(255, 193, 7, 0.05)",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 4px 16px rgba(255, 193, 7, 0.2)"
                      : "0 4px 16px rgba(255, 193, 7, 0.1)",
                })}
              >
                <Stack
                  direction="row"
                  spacing={3}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "warning.main",
                      color: "warning.contrastText",
                    }}
                  >
                    <AssignmentIndIcon sx={{ fontSize: 24 }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}
                    >
                      Current Assignment
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage the employee currently assigned to this appointment
                    </Typography>
                  </Box>
                </Stack>

                <Box
                  sx={(theme) => ({
                    p: 2.5,
                    borderRadius: 2,
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "white",
                    border: "1px solid",
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.1)"
                        : "grey.200",
                  })}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "warning.main",
                        width: 48,
                        height: 48,
                        fontWeight: 600,
                      }}
                    >
                      {initials(
                        appointment.assignedEmployee ||
                          appointment.assignedEmployeeName
                      )}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        {appointment.assignedEmployee ||
                          appointment.assignedEmployeeName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Currently assigned to this appointment
                      </Typography>
                    </Box>
                    <Chip
                      label="Assigned"
                      color="warning"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        height: 28,
                      }}
                    />
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <Button
                      startIcon={<PersonRemoveIcon />}
                      variant="outlined"
                      color="warning"
                      onClick={handleUnassignClick}
                      disabled={isUnassigning}
                      sx={{
                        fontWeight: 600,
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        borderWidth: 2,
                        textTransform: "none",
                        "&:hover": {
                          borderWidth: 2,
                          bgcolor: "warning.50",
                          transform: "translateY(-1px)",
                        },
                        "&:disabled": {
                          opacity: 0.6,
                        },
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      Unassign Employee
                    </Button>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ alignSelf: "center" }}
                    >
                      This will remove the current assignment and allow
                      reassignment
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            )}

            <Box
              sx={(theme) => ({
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.03)"
                    : "grey.50",
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.08)"
                    : "grey.200",
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 4px 12px rgba(0,0,0,0.2)"
                    : "0 4px 12px rgba(0,0,0,0.08)",
                flex: 1,
              })}
            >
              <AssignEmployeeSection
                employees={employees}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedEmployee={selectedEmployee}
                setSelectedEmployee={setSelectedEmployee}
              />
            </Box>

            {/* Spacer to push actions to bottom */}
            <Box sx={{ flex: 1 }} />

            {/* Sticky Actions Footer */}
            <Box
              sx={(theme) => ({
                position: "sticky",
                bottom: 0,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(0,0,0,0.8)"
                    : "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                borderTop: "1px solid",
                borderColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "grey.200",
                p: 3,
                mt: 3,
                borderRadius: "0 0 12px 12px",
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 -4px 20px rgba(0,0,0,0.3)"
                    : "0 -4px 20px rgba(0,0,0,0.1)",
              })}
            >
              <AppointmentActions
                onApprove={() => handleApproveClick(selectedEmployee)}
                onReject={() => handleRejectClick()}
                onClose={onClose}
                selectedEmployee={selectedEmployee}
                isAlreadyAssigned={isAlreadyAssigned}
              />
            </Box>
          </Box>
        ) : null}

        {/* Rejection Dialog */}
        <RejectionDialog
          open={rejectionDialogOpen}
          onClose={handleRejectDialogClose}
          onConfirm={handleConfirmReject}
          loading={isRejecting}
        />

        {/* Unassign Confirmation Dialog */}
        <Modal
          open={unassignConfirmOpen}
          onClose={handleUnassignCancel}
          closeAfterTransition
          BackdropProps={{
            sx: {
              backdropFilter: "blur(8px)",
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(0,0,0,0.7)"
                  : "rgba(0,0,0,0.5)",
            },
          }}
        >
          <Paper
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "min(90vw, 400px)",
              p: 0,
              borderRadius: 3,
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 20px 60px rgba(0,0,0,0.7)"
                  : "0 20px 60px rgba(0,0,0,0.3)",
            }}
            elevation={24}
          >
            <Box sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 2, color: "warning.main" }}
              >
                Confirm Unassignment
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 3, color: "text.secondary" }}
              >
                Are you sure you want to unassign{" "}
                <strong>
                  {appointment?.assignedEmployee ||
                    appointment?.assignedEmployeeName}
                </strong>{" "}
                from this appointment? This action cannot be undone.
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  onClick={handleUnassignCancel}
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: 2,
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUnassignConfirm}
                  variant="contained"
                  color="warning"
                  disabled={isUnassigning}
                  sx={{
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: 2,
                    "&:disabled": {
                      opacity: 0.6,
                    },
                  }}
                >
                  {isUnassigning ? (
                    <>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      Unassigning...
                    </>
                  ) : (
                    "Confirm Unassign"
                  )}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Modal>
      </Paper>
    </Modal>
  );
}

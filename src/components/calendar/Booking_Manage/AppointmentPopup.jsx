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
} from "@mui/material";
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
  width: "min(92vw, 580px)",
  maxHeight: "90vh",
  overflowY: "auto",
  p: 0,
  borderRadius: 3,
  boxShadow: theme.palette.mode === 'dark' 
    ? "0 20px 60px rgba(0,0,0,0.7)" 
    : "0 20px 60px rgba(0,0,0,0.3)",
  background: theme.palette.mode === 'dark'
    ? `linear-gradient(to bottom, ${theme.palette.background.paper}, ${theme.palette.background.default})`
    : "linear-gradient(to bottom, #ffffff, #fafafa)",
  border: theme.palette.mode === 'dark' ? `1px solid ${theme.palette.divider}` : 'none',
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
        method: "PUT",
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

  // Handle rejection dialog close
  const handleRejectDialogClose = () => {
    setRejectionDialogOpen(false);
  };

  useEffect(() => {
    if (!open) {
      setSearchTerm("");
      setRejectionDialogOpen(false);
      setIsRejecting(false);
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
          backdropFilter: "blur(8px)",
          backgroundColor: (theme) => 
            theme.palette.mode === 'dark' 
              ? "rgba(0,0,0,0.7)" 
              : "rgba(0,0,0,0.5)",
        },
      }}
    >
      <Paper sx={(theme) => getModalStyle(theme)} elevation={24}>
        <Box sx={{ p: 3, pb: 2 }}>
          <AppointmentHeader
            title="Appointment Details"
            subtitle={
              isAlreadyAssigned
                ? "Employee already assigned • Reassign or manage appointment"
                : "Review and assign an employee or reject the request"
            }
            onClose={onClose}
          />
        </Box>

        <Divider />

        {appointment ? (
          <Box sx={{ p: 3 }}>
            <AppointmentDetails appointment={appointment} />

            {/* Alert for already assigned appointments */}
            {isAlreadyAssigned && (
              <Alert
                severity="info"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  "& .MuiAlert-icon": {
                    fontSize: 28,
                  },
                }}
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={handleUnassignEmployee}
                    disabled={isUnassigning}
                    sx={{ fontWeight: 600 }}
                  >
                    {isUnassigning ? "Unassigning..." : "Unassign"}
                  </Button>
                }
              >
                <AlertTitle sx={{ fontWeight: 600 }}>
                  Employee Already Assigned
                </AlertTitle>
                {appointment.assignedEmployee ||
                  appointment.assignedEmployeeName}{" "}
                is currently assigned to this appointment. Click "Unassign" to
                reassign a different employee.
              </Alert>
            )}

            <Box
              sx={(theme) => ({
                bgcolor: theme.palette.mode === 'dark' 
                  ? "rgba(255,255,255,0.05)" 
                  : "grey.50",
                p: 2.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: theme.palette.mode === 'dark' 
                  ? "rgba(255,255,255,0.1)" 
                  : "grey.200",
              })}
            >
              <Typography
                variant="subtitle2"
                sx={{ mb: 1.5, fontWeight: 600, color: "text.primary" }}
              >
                {isAlreadyAssigned ? "Reassign Employee" : "Assign Employee"}
              </Typography>
              <AssignEmployeeSection
                employees={employees}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedEmployee={selectedEmployee}
                setSelectedEmployee={setSelectedEmployee}
              />
            </Box>

            <Box sx={{ mt: 3 }}>
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
      </Paper>
    </Modal>
  );
}

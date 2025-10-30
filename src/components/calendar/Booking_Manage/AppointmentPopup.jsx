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
import AppointmentHeader from "./ui/AppointmentHeader";
import AppointmentDetails from "./ui/AppointmentDetails";
import AssignEmployeeSection from "./ui/AssignEmployeeSection";
import { API_BASE, API_PREFIX } from "../../../config/apiEndpoints.jsx";
import AppointmentActions from "./ui/AppointmentActions";
import RejectionDialog from "./ui/RejectionDialog";
import { getAuthHeader } from "../../../utils/jwtUtils";

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
  apiBase = `${API_BASE}${API_PREFIX}`,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

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
          backdropFilter: "blur(6px)",
          backgroundColor: "rgba(0,0,0,0.36)",
        },
      }}
    >
      <Paper sx={style}>
        <AppointmentHeader
          title="Slot Details"
          subtitle="Review and assign an employee or reject the request"
          onClose={onClose}
        />

        <Divider sx={{ mb: 2 }} />

        {appointment ? (
          <Box>
            <AppointmentDetails appointment={appointment} />

            <Typography variant="subtitle2">Assign Employee</Typography>
            <AssignEmployeeSection
              employees={employees}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedEmployee={selectedEmployee}
              setSelectedEmployee={setSelectedEmployee}
            />

            <AppointmentActions
              onApprove={() => handleApproveClick(selectedEmployee)}
              onReject={() => handleRejectClick()}
              onClose={onClose}
              selectedEmployee={selectedEmployee}
            />
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

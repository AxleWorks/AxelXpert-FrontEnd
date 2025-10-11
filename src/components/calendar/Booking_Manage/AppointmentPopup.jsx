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
import AppointmentActions from "./ui/AppointmentActions";

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
              onApprove={onApprove}
              onReject={onReject}
              onClose={onClose}
              selectedEmployee={selectedEmployee}
            />
          </Box>
        ) : null}
      </Paper>
    </Modal>
  );
}

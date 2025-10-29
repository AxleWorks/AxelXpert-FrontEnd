import React from "react";
import { Stack, Button, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

export default function AppointmentActions({
  onApprove,
  onReject,
  onClose,
  selectedEmployee,
}) {
  return (
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
  );
}

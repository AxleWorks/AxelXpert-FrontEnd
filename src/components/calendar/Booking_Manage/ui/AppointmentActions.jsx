import React from "react";
import { Stack, Button, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

export default function AppointmentActions({
  onApprove,
  onReject,
  onClose,
  selectedEmployee,
  isAlreadyAssigned = false,
}) {
  return (
    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
      <Button
        startIcon={isAlreadyAssigned ? <SwapHorizIcon /> : <CheckCircleIcon />}
        variant="contained"
        color={isAlreadyAssigned ? "primary" : "success"}
        onClick={() => onApprove(selectedEmployee)}
        disabled={!selectedEmployee}
        sx={{
          fontWeight: 600,
          px: 3,
          py: 1.2,
          boxShadow: 2,
          "&:hover": {
            boxShadow: 4,
          },
        }}
      >
        {isAlreadyAssigned ? "Reassign Employee" : "Approve & Assign"}
      </Button>

      <Button
        startIcon={<HighlightOffIcon />}
        variant="outlined"
        color="error"
        onClick={() => onReject()}
        sx={(theme) => ({
          fontWeight: 600,
          px: 3,
          py: 1.2,
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(244, 67, 54, 0.1)"
                : "error.50",
          },
        })}
      >
        Reject
      </Button>

      <Box sx={{ flexGrow: 1 }} />
      <Button
        onClick={onClose}
        variant="text"
        sx={{
          fontWeight: 500,
          color: "text.secondary",
        }}
      >
        Close
      </Button>
    </Stack>
  );
}

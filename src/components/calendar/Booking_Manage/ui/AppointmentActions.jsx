import React from "react";
import { Stack, Button, Box, Divider } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CloseIcon from "@mui/icons-material/Close";

export default function AppointmentActions({
  onApprove,
  onReject,
  onClose,
  selectedEmployee,
  isAlreadyAssigned = false,
}) {
  return (
    <Box>
      <Divider sx={{ mb: 3 }} />
      <Stack direction="row" spacing={3} sx={{ alignItems: "center" }}>
        <Button
          startIcon={
            isAlreadyAssigned ? <SwapHorizIcon /> : <CheckCircleIcon />
          }
          variant="contained"
          color={isAlreadyAssigned ? "primary" : "success"}
          onClick={() => onApprove(selectedEmployee)}
          disabled={!selectedEmployee}
          sx={{
            fontWeight: 600,
            px: 4,
            py: 1.5,
            borderRadius: 3,
            boxShadow: 3,
            textTransform: "none",
            fontSize: "1rem",
            "&:hover": {
              boxShadow: 4,
              transform: "translateY(-1px)",
            },
            "&:disabled": {
              opacity: 0.6,
            },
            transition: "all 0.2s ease-in-out",
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
            px: 4,
            py: 1.5,
            borderRadius: 3,
            borderWidth: 2,
            textTransform: "none",
            fontSize: "1rem",
            "&:hover": {
              borderWidth: 2,
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(244, 67, 54, 0.1)"
                  : "error.50",
              boxShadow: 2,
            },
            transition: "all 0.2s ease-in-out",
          })}
        >
          Reject Request
        </Button>

        <Box sx={{ flexGrow: 1 }} />
        <Button
          startIcon={<CloseIcon />}
          onClick={onClose}
          variant="text"
          sx={{
            fontWeight: 500,
            color: "text.secondary",
            px: 3,
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            "&:hover": {
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.05)"
                  : "grey.100",
            },
          }}
        >
          Close
        </Button>
      </Stack>
    </Box>
  );
}

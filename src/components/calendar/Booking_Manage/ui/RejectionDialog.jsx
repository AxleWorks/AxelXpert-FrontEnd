import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  IconButton
} from "@mui/material";
import { Close, HighlightOff } from "@mui/icons-material";

export default function RejectionDialog({
  open,
  onClose,
  onConfirm,
  loading = false
}) {
  const [reason, setReason] = useState("Rejected by manager");

  useEffect(() => {
    if (open) {
      setReason("Rejected by manager");
    }
  }, [open]);

  const handleConfirm = () => {
    onConfirm(reason);
  };

  const handleClose = () => {
    setReason("Rejected by manager");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }
      }}
    >
      <Box sx={{ position: 'relative', p: 2 }}>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'grey.500'
          }}
          size="small"
        >
          <Close size={20} />
        </IconButton>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mt: 2 }}>
          <Box sx={{ mb: 2 }}>
            <HighlightOff sx={{ fontSize: 48, color: 'error.main' }} />
          </Box>

          <DialogTitle sx={{ p: 0, mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Reject Appointment
            </Typography>
          </DialogTitle>

          <DialogContent sx={{ p: 0, mb: 3, width: '100%' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.95rem', mb: 3 }}>
              Please provide a reason for rejecting this appointment. This will help the customer understand the decision.
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Rejection Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              variant="outlined"
              sx={{ mt: 1 }}
            />
          </DialogContent>

          <DialogActions sx={{ p: 0, gap: 1, width: '100%', justifyContent: 'center' }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              disabled={loading}
              sx={{ minWidth: 100 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              color="error"
              variant="contained"
              disabled={loading || !reason.trim()}
              sx={{ minWidth: 100 }}
            >
              {loading ? 'Rejecting...' : 'Reject'}
            </Button>
          </DialogActions>
        </Box>
      </Box>
    </Dialog>
  );
}
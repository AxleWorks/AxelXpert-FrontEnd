import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import { WarningAmber } from "@mui/icons-material";

const DeleteConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  subTaskTitle,
  loading,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor:
            theme.palette.mode === "dark" ? "grey.900" : "background.paper",
          backgroundImage: "none",
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(8px)",
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(0, 0, 0, 0.7)"
                : "rgba(0, 0, 0, 0.5)",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <WarningAmber
            sx={{
              color:
                theme.palette.mode === "dark" ? "error.light" : "error.main",
              fontSize: 28,
            }}
          />
          <Typography variant="h6" fontWeight={600}>
            Delete SubTask?
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Are you sure you want to delete this subtask?
        </Typography>
        <Box
          sx={{
            bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.100",
            p: 1.5,
            borderRadius: 1.5,
            borderLeft: 3,
            borderColor:
              theme.palette.mode === "dark" ? "error.light" : "error.main",
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            {subTaskTitle}
          </Typography>
        </Box>
        <Typography
          variant="caption"
          color="error"
          sx={{ display: "block", mt: 1.5 }}
        >
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          gap: 1,
        }}
      >
        <Button onClick={onClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          disableElevation
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;

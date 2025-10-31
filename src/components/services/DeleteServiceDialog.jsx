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

const DeleteServiceDialog = ({
  open,
  onClose,
  onConfirm,
  serviceName,
  loading,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: isDark ? "grey.900" : "background.paper",
          backgroundImage: "none",
          borderRadius: 2,
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(8px)",
            backgroundColor: isDark
              ? "rgba(0, 0, 0, 0.7)"
              : "rgba(0, 0, 0, 0.5)",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          pt: 2.5,
          px: 3,
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <WarningAmber
            sx={{
              color: isDark ? "error.light" : "error.main",
              fontSize: 28,
            }}
          />
          <Typography variant="h6" fontWeight={600}>
            Delete Service?
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Are you sure you want to delete this service?
        </Typography>
        <Box
          sx={{
            bgcolor: isDark ? "grey.800" : "grey.100",
            p: 1.5,
            borderRadius: 1.5,
            borderLeft: 3,
            borderColor: isDark ? "error.light" : "error.main",
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            {serviceName}
          </Typography>
        </Box>
        <Typography
          variant="caption"
          color="error"
          sx={{ display: "block", mt: 1.5 }}
        >
          This action cannot be undone. All associated subtasks will also be
          deleted.
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 2.5,
          gap: 1.5,
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          color="inherit"
          sx={{
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          disableElevation
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 3,
          }}
        >
          {loading ? "Deleting..." : "Delete Service"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteServiceDialog;

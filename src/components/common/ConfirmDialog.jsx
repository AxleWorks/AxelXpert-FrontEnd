import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

/**
 * Modern, reusable confirmation dialog component
 *
 * @param {boolean} open - Controls dialog visibility
 * @param {function} onClose - Called when dialog is closed without confirmation
 * @param {function} onConfirm - Called when user confirms the action
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message/description
 * @param {string} confirmText - Confirm button text (default: "Confirm")
 * @param {string} cancelText - Cancel button text (default: "Cancel")
 * @param {string} severity - Dialog severity: "warning", "error", "info", "success" (default: "warning")
 * @param {boolean} loading - Shows loading state on confirm button
 */
const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  severity = "warning",
  loading = false,
}) => {
  const getSeverityConfig = () => {
    switch (severity) {
      case "error":
        return {
          icon: DeleteIcon,
          color: "error.main",
          bgColor: "rgba(239, 68, 68, 0.1)",
          confirmColor: "error",
        };
      case "warning":
        return {
          icon: WarningIcon,
          color: "warning.main",
          bgColor: "rgba(245, 158, 11, 0.1)",
          confirmColor: "warning",
        };
      case "success":
        return {
          icon: CheckIcon,
          color: "success.main",
          bgColor: "rgba(16, 185, 129, 0.1)",
          confirmColor: "success",
        };
      case "info":
      default:
        return {
          icon: InfoIcon,
          color: "info.main",
          bgColor: "rgba(59, 130, 246, 0.1)",
          confirmColor: "primary",
        };
    }
  };

  const config = getSeverityConfig();
  const IconComponent = config.icon;

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: "0 24px 48px rgba(0,0,0,0.25)",
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          pb: 2,
          pt: 3,
          px: 3,
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: config.bgColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconComponent sx={{ color: config.color, fontSize: 28 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
          {title}
        </Typography>
        {!loading && (
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: "text.secondary",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 2 }}>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ lineHeight: 1.7 }}
        >
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1.5 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          variant="outlined"
          size="large"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            flex: 1,
            borderWidth: 2,
            "&:hover": {
              borderWidth: 2,
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          color={config.confirmColor}
          size="large"
          startIcon={
            loading ? <CircularProgress size={20} color="inherit" /> : null
          }
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            flex: 1,
            boxShadow: "0 4px 14px 0 rgba(0, 0, 0, 0.2)",
            "&:hover": {
              boxShadow: "0 6px 20px 0 rgba(0, 0, 0, 0.3)",
            },
          }}
        >
          {loading ? "Processing..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;

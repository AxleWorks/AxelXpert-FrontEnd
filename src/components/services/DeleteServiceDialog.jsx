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
  alpha,
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
          borderRadius: 3,
          boxShadow: isDark
            ? "0 20px 60px rgba(0, 0, 0, 0.6)"
            : "0 20px 60px rgba(0, 0, 0, 0.15)",
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(10px)",
            backgroundColor: isDark
              ? "rgba(0, 0, 0, 0.75)"
              : "rgba(0, 0, 0, 0.4)",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 2,
          pt: 3,
          px: 3,
          bgcolor: isDark
            ? alpha(theme.palette.error.dark, 0.1)
            : alpha(theme.palette.error.light, 0.08),
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              bgcolor: isDark
                ? alpha(theme.palette.error.dark, 0.3)
                : alpha(theme.palette.error.main, 0.15),
              borderRadius: 2,
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <WarningAmber
              sx={{
                color: isDark ? "error.light" : "error.main",
                fontSize: 32,
              }}
            />
          </Box>
          <Typography variant="h6" fontWeight={700} fontSize="1.25rem">
            Delete Service?
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pb: 2, pt: 3 }}>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 2.5, lineHeight: 1.6 }}
        >
          Are you sure you want to delete this service? This action is permanent
          and cannot be undone.
        </Typography>
        <Box
          sx={{
            bgcolor: isDark
              ? alpha(theme.palette.error.dark, 0.15)
              : alpha(theme.palette.error.light, 0.1),
            p: 2,
            borderRadius: 2,
            border: 1.5,
            borderColor: isDark
              ? alpha(theme.palette.error.dark, 0.4)
              : alpha(theme.palette.error.main, 0.3),
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mb: 0.75,
              textTransform: "uppercase",
              fontWeight: 600,
              letterSpacing: "0.5px",
            }}
          >
            Service Name
          </Typography>
          <Typography
            variant="body1"
            fontWeight={700}
            color={isDark ? "error.light" : "error.dark"}
          >
            {serviceName}
          </Typography>
        </Box>
        <Box
          sx={{
            mt: 2.5,
            p: 2,
            bgcolor: isDark
              ? alpha(theme.palette.warning.dark, 0.1)
              : alpha(theme.palette.warning.light, 0.15),
            borderRadius: 2,
            borderLeft: 4,
            borderColor: isDark ? "warning.dark" : "warning.main",
          }}
        >
          <Typography
            variant="body2"
            color={isDark ? "warning.light" : "warning.dark"}
            fontWeight={600}
          >
            ⚠️ All associated subtasks will also be permanently deleted
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 3,
          gap: 2,
          bgcolor: isDark
            ? alpha(theme.palette.background.default, 0.4)
            : "grey.50",
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          color="inherit"
          variant="outlined"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            py: 1,
            borderRadius: 2,
            flex: 1,
            borderWidth: 1.5,
            "&:hover": {
              borderWidth: 1.5,
            },
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
            fontWeight: 700,
            px: 3,
            py: 1,
            borderRadius: 2,
            flex: 1,
            boxShadow: isDark
              ? "0 4px 14px rgba(211, 47, 47, 0.4)"
              : "0 4px 14px rgba(211, 47, 47, 0.3)",
            "&:hover": {
              boxShadow: isDark
                ? "0 6px 20px rgba(211, 47, 47, 0.5)"
                : "0 6px 20px rgba(211, 47, 47, 0.4)",
            },
          }}
        >
          {loading ? "Deleting..." : "Delete Service"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteServiceDialog;

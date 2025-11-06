import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import { Close, WarningAmber } from "@mui/icons-material";
import { Button } from "../ui/button";

const DeleteBranchDialog = ({ open, onClose, onConfirm, branchName }) => {
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
          borderRadius: 3,
          boxShadow: isDark
            ? `0 20px 60px ${alpha(theme.palette.common.black, 0.6)}`
            : `0 20px 60px ${alpha(theme.palette.error.main, 0.15)}`,
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(10px)",
          backgroundColor: isDark
            ? "rgba(0, 0, 0, 0.75)"
            : "rgba(0, 0, 0, 0.4)",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: isDark
            ? `linear-gradient(135deg, ${alpha(
                theme.palette.error.dark,
                0.2
              )}, ${alpha(theme.palette.error.main, 0.1)})`
            : `linear-gradient(135deg, ${alpha(
                theme.palette.error.light,
                0.15
              )}, ${alpha(theme.palette.error.main, 0.05)})`,
          borderBottom: 1,
          borderColor: isDark ? "grey.800" : "grey.200",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 2.5,
          px: 3,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700} color="error">
            Delete Branch
          </Typography>
          <Typography variant="caption" color="text.secondary">
            This action cannot be undone
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: isDark ? "grey.400" : "grey.600",
            transition: "all 0.2s ease",
            "&:hover": {
              color: isDark ? "grey.200" : "grey.800",
              transform: "rotate(90deg)",
              bgcolor: isDark
                ? alpha(theme.palette.grey[700], 0.3)
                : alpha(theme.palette.grey[300], 0.3),
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 4, px: 3, pb: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
          {/* Warning Icon */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: isDark
                ? alpha(theme.palette.error.dark, 0.2)
                : alpha(theme.palette.error.light, 0.2),
              border: 2,
              borderColor: isDark
                ? alpha(theme.palette.error.main, 0.3)
                : alpha(theme.palette.error.main, 0.2),
            }}
          >
            <WarningAmber
              sx={{
                fontSize: 48,
                color: isDark ? "error.light" : "error.main",
              }}
            />
          </Box>

          {/* Message */}
          <Box textAlign="center">
            <Typography variant="body1" gutterBottom fontWeight={500}>
              Are you sure you want to delete this branch?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              All information associated with this branch will be permanently
              removed.
            </Typography>

            {/* Branch Name Display */}
            {branchName && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: isDark
                    ? alpha(theme.palette.error.dark, 0.1)
                    : alpha(theme.palette.error.light, 0.1),
                  border: 1,
                  borderColor: isDark
                    ? alpha(theme.palette.error.main, 0.3)
                    : alpha(theme.palette.error.main, 0.2),
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5, fontSize: "0.75rem" }}
                >
                  Branch to delete:
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight={600}
                  color={isDark ? "error.light" : "error.dark"}
                >
                  {branchName}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 2,
          gap: 1.5,
          bgcolor: isDark
            ? alpha(theme.palette.background.paper, 0.4)
            : alpha(theme.palette.grey[50], 0.5),
          borderTop: 1,
          borderColor: isDark ? "grey.800" : "grey.200",
          justifyContent: "stretch",
        }}
      >
        <Button
          onClick={onClose}
          variant="outline"
          fullWidth
          sx={{
            borderRadius: 2,
            borderColor: isDark ? "grey.700" : "grey.300",
            "&:hover": {
              borderColor: isDark ? "grey.600" : "grey.400",
              bgcolor: isDark
                ? alpha(theme.palette.grey[800], 0.5)
                : alpha(theme.palette.grey[200], 0.5),
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          fullWidth
          sx={{
            borderRadius: 2,
            bgcolor: isDark ? "error.dark" : "error.main",
            color: "white",
            boxShadow: isDark
              ? `0 4px 14px ${alpha(theme.palette.error.dark, 0.4)}`
              : `0 4px 14px ${alpha(theme.palette.error.main, 0.3)}`,
            "&:hover": {
              bgcolor: isDark ? "error.main" : "error.dark",
              boxShadow: isDark
                ? `0 6px 20px ${alpha(theme.palette.error.dark, 0.5)}`
                : `0 6px 20px ${alpha(theme.palette.error.main, 0.4)}`,
            },
          }}
        >
          Delete Branch
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteBranchDialog;

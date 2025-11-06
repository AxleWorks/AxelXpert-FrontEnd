import React from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  useTheme,
  alpha,
} from "@mui/material";
import { Block } from "@mui/icons-material";
import { UserCheck } from "lucide-react";
import { Button } from "../ui/button";

const BlockConfirmDialog = React.memo(
  ({ open, employee, onConfirm, onCancel }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const isBlocked = employee?.isBlocked;

    return (
      <Dialog
        open={open}
        onClose={onCancel}
        PaperProps={{
          sx: {
            bgcolor: isDark ? "grey.900" : "background.paper",
            backgroundImage: "none",
            borderRadius: 3,
            p: 3,
            minWidth: 400,
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: isBlocked
                ? isDark
                  ? alpha(theme.palette.success.dark, 0.2)
                  : "#e9fbf0"
                : isDark
                ? alpha(theme.palette.warning.dark, 0.2)
                : "#fff6ea",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: isBlocked
                ? isDark
                  ? `3px solid ${alpha(theme.palette.success.main, 0.3)}`
                  : "3px solid #a7f3d0"
                : isDark
                ? `3px solid ${alpha(theme.palette.warning.main, 0.3)}`
                : "3px solid #fde68a",
            }}
          >
            {isBlocked ? (
              <UserCheck size={32} color="#10b981" />
            ) : (
              <Block
                sx={{
                  fontSize: "2rem",
                  color: "#f59e0b",
                }}
              />
            )}
          </Box>

          <DialogTitle
            sx={{
              fontSize: "1.5rem",
              fontWeight: 600,
              p: 0,
              color: isDark ? "grey.50" : "#1a1a1a",
            }}
          >
            {isBlocked ? "Confirm Unblock" : "Confirm Block"}
          </DialogTitle>

          <DialogContent sx={{ p: 0 }}>
            <DialogContentText
              sx={{
                color: isDark ? "grey.400" : "#666666",
                fontSize: "1rem",
                lineHeight: 1.5,
              }}
            >
              {isBlocked ? (
                <>
                  Are you sure you want to unblock{" "}
                  <strong>{employee?.username}</strong>?
                </>
              ) : (
                <>
                  Are you sure you want to block{" "}
                  <strong>{employee?.username}</strong>?
                </>
              )}
            </DialogContentText>
            <DialogContentText
              sx={{
                color: isDark ? "grey.500" : "#999999",
                fontSize: "0.875rem",
                lineHeight: 1.5,
                mt: 1.5,
                fontStyle: "italic",
              }}
            >
              {isBlocked
                ? "This will restore the user's access to the system."
                : "Note: Users with active appointments or tasks cannot be blocked."}
            </DialogContentText>
          </DialogContent>

          <DialogActions
            sx={{ p: 0, gap: 2, width: "100%", justifyContent: "center" }}
          >
            <Button
              onClick={onCancel}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.2,
                textTransform: "uppercase",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#0b75d9",
                border: "1px solid #0b75d9",
                backgroundColor: "transparent",
                minWidth: 120,
                "&:hover": {
                  backgroundColor: "rgba(11, 117, 217, 0.04)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.2,
                textTransform: "uppercase",
                fontSize: "0.875rem",
                fontWeight: 600,
                backgroundColor: "#0b75d9",
                color: "white",
                minWidth: 120,
                "&:hover": {
                  backgroundColor: "#0960b8",
                },
              }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    );
  }
);

BlockConfirmDialog.displayName = "BlockConfirmDialog";

export default BlockConfirmDialog;

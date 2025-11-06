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
import { Delete } from "@mui/icons-material";
import { Button } from "../ui/button";

const DeleteConfirmDialog = React.memo(
  ({ open, employee, onConfirm, onCancel }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

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
              backgroundColor: isDark
                ? alpha(theme.palette.error.dark, 0.2)
                : "#ffebee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: isDark
                ? `3px solid ${alpha(theme.palette.error.main, 0.3)}`
                : "3px solid #ffcdd2",
            }}
          >
            <Delete
              sx={{
                fontSize: "2rem",
                color: theme.palette.error.main,
              }}
            />
          </Box>

          <DialogTitle
            sx={{
              fontSize: "1.5rem",
              fontWeight: 600,
              p: 0,
              color: isDark ? "grey.50" : "#1a1a1a",
            }}
          >
            Confirm Delete
          </DialogTitle>

          <DialogContent sx={{ p: 0 }}>
            <DialogContentText
              sx={{
                color: isDark ? "grey.400" : "#666666",
                fontSize: "1rem",
                lineHeight: 1.5,
              }}
            >
              Are you sure you want to delete{" "}
              <strong>{employee?.username}</strong>?
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
              Note: Users with active appointments or tasks cannot be deleted.
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

DeleteConfirmDialog.displayName = "DeleteConfirmDialog";

export default DeleteConfirmDialog;

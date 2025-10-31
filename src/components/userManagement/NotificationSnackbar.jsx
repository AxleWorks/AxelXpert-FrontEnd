import React from "react";
import { Snackbar, Alert, Box, Typography } from "@mui/material";

const NotificationSnackbar = React.memo(
  ({ open, onClose, severity, title, message }) => {
    const isSuccess = severity === "success";

    return (
      <Snackbar
        open={open}
        autoHideDuration={isSuccess ? 4000 : 5000}
        onClose={onClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mt: 2 }}
      >
        <Alert
          onClose={onClose}
          severity={severity}
          variant="filled"
          icon={
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isSuccess ? "#10b981" : "#ef4444",
                fontSize: isSuccess ? "1rem" : "1.2rem",
                fontWeight: 700,
              }}
            >
              {isSuccess ? "✓" : "✕"}
            </Box>
          }
          sx={{
            width: "400px",
            backgroundColor: isSuccess ? "#d1fae5" : "#fee2e2",
            color: isSuccess ? "#065f46" : "#7f1d1d",
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            fontSize: "0.95rem",
            "& .MuiAlert-message": {
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
            },
            "& .MuiAlert-icon": {
              marginRight: 1.5,
            },
            "& .MuiIconButton-root": {
              color: isSuccess ? "#065f46" : "#7f1d1d",
              "&:hover": {
                backgroundColor: isSuccess
                  ? "rgba(6, 95, 70, 0.1)"
                  : "rgba(127, 29, 29, 0.1)",
              },
            },
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "1rem",
              color: isSuccess ? "#065f46" : "#7f1d1d",
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.875rem",
              color: isSuccess ? "#047857" : "#991b1b",
            }}
          >
            {message}
          </Typography>
        </Alert>
      </Snackbar>
    );
  }
);

NotificationSnackbar.displayName = "NotificationSnackbar";

export default NotificationSnackbar;

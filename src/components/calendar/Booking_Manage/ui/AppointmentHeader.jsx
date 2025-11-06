import React from "react";
import { Box, Typography, IconButton, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function AppointmentHeader({
  title = "Appointment Details",
  subtitle,
  onClose,
}) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      sx={{ mb: 1 }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.5 }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      <IconButton
        onClick={onClose}
        sx={(theme) => ({
          color: "text.secondary",
          "&:hover": {
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.08)"
                : "grey.100",
            color: "text.primary",
          },
        })}
      >
        <CloseIcon />
      </IconButton>
    </Stack>
  );
}

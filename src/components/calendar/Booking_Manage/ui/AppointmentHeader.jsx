import React from "react";
import { Box, Typography, IconButton, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function AppointmentHeader({
  title = "Slot Details",
  subtitle,
  onClose,
}) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ mb: 1 }}
    >
      <Box>
        <Typography variant="h6">{title}</Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      <IconButton onClick={onClose} color="inherit">
        <CloseIcon />
      </IconButton>
    </Stack>
  );
}

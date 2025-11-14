import React from "react";
import { Box, Typography, IconButton, Stack, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EventIcon from "@mui/icons-material/Event";

export default function AppointmentHeader({
  title = "Appointment Management",
  subtitle,
  onClose,
}) {
  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={(theme) => ({
              p: 1.5,
              borderRadius: 2,
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(33, 150, 243, 0.1)"
                  : "primary.50",
              color: "primary.main",
            })}
          >
            <EventIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "text.primary",
                mb: 0.5,
                fontSize: "1.75rem",
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  lineHeight: 1.5,
                  fontWeight: 400,
                  maxWidth: "500px",
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>
        <IconButton
          onClick={onClose}
          sx={(theme) => ({
            width: 44,
            height: 44,
            color: "text.secondary",
            borderRadius: 2,
            "&:hover": {
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.08)"
                  : "grey.100",
              color: "text.primary",
              transform: "scale(1.05)",
            },
            transition: "all 0.2s ease-in-out",
          })}
        >
          <CloseIcon sx={{ fontSize: 24 }} />
        </IconButton>
      </Stack>
      <Divider sx={{ borderColor: "divider" }} />
    </Box>
  );
}

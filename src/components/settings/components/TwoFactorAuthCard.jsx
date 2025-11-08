import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Box, Typography } from "@mui/material";

const TwoFactorAuthCard = () => {
  return (
    <Card
      sx={{
        boxShadow: (theme) =>
          theme.palette.mode === "light"
            ? "0 2px 8px rgba(0, 0, 0, 0.1)"
            : "0 2px 8px rgba(0, 0, 0, 0.3)",
        borderRadius: 3,
        border: (theme) =>
          `1px solid ${theme.palette.mode === "light" ? "#e2e8f0" : "#374151"}`,
        bgcolor: "background.paper",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: (theme) =>
            theme.palette.mode === "light"
              ? "0 4px 16px rgba(0, 0, 0, 0.15)"
              : "0 4px 16px rgba(0, 0, 0, 0.4)",
        },
      }}
    >
      <CardHeader sx={{ pb: 3 }}>
        <CardTitle
          sx={{
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "text.primary",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "info.main",
            }}
          />
          Two-Factor Authentication
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, fontSize: "0.95rem" }}
        >
          Add an extra layer of security to your account by enabling two-factor
          authentication.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="outlined"
            disabled
            sx={{
              minWidth: 180,
              py: 1.5,
              borderRadius: 2,
              borderColor: (theme) =>
                theme.palette.mode === "light" ? "#cbd5e0" : "#4b5563",
              color: "text.disabled",
              "&:disabled": {
                borderColor: (theme) =>
                  theme.palette.mode === "light" ? "#e2e8f0" : "#374151",
                color: "text.disabled",
              },
            }}
          >
            Enable 2FA (Coming Soon)
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TwoFactorAuthCard;

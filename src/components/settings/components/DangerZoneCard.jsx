import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Box, Typography, CircularProgress } from "@mui/material";

const DangerZoneCard = ({ handleDeleteAccount, saving }) => {
  return (
    <Card
      sx={{
        border: (theme) =>
          `2px solid ${theme.palette.mode === "light" ? "#fecaca" : "#7f1d1d"}`,
        boxShadow: (theme) =>
          theme.palette.mode === "light"
            ? "0 2px 8px rgba(239, 68, 68, 0.1)"
            : "0 2px 8px rgba(239, 68, 68, 0.2)",
        borderRadius: 3,
        bgcolor: "background.paper",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: (theme) =>
            theme.palette.mode === "light"
              ? "0 4px 16px rgba(239, 68, 68, 0.2)"
              : "0 4px 16px rgba(239, 68, 68, 0.3)",
        },
      }}
    >
      <CardHeader sx={{ pb: 3 }}>
        <CardTitle
          sx={{
            color: "#dc2626",
            fontSize: "1.25rem",
            fontWeight: 600,
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
              bgcolor: "#ef4444",
            }}
          />
          Danger Zone
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, fontSize: "0.95rem" }}
        >
          Once you delete your account, there is no going back. Please be
          certain.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={handleDeleteAccount}
            disabled={saving}
            sx={{
              minWidth: 180,
              py: 1.5,
              borderRadius: 2,
              bgcolor: "error.main",
              color: "error.contrastText",
              "&:hover": {
                bgcolor: "error.dark",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              },
              "&:disabled": {
                bgcolor: "action.disabledBackground",
                color: "action.disabled",
                transform: "none",
                boxShadow: "none",
              },
              transition: "all 0.3s ease",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            {saving ? (
              <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
            ) : null}
            {saving ? "Deleting Account..." : "Delete Account"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DangerZoneCard;

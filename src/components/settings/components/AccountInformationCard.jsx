import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Box, Typography } from "@mui/material";

const AccountInformationCard = ({ userDetails }) => {
  return (
    <Card
      sx={{
        border: (theme) =>
          `1px solid ${theme.palette.mode === "light" ? "#e2e8f0" : "#374151"}`,
        boxShadow: (theme) =>
          theme.palette.mode === "light"
            ? "0 2px 8px rgba(0, 0, 0, 0.1)"
            : "0 2px 8px rgba(0, 0, 0, 0.3)",
        borderRadius: 3,
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
              bgcolor: "secondary.main",
            }}
          />
          Account Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 4,
          }}
        >
          {/* Account Status */}
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: "background.paper",
              boxShadow: (theme) =>
                theme.palette.mode === "light"
                  ? "0 2px 10px rgba(0, 0, 0, 0.05)"
                  : "0 2px 10px rgba(0, 0, 0, 0.2)",
              border: (theme) =>
                `1px solid ${
                  theme.palette.mode === "light" ? "#e2e8f0" : "#374151"
                }`,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: (theme) =>
                  theme.palette.mode === "light"
                    ? "0 8px 25px rgba(0, 0, 0, 0.1)"
                    : "0 8px 25px rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontSize: "0.75rem",
              }}
            >
              Account Status
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: 1,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: userDetails.isActive ? "#10b981" : "#ef4444",
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: userDetails.isActive ? "#10b981" : "#ef4444",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                }}
              >
                {userDetails.isActive ? "Active" : "Inactive"}
              </Typography>
            </Box>
          </Box>

          {/* Account ID */}
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: "background.paper",
              boxShadow: (theme) =>
                theme.palette.mode === "light"
                  ? "0 2px 10px rgba(0, 0, 0, 0.05)"
                  : "0 2px 10px rgba(0, 0, 0, 0.2)",
              border: (theme) =>
                `1px solid ${
                  theme.palette.mode === "light" ? "#e2e8f0" : "#374151"
                }`,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: (theme) =>
                  theme.palette.mode === "light"
                    ? "0 8px 25px rgba(0, 0, 0, 0.1)"
                    : "0 8px 25px rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontSize: "0.75rem",
              }}
            >
              Account ID
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "text.primary",
                fontWeight: 600,
                fontSize: "1.1rem",
                mt: 1,
                fontFamily: "monospace",
              }}
            >
              #{userDetails.id}
            </Typography>
          </Box>

          {/* Created Date */}
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: "background.paper",
              boxShadow: (theme) =>
                theme.palette.mode === "light"
                  ? "0 2px 10px rgba(0, 0, 0, 0.05)"
                  : "0 2px 10px rgba(0, 0, 0, 0.2)",
              border: (theme) =>
                `1px solid ${
                  theme.palette.mode === "light" ? "#e2e8f0" : "#374151"
                }`,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: (theme) =>
                  theme.palette.mode === "light"
                    ? "0 8px 25px rgba(0, 0, 0, 0.1)"
                    : "0 8px 25px rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontSize: "0.75rem",
              }}
            >
              Member Since
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "text.primary",
                fontWeight: 600,
                fontSize: "1.1rem",
                mt: 1,
              }}
            >
              {new Date(userDetails.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
          </Box>

          {/* Last Updated */}
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: "background.paper",
              boxShadow: (theme) =>
                theme.palette.mode === "light"
                  ? "0 2px 10px rgba(0, 0, 0, 0.05)"
                  : "0 2px 10px rgba(0, 0, 0, 0.2)",
              border: (theme) =>
                `1px solid ${
                  theme.palette.mode === "light" ? "#e2e8f0" : "#374151"
                }`,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: (theme) =>
                  theme.palette.mode === "light"
                    ? "0 8px 25px rgba(0, 0, 0, 0.1)"
                    : "0 8px 25px rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontSize: "0.75rem",
              }}
            >
              Last Updated
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "text.primary",
                fontWeight: 600,
                fontSize: "1.1rem",
                mt: 1,
              }}
            >
              {new Date(userDetails.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AccountInformationCard;

import React from "react";
import { Card, Box, Typography, Avatar, useTheme } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";

const StatCard = ({ title, value, icon, color, trend, onClick }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  return (
    <Card
      elevation={0}
      onClick={onClick}
      sx={{
        p: 3,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        background: isDark 
          ? "linear-gradient(145deg, #1e293b 0%, #334155 100%)"
          : "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
        transition: "all 0.3s ease-in-out",
        cursor: "pointer",
        minHeight: "160px",
        height: "auto",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: isDark 
            ? "0 20px 40px -10px rgba(0, 0, 0, 0.4)"
            : "0 20px 40px -10px rgba(0, 0, 0, 0.15)",
          border: `1px solid ${color}`,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: theme.palette.text.primary,
              mb: 0.5,
              fontSize: { xs: "1.8rem", md: "2.2rem" },
            }}
          >
            {value}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
          >
            {title}
          </Typography>
          {trend && (
            <Box sx={{ display: "flex", alignItems: "center", mt: 1.5 }}>
              <TrendingUp sx={{ fontSize: 18, color: theme.palette.success.main, mr: 0.5 }} />
              <Typography
                variant="body2"
                sx={{ color: theme.palette.success.main, fontWeight: 700 }}
              >
                {trend}
              </Typography>
            </Box>
          )}
        </Box>
        <Avatar
          sx={{
            backgroundColor: color,
            width: 70,
            height: 70,
            boxShadow: `0 8px 20px ${color}40`,
            flexShrink: 0,
          }}
        >
          {React.cloneElement(icon, { sx: { fontSize: 32, color: "#ffffff" } })}
        </Avatar>
      </Box>
    </Card>
  );
};

export default StatCard;

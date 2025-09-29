import React from "react";
import { Card, Box, Typography, Avatar } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";

const StatCard = ({ title, value, icon, color, trend, onClick }) => (
  <Card
    elevation={0}
    onClick={onClick}
    sx={{
      p: 3,
      borderRadius: 3,
      border: "1px solid #e2e8f0",
      background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
      transition: "all 0.3s ease-in-out",
      cursor: "pointer",
      height: "65%",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.15)",
        border: `1px solid ${color}`,
      },
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: "#1e293b",
            mb: 0.5,
            fontSize: { xs: "1.8rem", md: "2.2rem" },
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#64748b",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          {title}
        </Typography>
        {trend && (
          <Box sx={{ display: "flex", alignItems: "center", mt: 1.5 }}>
            <TrendingUp sx={{ fontSize: 18, color: "#10b981", mr: 0.5 }} />
            <Typography
              variant="body2"
              sx={{ color: "#10b981", fontWeight: 700 }}
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
        }}
      >
        {React.cloneElement(icon, { sx: { fontSize: 32 } })}
      </Avatar>
    </Box>
  </Card>
);

export default StatCard;

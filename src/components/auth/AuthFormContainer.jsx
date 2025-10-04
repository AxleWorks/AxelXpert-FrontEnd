import React from "react";
import { Paper, Typography, Box } from "@mui/material";

const AuthFormContainer = ({ title, error, children }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        padding: { xs: 4, sm: 5, md: 6 },
        width: "100%",
        maxWidth: { xs: "100%", sm: 480, md: 420 },
        backgroundColor: "white",
        borderRadius: 3,
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        boxSizing: "border-box",
        border: "1px solid #e2e8f0",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 4,
          textAlign: "center",
          color: "#1e293b",
          fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
          letterSpacing: "-0.025em",
        }}
      >
        {title}
      </Typography>

      {error && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography
            color="error"
            sx={{
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            {error}
          </Typography>
        </Box>
      )}

      {children}
    </Paper>
  );
};

export default AuthFormContainer;

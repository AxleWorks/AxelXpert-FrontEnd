import React from "react";
import { Typography } from "@mui/material";

const AuthBranding = ({ subtitle }) => {
  return (
    <>
      <Typography
        variant="h1"
        sx={{
          fontWeight: "bold",
          mb: { xs: 1, md: 1.5 },
          fontSize: { xs: "2.4rem", sm: "3rem", md: "4.5rem", lg: "5.5rem" },
          textAlign: "center",
          lineHeight: 1.05,
          width: "100%",
        }}
      >
        <span style={{ color: "#3b82f6" }}>Axle</span>Xpert
      </Typography>
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          fontSize: { xs: "1rem", sm: "1.3rem", md: "2rem", lg: "2.5rem" },
          textAlign: "center",
          color: "rgba(255,255,255,0.95)",
          textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
        }}
      >
        {subtitle}
      </Typography>
    </>
  );
};

export default AuthBranding;

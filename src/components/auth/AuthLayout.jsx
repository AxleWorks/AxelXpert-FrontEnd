import React, { useEffect } from "react";
import { Box, Grid } from "@mui/material";

const AuthLayout = ({ leftContent, rightContent, backgroundImage }) => {
  // Keep margins/paddings clean but avoid forcing viewport sizes or hiding overflow
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    const root = document.getElementById("root");
    if (root) {
      root.style.margin = "0";
      root.style.padding = "0";
    }
    return () => {
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.documentElement.style.margin = "";
      document.documentElement.style.padding = "";
      if (root) {
        root.style.margin = "";
        root.style.padding = "";
      }
    };
  }, []);

  const containerStyles = {
    display: "flex",
    flexDirection: "row", // Always keep left and right sections side-by-side
    width: "100%",
    height: "100vh",
  };

  // left column responsive styles: explicit xs and md values to avoid leakage
  const leftStyles = {
    flex: 1,
    // wrap URL in quotes to ensure proper CSS generation
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    padding: "2rem",
  };

  const rightStyles = {
    flex: 1,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  };

  return (
    <div style={containerStyles}>
      <div style={leftStyles}>{leftContent}</div>
      <div style={rightStyles}>{rightContent}</div>
    </div>
  );
};

export default AuthLayout;

import React from "react";
import { Chip } from "@mui/material";

export const Badge = ({ children, className, ...props }) => {
  return (
    <Chip
      label={children}
      size="small"
      sx={{
        fontWeight: 500,
        borderRadius: "4px",
        backgroundColor: props.className?.includes("bg-green-600")
          ? "#10b981"
          : "primary.main",
        color: "white",
      }}
      {...props}
    />
  );
};

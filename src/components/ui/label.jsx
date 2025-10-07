import React from "react";
import { Typography } from "@mui/material";

export const Label = ({ children, className, ...props }) => {
  return (
    <Typography
      component="label"
      variant="subtitle2"
      sx={{
        fontWeight: 600,
        color: 'text.primary',
        mb: 1,
        display: 'block',
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};
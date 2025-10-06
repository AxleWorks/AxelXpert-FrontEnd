import React from "react";
import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardHeader as MuiCardHeader,
  Typography,
} from "@mui/material";

export const Card = ({ children, className, ...props }) => {
  return (
    <MuiCard
      sx={{
        borderRadius: 2,
        transition: "box-shadow 0.3s",
        "&:hover": { boxShadow: 5 },
      }}
      {...props}
    >
      {children}
    </MuiCard>
  );
};

export const CardHeader = ({ children, ...props }) => {
  return <MuiCardHeader {...props}>{children}</MuiCardHeader>;
};

export const CardContent = ({ children, ...props }) => {
  return <MuiCardContent {...props}>{children}</MuiCardContent>;
};

export const CardTitle = ({ children, ...props }) => {
  return (
    <Typography variant="h6" fontWeight="bold" {...props}>
      {children}
    </Typography>
  );
};

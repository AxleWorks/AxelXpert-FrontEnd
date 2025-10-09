import React from "react";
import { Button as MuiButton } from "@mui/material";

export const Button = ({
  children,
  variant = "contained",
  size = "medium",
  className,
  ...props
}) => {
  const getButtonSize = (size) => {
    switch (size) {
      case "sm":
        return { padding: "0.5rem 1rem", fontSize: "0.875rem" };
      case "lg":
        return { padding: "0.75rem 1.5rem", fontSize: "1.125rem" };
      default:
        return { padding: "0.625rem 1.25rem", fontSize: "1rem" };
    }
  };

  return (
    <MuiButton
      variant={variant}
      sx={{
        ...getButtonSize(size),
        textTransform: "none",
        borderRadius: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        ...(variant === "outline" && {
          border: "1px solid",
          borderColor: "primary.main",
          color: "primary.main",
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "primary.50",
          },
        }),
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

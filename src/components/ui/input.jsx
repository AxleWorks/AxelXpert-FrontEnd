import React from "react";
import { TextField } from "@mui/material";

export const Input = ({ 
  label, 
  placeholder, 
  type = "text", 
  disabled = false, 
  value, 
  defaultValue,
  onChange, 
  className, 
  ...props 
}) => {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      type={type}
      disabled={disabled}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      fullWidth
      variant="outlined"
      size="medium"
      sx={{ 
        '& .MuiOutlinedInput-root': {
          borderRadius: '6px',
        },
        ...props.sx
      }}
      {...props}
    />
  );
};
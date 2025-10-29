import React from "react";
import {
  Select as MUISelect,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

export const Select = ({
  children,
  value,
  defaultValue,
  onValueChange,
  ...props
}) => {
  return (
    <FormControl fullWidth variant="outlined" size="medium">
      {children}
    </FormControl>
  );
};

export const SelectTrigger = ({ children, ...props }) => {
  return (
    <MUISelect
      displayEmpty
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "6px",
        },
      }}
      {...props}
    >
      {children}
    </MUISelect>
  );
};

export const SelectContent = ({ children, ...props }) => {
  return <>{children}</>;
};

export const SelectItem = ({ value, children, ...props }) => {
  return (
    <MenuItem value={value} {...props}>
      {children}
    </MenuItem>
  );
};

export const SelectValue = ({ placeholder, ...props }) => {
  return <span {...props}>{placeholder}</span>;
};

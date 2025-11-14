import React, { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTheme } from "../../contexts/ThemeContext";

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
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <TextField
      label={label}
      placeholder={placeholder}
      type={inputType}
      disabled={disabled}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      fullWidth
      variant="outlined"
      size="medium"
      InputProps={{
        endAdornment:
          type === "password" ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                sx={{ color: theme.palette.primary.main }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : null,
        style: { color: "#000000", backgroundColor: "#ffffff" },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "6px",
        },
        "& .MuiInputLabel-root": {
          color: "#000000",
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
          {
            borderColor: "primary.main",
          },
        ...props.sx,
      }}
      {...props}
    />
  );
};

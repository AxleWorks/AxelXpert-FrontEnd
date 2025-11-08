import React from "react";
import { Autocomplete, TextField, Box, InputAdornment } from "@mui/material";

const SearchableSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  error = false,
  helperText = "",
  disabled = false,
  placeholder = "",
  startIcon = null,
  sx = {},
}) => {
  return (
    <Autocomplete
      value={value || null}
      onChange={(event, newValue) => {
        onChange({
          target: {
            name,
            value: newValue || "",
          },
        });
      }}
      options={options}
      getOptionLabel={(option) => option || ""}
      isOptionEqualToValue={(option, value) => option === value}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          error={error}
          helperText={helperText}
          disabled={disabled}
          placeholder={placeholder}
          value={value || ""}
          InputProps={{
            ...params.InputProps,
            startAdornment: startIcon ? (
              <InputAdornment position="start">{startIcon}</InputAdornment>
            ) : null,
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2.5,
              bgcolor: "background.paper",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              },
              "&.Mui-focused": {
                boxShadow: "0 4px 16px rgba(59, 130, 246, 0.2)",
              },
            },
            "& .MuiAutocomplete-inputRoot": {
              minHeight: "40px",
              paddingTop: "4px",
              paddingBottom: "4px",
            },
            "& .MuiInputLabel-root": {
              transform: "translate(14px, 8px) scale(1)",
              "&.MuiInputLabel-shrink": {
                transform: "translate(14px, -9px) scale(0.75)",
              },
            },
            "& .MuiAutocomplete-input": {
              fontSize: "0.875rem",
            },
            ...sx,
          }}
        />
      )}
      disableClearable={false}
      clearOnEscape
      autoHighlight
      sx={{
        "& .MuiAutocomplete-listbox": {
          maxHeight: "150px", // Shorter dropdown height
        },
      }}
    />
  );
};

export default SearchableSelect;

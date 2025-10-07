import React from "react";
import { Tabs as MuiTabs, Tab as MuiTab, Box } from "@mui/material";

export const Tabs = ({ children, defaultValue, className, ...props }) => {
  const [value, setValue] = React.useState(defaultValue || "profile");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className={className} {...props}>
      {React.Children.map(children, (child, index) => {
        if (child.type === TabsList) {
          return React.cloneElement(child, { value, onChange: handleChange });
        }
        if (child.type === TabsContent) {
          return React.cloneElement(child, { activeValue: value });
        }
        return child;
      })}
    </Box>
  );
};

export const TabsList = ({ children, value, onChange, className, ...props }) => {
  return (
    <MuiTabs
      value={value}
      onChange={onChange}
      className={className}
      sx={{
        '& .MuiTabs-indicator': {
          backgroundColor: 'primary.main',
        },
        mb: 2,
        ...props.sx
      }}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (child.type === TabsTrigger) {
          return React.cloneElement(child);
        }
        return child;
      })}
    </MuiTabs>
  );
};

export const TabsTrigger = ({ children, value, ...props }) => {
  return (
    <MuiTab
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {children}
        </Box>
      }
      value={value}
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        minHeight: 48,
        '&.Mui-selected': {
          color: 'primary.main',
        },
      }}
      {...props}
    />
  );
};

export const TabsContent = ({ children, activeValue, value, className, ...props }) => {
  if (activeValue !== value) return null;

  return (
    <Box className={className} {...props}>
      {children}
    </Box>
  );
};
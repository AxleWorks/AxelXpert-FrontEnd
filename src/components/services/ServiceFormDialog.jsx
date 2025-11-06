import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import { Close } from "@mui/icons-material";

const ServiceFormDialog = ({ open, onClose, onSave, initialData, mode }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    durationMinutes: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Reset form when dialog opens or initialData changes
  useEffect(() => {
    if (open && initialData) {
      setFormData(initialData);
      setErrors({});
    }
  }, [open, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Service name is required";
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }
    if (!formData.durationMinutes || parseInt(formData.durationMinutes) <= 0) {
      newErrors.durationMinutes = "Valid duration is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error("Error saving service:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: isDark ? "grey.900" : "background.paper",
          backgroundImage: "none",
          borderRadius: 3,
          boxShadow: isDark
            ? "0 20px 60px rgba(0, 0, 0, 0.6)"
            : "0 20px 60px rgba(0, 0, 0, 0.15)",
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(10px)",
            backgroundColor: isDark
              ? "rgba(0, 0, 0, 0.75)"
              : "rgba(0, 0, 0, 0.4)",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
          pt: 3,
          px: 3,
          borderBottom: 1,
          borderColor: isDark ? "grey.800" : "grey.200",
          bgcolor: isDark
            ? alpha(theme.palette.primary.dark, 0.05)
            : alpha(theme.palette.primary.light, 0.05),
        }}
      >
        <Box
          sx={{
            fontSize: "1.35rem",
            fontWeight: 700,
            color: isDark ? "grey.50" : "grey.900",
            letterSpacing: "-0.02em",
          }}
        >
          {mode === "add" ? "Add New Service" : "Edit Service"}
        </Box>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
          size="small"
          sx={{
            color: isDark ? "grey.400" : "grey.600",
            transition: "all 0.2s ease",
            "&:hover": {
              color: isDark ? "grey.100" : "grey.900",
              bgcolor: isDark
                ? alpha(theme.palette.error.dark, 0.2)
                : alpha(theme.palette.error.light, 0.15),
              transform: "rotate(90deg)",
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 4, pb: 3, px: 3, mt: 2 }}>
        <TextField
          fullWidth
          label="Service Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          error={!!errors.name}
          helperText={errors.name}
          sx={{ mb: 3.5, mt: 2 }}
          autoFocus
          placeholder="e.g., Oil Change"
          InputProps={{
            sx: {
              borderRadius: 2,
              mt: 1,
            },
          }}
        />
        <Box display="flex" gap={2.5} mb={3.5}>
          <TextField
            label="Price ($)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            required
            error={!!errors.price}
            helperText={errors.price}
            inputProps={{ min: 0, step: 0.01 }}
            sx={{ flex: 1 }}
            placeholder="49.99"
            InputProps={{
              sx: {
                borderRadius: 2,
              },
            }}
          />
          <TextField
            label="Duration (min)"
            name="durationMinutes"
            type="number"
            value={formData.durationMinutes}
            onChange={handleInputChange}
            required
            error={!!errors.durationMinutes}
            helperText={errors.durationMinutes}
            inputProps={{ min: 1, step: 1 }}
            sx={{ flex: 1 }}
            placeholder="30"
            InputProps={{
              sx: {
                borderRadius: 2,
              },
            }}
          />
        </Box>
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          multiline
          rows={4}
          placeholder="Describe the service in detail..."
          InputProps={{
            sx: {
              borderRadius: 2,
            },
          }}
        />
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 3,
          borderTop: 1,
          borderColor: isDark ? "grey.800" : "grey.200",
          gap: 2,
          bgcolor: isDark
            ? alpha(theme.palette.background.default, 0.4)
            : alpha(theme.palette.primary.main, 0.03),
        }}
      >
        <Button
          onClick={handleClose}
          disabled={saving}
          color="inherit"
          variant="outlined"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            py: 1,
            borderRadius: 2,
            borderWidth: 1.5,
            "&:hover": {
              borderWidth: 1.5,
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving}
          disableElevation
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 4,
            py: 1,
            borderRadius: 2,
            boxShadow: isDark
              ? "0 4px 14px rgba(25, 118, 210, 0.4)"
              : "0 4px 14px rgba(25, 118, 210, 0.3)",
            "&:hover": {
              boxShadow: isDark
                ? "0 6px 20px rgba(25, 118, 210, 0.5)"
                : "0 6px 20px rgba(25, 118, 210, 0.4)",
            },
          }}
        >
          {saving
            ? "Saving..."
            : mode === "add"
            ? "Add Service"
            : "Update Service"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceFormDialog;

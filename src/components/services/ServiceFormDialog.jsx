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
          borderRadius: 2,
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(8px)",
            backgroundColor: isDark
              ? "rgba(0, 0, 0, 0.7)"
              : "rgba(0, 0, 0, 0.5)",
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
          pt: 2.5,
          px: 3,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: isDark ? "grey.900" : "background.paper",
        }}
      >
        <Box
          sx={{
            fontSize: "1.25rem",
            fontWeight: 600,
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
            "&:hover": {
              color: isDark ? "grey.200" : "grey.900",
              bgcolor: isDark ? "grey.800" : "grey.100",
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
        <TextField
          fullWidth
          label="Service Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          error={!!errors.name}
          helperText={errors.name}
          sx={{ mb: 3 }}
          autoFocus
          placeholder="e.g., Oil Change"
        />
        <Box display="flex" gap={2} mb={3}>
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
          />
        </Box>
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          multiline
          rows={3}
          placeholder="Describe the service..."
        />
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 2.5,
          borderTop: 1,
          borderColor: "divider",
          gap: 1.5,
          bgcolor: isDark
            ? alpha(theme.palette.background.paper, 0.5)
            : "grey.50",
        }}
      >
        <Button
          onClick={handleClose}
          disabled={saving}
          color="inherit"
          sx={{
            textTransform: "none",
            fontWeight: 500,
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
            px: 3,
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

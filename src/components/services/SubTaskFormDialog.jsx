import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import { Close } from "@mui/icons-material";

const SubTaskFormDialog = ({ open, onClose, onSave, initialData, mode }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    orderIndex: 1,
    isMandatory: true,
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (formData.orderIndex < 1) {
      newErrors.orderIndex = "Order must be at least 1";
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
      console.error("Error saving subtask:", err);
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
            backgroundColor:
              theme.palette.mode === "dark"
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
          {mode === "add" ? "Add New SubTask" : "Edit SubTask"}
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
      <DialogContent sx={{ pt: 3, pb: 2, px: 3, mt: 3 }}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          error={!!errors.title}
          helperText={errors.title}
          sx={{ mb: 3, mt: 1 }}
          autoFocus
          placeholder="e.g., Check oil level"
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          multiline
          rows={3}
          sx={{ mb: 3 }}
          placeholder="Describe what needs to be done..."
        />
        <Box display="flex" gap={2} mb={1} alignItems="flex-start">
          <TextField
            label="Order"
            name="orderIndex"
            type="number"
            value={formData.orderIndex}
            onChange={handleInputChange}
            inputProps={{ min: 1, step: 1 }}
            sx={{ width: 120 }}
            error={!!errors.orderIndex}
            helperText={errors.orderIndex}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isMandatory}
                onChange={handleInputChange}
                name="isMandatory"
                color="primary"
              />
            }
            label="Mandatory Step"
            sx={{
              flex: 1,
              m: 0,
              mt: 1,
              "& .MuiFormControlLabel-label": {
                fontSize: "0.95rem",
              },
            }}
          />
        </Box>
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
            ? "Add SubTask"
            : "Update SubTask"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubTaskFormDialog;

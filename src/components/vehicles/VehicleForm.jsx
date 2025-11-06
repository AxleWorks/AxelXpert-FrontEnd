import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Grid,
  InputAdornment,
} from "@mui/material";
import {
  Close as CloseIcon,
  DirectionsCar as CarIcon,
  CalendarToday as CalendarIcon,
  LocalGasStation as FuelIcon,
  Fingerprint as ChassisIcon,
  Build as BuildIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material";
import SearchableSelect from "../ui/SearchableSelect";
import { heIL } from "@mui/material/locale";

const VehicleForm = ({ open, onClose, onSave, formData, setFormData }) => {
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    if (!formData.type) newErrors.type = "Vehicle type is required";
    if (!formData.year) {
      newErrors.year = "Year is required";
    } else if (formData.year < 1900 || formData.year > currentYear + 1) {
      newErrors.year = `Year must be between 1900 and ${currentYear + 1}`;
    }
    if (!formData.make) newErrors.make = "Make is required";
    if (!formData.model || formData.model.trim().length < 2) {
      newErrors.model = "Model is required (min 2 characters)";
    }
    if (!formData.fuelType) newErrors.fuelType = "Fuel type is required";
    if (!formData.plateNumber || formData.plateNumber.trim().length < 3) {
      newErrors.plateNumber = "Plate number is required (min 3 characters)";
    }
    if (!formData.chassisNumber || formData.chassisNumber.trim().length < 5) {
      newErrors.chassisNumber = "Chassis number is required (min 5 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    setSaveError("");
    if (!validateForm()) {
      setSaveError("Please fix the errors before saving");
      return;
    }

    setIsSaving(true);
    try {
      await onSave();
      // onClose will be called by parent component on success
    } catch (error) {
      setSaveError(error.message || "Failed to save vehicle");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      setErrors({});
      setSaveError("");
      onClose();
    }
  };

  const vehicleTypes = [
    "Sedan",
    "SUV",
    "Hatchback",
    "Coupe",
    "Convertible",
    "Wagon",
    "Van",
    "Minivan",
    "Pickup Truck",
    "Truck",
    "Bus",
    "Motorcycle",
    "Scooter",
    "Electric Vehicle",
    "Luxury Car",
  ];

  const vehicleBrands = [
    // Popular Brands
    "Toyota",
    "Honda",
    "Ford",
    "Chevrolet",
    "Nissan",
    "Hyundai",
    "Kia",
    "Mazda",
    "Subaru",
    "Volkswagen",
    // Luxury Brands
    "Mercedes-Benz",
    "BMW",
    "Audi",
    "Lexus",
    "Porsche",
    "Jaguar",
    "Land Rover",
    "Volvo",
    "Cadillac",
    "Tesla",
    // Asian Brands
    "Suzuki",
    "Mitsubishi",
    "Isuzu",
    "Tata",
    "Mahindra",
    "Maruti Suzuki",
    // Indian/Local Brands
    "Bajaj",
    "Hero",
    "TVS",
    "Royal Enfield",
    // American Brands
    "Jeep",
    "Ram",
    "GMC",
    "Dodge",
    "Buick",
    // European Brands
    "Peugeot",
    "Renault",
    "Fiat",
    "Skoda",
    "SEAT",
    // Others
    "Other",
  ].sort();

  const fuelTypes = [
    "Petrol",
    "Diesel",
    "Electric",
    "Hybrid",
    "Plug-in Hybrid",
    "CNG",
    "LPG",
    "Hydrogen",
  ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: "0 24px 48px rgba(0,0,0,0.25)",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)"
              : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
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
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CarIcon sx={{ color: "white", fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {formData.id ? "Edit Vehicle" : "Add New Vehicle"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              {formData.id
                ? "Update vehicle information"
                : "Fill in the vehicle details"}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleClose}
          disabled={isSaving}
          sx={{
            color: "text.secondary",
            bgcolor: "background.paper",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            "&:hover": {
              bgcolor: "red",
              transform: "rotate(90deg)",
              transition: "all 0.3s ease",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ px: 3, py: 3 }}>
        {saveError && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(239, 68, 68, 0.15)",
            }}
          >
            {saveError}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Section 1: Basic Information */}
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(59, 130, 246, 0.05)"
                  : "rgba(59, 130, 246, 0.03)",
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CarIcon sx={{ color: "white", fontSize: 20 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Basic Information
              </Typography>
            </Box>

            <Grid container spacing={2.5}>
              {/* Vehicle Type */}
              <Grid item xs={12}>
                <SearchableSelect
                  label="Vehicle Type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  options={vehicleTypes}
                  required
                  error={!!errors.type}
                  helperText={errors.type}
                  disabled={isSaving}
                  placeholder="Select vehicle type"
                  startIcon={<CarIcon fontSize="small" color="action" />}
                  sx={{
                    minWidth: "200px",
                    maxWidth: "600px",
                    "& .MuiAutocomplete-root": {
                      minWidth: "200px",
                      maxWidth: "600px",
                    },
                  }}
                />
              </Grid>

              {/* Make */}
              <Grid item xs={12}>
                <SearchableSelect
                  label="Make / Brand"
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  options={vehicleBrands}
                  required
                  error={!!errors.make}
                  helperText={errors.make}
                  disabled={isSaving}
                  placeholder="Select vehicle brand"
                  startIcon={<BuildIcon fontSize="small" color="action" />}
                  sx={{
                    minWidth: "200px",
                    maxWidth: "600px",
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
                  }}
                />
              </Grid>

              {/* Fuel Type */}
              <Grid item xs={12}>
                <SearchableSelect
                  label="Fuel Type"
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  options={fuelTypes}
                  required
                  error={!!errors.fuelType}
                  helperText={errors.fuelType}
                  disabled={isSaving}
                  placeholder="Select fuel type"
                  startIcon={<FuelIcon fontSize="small" color="action" />}
                  sx={{
                    minWidth: "200px",
                    maxWidth: "600px",
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
                  }}
                />
              </Grid>

              {/* Model */}
              <Grid item xs={12}>
                <TextField
                  label="Model"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  error={!!errors.model}
                  helperText={errors.model}
                  disabled={isSaving}
                  placeholder="e.g., Camry, Civic, Fortuner"
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
                  }}
                />
              </Grid>

              {/* Year */}
              <Grid item xs={12}>
                <TextField
                  type="number"
                  label="Year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  error={!!errors.year}
                  helperText={errors.year}
                  disabled={isSaving}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    minWidth: "200px",
                    maxWidth: "600px",
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
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Section 2: Identification */}
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(59, 130, 246, 0.05)"
                  : "rgba(59, 130, 246, 0.03)",
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BadgeIcon sx={{ color: "white", fontSize: 20 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Identification Details
              </Typography>
            </Box>

            <Grid container spacing={2.5}>
              {/* Plate Number */}
              <Grid item xs={12}>
                <TextField
                  label="Plate Number"
                  name="plateNumber"
                  value={formData.plateNumber}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  error={!!errors.plateNumber}
                  helperText={errors.plateNumber}
                  disabled={isSaving}
                  placeholder="e.g., ABC-1234"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
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
                        boxShadow: "0 4px 16px rgba(147, 51, 234, 0.2)",
                      },
                    },
                  }}
                />
              </Grid>

              {/* Chassis Number */}
              <Grid item xs={12}>
                <TextField
                  label="Chassis Number (VIN)"
                  name="chassisNumber"
                  value={formData.chassisNumber}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  error={!!errors.chassisNumber}
                  helperText={errors.chassisNumber}
                  disabled={isSaving}
                  placeholder="e.g., 1HGBH41JXMN109186"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ChassisIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
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
                        boxShadow: "0 4px 16px rgba(147, 51, 234, 0.2)",
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          px: 3,
          py: 3,
          gap: 2,
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(0,0,0,0.2)"
              : "rgba(0,0,0,0.02)",
        }}
      >
        <Button
          onClick={handleClose}
          disabled={isSaving}
          variant="outlined"
          size="large"
          sx={{
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 600,
            px: 4,
            py: 1.25,
            borderWidth: 2,
            color: "text.secondary",
            borderColor: "divider",
            "&:hover": {
              borderWidth: 2,
              borderColor: "text.secondary",
              bgcolor: "action.hover",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          variant="contained"
          size="large"
          startIcon={
            isSaving ? <CircularProgress size={20} color="inherit" /> : null
          }
          sx={{
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 600,
            px: 5,
            py: 1.25,
            bgcolor: "primary.main",
            "&:hover": {
              bgcolor: "primary.dark",
              transform: "translateY(-2px)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
            transition: "all 0.3s ease",
          }}
        >
          {isSaving
            ? "Saving..."
            : formData.id
            ? "Update Vehicle"
            : "Add Vehicle"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VehicleForm;

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Stack,
  Divider,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  LocalGasStation as FuelIcon,
  DirectionsCar as CarIcon,
  Fingerprint as ChassisIcon,
  Speed as SpeedIcon,
} from "@mui/icons-material";
import CarImage from "/car.jpg";
import VanImage from "/van.jpg";
import BikeImage from "/bike.jpg";
import TruckImage from "/truck.jpg";
import BusImage from "/bus.jpg";

const defaultImages = {
  Car: CarImage,
  Van: VanImage,
  Bike: BikeImage,
  Truck: TruckImage,
  Bus: BusImage,
};

// Function to map vehicle types to available images
const getVehicleImage = (vehicleType) => {
  const typeMapping = {
    // Car-like vehicles
    Sedan: "Car",
    SUV: "Car",
    Hatchback: "Car",
    Coupe: "Car",
    Convertible: "Car",
    Wagon: "Car",
    "Electric Vehicle": "Car",
    "Luxury Car": "Car",

    // Van-like vehicles
    Van: "Van",
    Minivan: "Van",

    // Bike-like vehicles
    Motorcycle: "Bike",
    Scooter: "Bike",

    // Truck-like vehicles
    "Pickup Truck": "Truck",
    Truck: "Truck",

    // Bus
    Bus: "Bus",
  };

  const mappedType = typeMapping[vehicleType] || "Car";
  return defaultImages[mappedType];
};

const VehicleCard = ({ vehicle, onEdit, onDelete }) => {
  const vehicleImage = getVehicleImage(vehicle.type);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = async () => {
    setIsEditing(true);
    try {
      await onEdit(vehicle);
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(vehicle.id);
    } catch (error) {
      setIsDeleting(false);
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
          borderColor: "primary.main",
        },
      }}
    >
      {/* Image Section with Gradient Overlay */}
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <Box
          component="img"
          src={vehicleImage}
          alt={`${vehicle.type} image`}
          sx={{
            width: "100%",
            height: 220,
            objectFit: "cover",
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        />
        {/* Gradient Overlay */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
          }}
        />
        {/* Vehicle Type Badge */}
        <Chip
          icon={<CarIcon sx={{ fontSize: 16, color: "white !important" }} />}
          label={vehicle.type}
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            bgcolor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(10px)",
            color: "white",
            fontWeight: 600,
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Vehicle Name and Plate */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: "1.25rem",
                mb: 0.5,
                color: "text.primary",
                lineHeight: 1.3,
              }}
            >
              {vehicle.year} {vehicle.make}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              {vehicle.model}
            </Typography>
          </Box>
          <Chip
            label={vehicle.plateNumber}
            color="primary"
            size="medium"
            sx={{
              fontWeight: 700,
              fontSize: "0.875rem",
              height: "32px",
              borderRadius: 2,
            }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Vehicle Details Grid */}
        <Stack spacing={1.5}>
          {/* Fuel Type */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.5,
              borderRadius: 2,
              bgcolor: "action.hover",
            }}
          >
            <FuelIcon sx={{ fontSize: 20, color: "primary.main" }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Fuel Type
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {vehicle.fuelType}
              </Typography>
            </Box>
          </Box>

          {/* Chassis Number */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.5,
              borderRadius: 2,
              bgcolor: "action.hover",
            }}
          >
            <ChassisIcon sx={{ fontSize: 20, color: "secondary.main" }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Chassis Number
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  fontFamily: "monospace",
                }}
              >
                {vehicle.chassisNumber}
              </Typography>
            </Box>
          </Box>

          {/* Last Service Date */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.5,
              borderRadius: 2,
              bgcolor: "action.hover",
            }}
          >
            <CalendarIcon sx={{ fontSize: 20, color: "success.main" }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Last Service
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {vehicle.lastServiceDate || "Not serviced yet"}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </CardContent>

      {/* Action Buttons */}
      <CardActions sx={{ px: 3, pb: 3, pt: 0, gap: 1.5 }}>
        <Tooltip title="Edit vehicle details">
          <span style={{ flex: 1 }}>
            <Button
              variant="outlined"
              size="large"
              startIcon={
                isEditing ? <CircularProgress size={16} /> : <EditIcon />
              }
              onClick={handleEdit}
              disabled={isEditing || isDeleting}
              fullWidth
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                py: 1.2,
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                },
                transition: "all 0.2s ease",
              }}
            >
              {isEditing ? "Editing..." : "Edit"}
            </Button>
          </span>
        </Tooltip>
        <Tooltip title="Delete vehicle">
          <span style={{ flex: 1 }}>
            <Button
              variant="outlined"
              size="large"
              color="error"
              startIcon={
                isDeleting ? (
                  <CircularProgress size={16} color="error" />
                ) : (
                  <DeleteIcon />
                )
              }
              onClick={handleDelete}
              disabled={isDeleting || isEditing}
              fullWidth
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                py: 1.2,
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)",
                },
                transition: "all 0.2s ease",
              }}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </span>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default VehicleCard;

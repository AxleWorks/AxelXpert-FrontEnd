import React from "react";
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
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  LocalGasStation as FuelIcon,
  DirectionsCar as CarIcon,
  Fingerprint as ChassisIcon,
} from "@mui/icons-material";
import CarImage from "../../../public/car.jpg";
import VanImage from "../../../public/van.jpg";
import BikeImage from "../../../public/bike.jpg";
import TruckImage from "../../../public/truck.jpg";
import BusImage from "../../../public/bus.jpg";

const defaultImages = {
  Car: CarImage,
  Van: VanImage,
  Bike: BikeImage,
  Truck: TruckImage,
  Bus: BusImage,
};

const VehicleCard = ({ vehicle, onEdit, onDelete }) => {
  const vehicleImage = defaultImages[vehicle.type] || defaultImages.Car;

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <Box
          component="img"
          src={vehicleImage}
          alt={`${vehicle.type} image`}
          sx={{
            width: "100%",
            height: 240,
            objectFit: "cover",
          }}
        />
      </Box>

      <CardContent sx={{ pb: 1 }}>
        {/* Vehicle Name and Year */}
        {/* Vehicle Type and Fuel Type Chips */}
        <Box
          sx={{
            display: "flex",
            alignContent: "center",
            gap: 1,
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Chip
            icon={<CarIcon sx={{ fontSize: 16 }} />}
            label={vehicle.type}
            size="small"
            variant="outlined"
            sx={{
              borderRadius: 2,
              fontWeight: 500,
            }}
          />
          <Chip
            icon={<FuelIcon sx={{ fontSize: 16 }} />}
            label={vehicle.fuelType}
            size="small"
            variant="outlined"
            sx={{
              borderRadius: 2,
              fontWeight: 500,
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
            {vehicle.year} {vehicle.make}
          </Typography>
          <Chip
            label={vehicle.plateNumber}
            color="primary"
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: "0.75rem",
              height: "24px",
            }}
          />
        </Box>

        {/* Model Name */}
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            mb: 2,
            fontWeight: 500,
          }}
        >
          {vehicle.model}
        </Typography>

        {/* Chassis Number */}
        <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography variant="body2">Chassis:</Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, fontSize: "0.75rem" }}
          >
            {vehicle.chassisNumber}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Vehicle Details with Icons */}
        <Stack sx={{ mb: 2 }} spacing={1.5}>
          {/* Last Service Date */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <CalendarIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", flex: 1 }}
            >
              Last Service:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {vehicle.lastServiceDate}
            </Typography>
          </Box>
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
        <Button
          variant="outlined"
          size="medium"
          startIcon={<EditIcon />}
          onClick={() => onEdit(vehicle)}
          fullWidth
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            py: 1,
          }}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          size="medium"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(vehicle.id)}
          fullWidth
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            py: 1,
          }}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default VehicleCard;

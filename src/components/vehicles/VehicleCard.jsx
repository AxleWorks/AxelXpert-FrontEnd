import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from "@mui/material";
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
    <Card sx={{ borderRadius: 2, boxShadow: 3, overflow: "hidden" }}>
      <Box
        component="img"
        src={vehicleImage}
        alt={`${vehicle.type} image`}
        sx={{ width: "100%", height: 200, objectFit: "cover" }}
      />
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {vehicle.make} {vehicle.model} ({vehicle.year})
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Type: {vehicle.type}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fuel: {vehicle.fuelType}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Plate: {vehicle.plateNumber}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Chassis: {vehicle.chassisNumber}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Last Service: {vehicle.lastServiceDate}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={() => onEdit(vehicle)}>
          Edit
        </Button>
        <Button size="small" color="error" onClick={() => onDelete(vehicle.id)}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default VehicleCard;

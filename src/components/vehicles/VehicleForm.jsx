import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

const VehicleForm = ({ open, onClose, onSave, formData, setFormData }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const vehicleTypes = ["Car", "Van", "Bike", "Truck", "Bus"];
  const vehicleBrands = ["Toyota", "Tata", "Bajaj", "Hyundai", "Honda"];

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{formData.id ? "Edit Vehicle" : "Add Vehicle"}</DialogTitle>
      <DialogContent>
        <TextField
          select
          margin="dense"
          label="Type"
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          fullWidth
        >
          {vehicleTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          type="number"
          margin="dense"
          label="Year"
          name="year"
          value={formData.year}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          select
          margin="dense"
          label="Make"
          name="make"
          value={formData.make}
          onChange={handleInputChange}
          fullWidth
        >
          {vehicleBrands.map((brand) => (
            <MenuItem key={brand} value={brand}>
              {brand}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          label="Model"
          name="model"
          value={formData.model}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          select
          margin="dense"
          label="Fuel Type"
          name="fuelType"
          value={formData.fuelType}
          onChange={handleInputChange}
          fullWidth
        >
          {["Petrol", "Diesel", "Electric", "Hybrid"].map((fuel) => (
            <MenuItem key={fuel} value={fuel}>
              {fuel}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          label="Plate Number"
          name="plateNumber"
          value={formData.plateNumber}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Chassis Number"
          name="chassisNumber"
          value={formData.chassisNumber}
          onChange={handleInputChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={onSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VehicleForm;

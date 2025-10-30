import React, { useEffect, useState } from "react";
import { Typography, Box, Grid, Button } from "@mui/material";
import UserLayout from "../../layouts/user/UserLayout";
import { authenticatedAxios } from "../../utils/axiosConfig.js";
import { getCurrentUser } from "../../utils/jwtUtils.js";
import { VEHICLES_URL } from "../../config/apiEndpoints";
import VehicleCard from "../../components/vehicles/VehicleCard";
import VehicleForm from "../../components/vehicles/VehicleForm";

const UserVehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    year: "",
    make: "",
    model: "",
    fuelType: "",
    plateNumber: "",
    chassisNumber: "",
    lastServiceDate: "",
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const currentUser = getCurrentUser();
        const userId = currentUser?.id;
        if (!userId) {
          console.error("User ID not found in JWT token");
          setVehicles([]);
          return;
        }
        const response = await authenticatedAxios.get(`${VEHICLES_URL}/user/${userId}`);
        setVehicles(Array.isArray(response.data) ? response.data : []); // Ensure vehicles is always an array
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setVehicles([]); // Fallback to an empty array on error
      }
    };

    fetchVehicles();
  }, []);

  const handleOpenDialog = (vehicle = null) => {
    setFormData(
      vehicle || {
        type: "",
        year: "",
        make: "",
        model: "",
        fuelType: "",
        plateNumber: "",
        chassisNumber: "",
        lastServiceDate: "",
      }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSave = async () => {
    try {
      const currentUser = getCurrentUser();
      const userId = currentUser?.id;
      if (!userId) {
        console.error("User ID not found in JWT token");
        return;
      }

      if (formData.id) {
        // Update vehicle
        await authenticatedAxios.put(
          `${VEHICLES_URL}/${formData.id}`,
          formData
        );

      } else {
        // Create new vehicle
        await authenticatedAxios.post(
          VEHICLES_URL,
          {
            ...formData,
            userId: userId,
          }
        );

      }
      handleCloseDialog();
      const response = await authenticatedAxios.get(`${VEHICLES_URL}/user/${userId}`);
      setVehicles(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error saving vehicle:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await authenticatedAxios.delete(`${VEHICLES_URL}/${id}`);
      setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== id));
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  return (
    <UserLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Vehicles
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 3 }}
          onClick={() => handleOpenDialog()}
        >
          Add Vehicle
        </Button>
        <Grid container spacing={3}>
          {vehicles.map((vehicle) => (
            <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
              <VehicleCard
                vehicle={vehicle}
                onEdit={() => handleOpenDialog(vehicle)}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
        <VehicleForm
          open={openDialog}
          onClose={handleCloseDialog}
          onSave={handleSave}
          formData={formData}
          setFormData={setFormData}
        />
      </Box>
    </UserLayout>
  );
};

export default UserVehiclesPage;

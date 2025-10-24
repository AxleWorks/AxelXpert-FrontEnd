import React, { useEffect, useState } from "react";
import { Modal, Button, TextField, FormControl, InputLabel, Select, MenuItem, Box, Typography, Grid, Chip, IconButton, Paper, Alert, Divider, Card, CardContent, FormControlLabel, Checkbox, Stack } from "@mui/material";
import { Close, DirectionsCar, Build, PhotoCamera } from "@mui/icons-material";

const CustomerBookingModal = ({ open, onClose, selectedDate, selectedTimeSlot, onSubmit, branchId, dayTimeSlots = [], services, vehicles }) => {
  const defaultVehicles = [
    { id: 1, type: "Car", year: 2018, make: "Toyota", model: "Corolla", plateNumber: "PLT-1001", chassisNumber: "CHASSIS1001" },
    { id: 2, type: "Car", year: 2020, make: "Honda", model: "Civic", plateNumber: "PLT-1002", chassisNumber: "CHASSIS1002" },
  ];

  const defaultServices = [
    { id: 1, name: "Oil Change", price: 29.99, durationMinutes: 30 },
    { id: 2, name: "Tire Rotation", price: 49.99, durationMinutes: 45 },
    { id: 3, name: "Brake Inspection", price: 79.99, durationMinutes: 60 },
    { id: 4, name: "Battery Replacement", price: 119.99, durationMinutes: 30 },
    { id: 5, name: "Full Service", price: 249.99, durationMinutes: 180 },
    { id: 6, name: "AC Service", price: 99.99, durationMinutes: 60 },
  ];

  const [existingVehicles] = useState(() => {
    const src = Array.isArray(vehicles) && vehicles.length ? vehicles : defaultVehicles;
    return src.map((v) => ({ id: v.id, make: v.make, model: v.model, year: v.year, licensePlate: v.plateNumber || v.licensePlate, vin: v.chassisNumber || v.vin }));
  });

  const [serviceTypes] = useState(() => {
    const src = Array.isArray(services) && services.length ? services : defaultServices;
    return src.map((s) => ({ id: s.id, name: s.name, price: s.price, duration: s.durationMinutes ?? s.duration }));
  });

  const [defaultTimeSlots] = useState(["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM"]);

  // Minimal form data: only fields we keep for customer booking
  const [formData, setFormData] = useState({ vehicleType: "", serviceType: "", timeSlot: "", customerInfo: { name: "" } });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedTimeSlot?.time) setFormData((p) => ({ ...p, timeSlot: selectedTimeSlot.time }));
  }, [selectedTimeSlot]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };
  const handleNestedInputChange = (parent, field, value) => setFormData((prev) => ({ ...prev, [parent]: { ...prev[parent], [field]: value } }));
  // no image upload in simplified form

  const validateForm = () => {
    const newErrors = {};
    if (!formData.vehicleType) newErrors.vehicleType = "Please select a vehicle type";
    if (!formData.serviceType) newErrors.serviceType = "Please select a service type";
    if (!formData.timeSlot) newErrors.timeSlot = "Please select a time slot";
    if (!formData.customerInfo.name) newErrors.customerName = "Name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const vehicleText = formData.vehicleType || "";
    const selectedServiceDef = serviceTypes.find((s) => s.id === formData.serviceType);
    const bookingData = { ...formData, date: selectedDate, branchId, status: "Pending", createdAt: new Date().toISOString(), customer: formData.customerInfo.name, vehicle: vehicleText, service: selectedServiceDef?.name || "", time: formData.timeSlot, branch: branchId };
    onSubmit(bookingData);
  };

  const handleClose = () => {
    setFormData({ vehicleType: "", serviceType: "", timeSlot: "", customerInfo: { name: "" } });
    setErrors({});
    onClose();
  };

  const formatDate = (date) => (!date ? "" : date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
  const selectedService = serviceTypes.find((s) => s.id === formData.serviceType);
  const paperStyle = { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "min(92vw, 520px)", maxHeight: "86vh", overflowY: "auto", p: 3, borderRadius: 2, boxShadow: "0 12px 40px rgba(2,6,23,0.4)" };

  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition BackdropProps={{ sx: { backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.36)" } }}>
      <Paper sx={paperStyle}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Box>
            <Typography variant="h6">Book Appointment</Typography>
            <Typography variant="body2" color="text.secondary">{formatDate(selectedDate)}</Typography>
          </Box>
          <IconButton onClick={handleClose} color="inherit"><Close /></IconButton>
        </Stack>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <DirectionsCar /> Customer Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  label="Full Name *"
                  value={formData.customerInfo.name}
                  onChange={(e) => handleNestedInputChange("customerInfo", "name", e.target.value)}
                  error={!!errors.customerName}
                  helperText={errors.customerName}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}><Divider /></Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <DirectionsCar /> Vehicle Information
            </Typography>
            <FormControl fullWidth error={!!errors.vehicleType}>
              <InputLabel>Vehicle Type</InputLabel>
              <Select value={formData.vehicleType} onChange={(e) => handleInputChange("vehicleType", e.target.value)} label="Vehicle Type">
                {["Car", "Truck", "SUV", "Van"].map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {errors.vehicleType && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.vehicleType}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}><Divider /></Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Build /> Service Information
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ width: "100%" }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <FormControl fullWidth error={!!errors.serviceType} sx={{ width: "100%" }}>
                  <InputLabel>Service Type *</InputLabel>
                  <Select fullWidth value={formData.serviceType} onChange={(e) => handleInputChange("serviceType", e.target.value)} label="Service Type *" sx={{ width: "100%" }}>
                    {serviceTypes.map((service) => (
                      <MenuItem key={service.id} value={service.id}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                          <span>{service.name}</span>
                          <span>${service.price}</span>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.serviceType && (<Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.serviceType}</Typography>)}
                </FormControl>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <FormControl fullWidth error={!!errors.timeSlot} sx={{ width: "100%" }}>
                  <InputLabel>Time Slot *</InputLabel>
                  <Select fullWidth value={formData.timeSlot} onChange={(e) => handleInputChange("timeSlot", e.target.value)} label="Time Slot *" sx={{ width: "100%" }}>
                    {(dayTimeSlots.length ? dayTimeSlots : defaultTimeSlots).map((time) => (<MenuItem key={time} value={time}>{time}</MenuItem>))}
                  </Select>
                  {errors.timeSlot && (<Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.timeSlot}</Typography>)}
                </FormControl>
              </Box>
            </Stack>
            {selectedService && (
              <Card sx={{ mt: 2, bgcolor: "primary.light", color: "primary.contrastText" }}>
                <CardContent sx={{ py: 1.5 }}>
                  <Typography variant="body2"><strong>Service Details:</strong> {selectedService.name} - Duration: {selectedService.duration} mins - Price: ${selectedService.price}</Typography>
                </CardContent>
              </Card>
            )}
          </Grid>

          <Grid item xs={12}><Divider /></Grid>
        </Grid>

        {formData.serviceType && formData.timeSlot && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2"><strong>Booking Summary:</strong><br />Date: {formatDate(selectedDate)}<br />Time: {formData.timeSlot}<br />Service: {selectedService?.name}<br />Estimated Duration: {selectedService?.duration} minutes<br />Price: ${selectedService?.price}</Typography>
          </Alert>
        )}

        <Stack direction="row" spacing={1} sx={{ p: 2, pt: 3 }}>
          <Button onClick={handleClose} variant="outlined">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!formData.serviceType || !formData.timeSlot}>Book Appointment</Button>
        </Stack>
      </Paper>
    </Modal>
  );
};

export default CustomerBookingModal;

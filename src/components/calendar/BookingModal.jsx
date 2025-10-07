import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Grid,
  Chip,
  IconButton,
  Paper,
  Alert,
  Divider,
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
  Stack,
} from '@mui/material';
import {
  Close,
  Add,
  DirectionsCar,
  Build,
  AccessTime,
  AttachFile,
  PhotoCamera,
} from '@mui/icons-material';

const BookingModal = ({ 
  open, 
  onClose, 
  selectedDate, 
  selectedTimeSlot, 
  onSubmit, 
  branchId,
  dayTimeSlots = [] // optional: restrict to available times for selected day
}) => {
  const [formData, setFormData] = useState({
    vehicleId: '',
    newVehicle: {
      make: '',
      model: '',
      year: '',
      licensePlate: '',
      vin: ''
    },
    serviceType: '',
    timeSlot: '',
    notes: '',
    images: [],
    useNewVehicle: false,
    customerInfo: {
      name: '',
      phone: '',
      email: ''
    }
  });

  const [existingVehicles] = useState([
    { id: 1, make: 'Toyota', model: 'Camry', year: 2020, licensePlate: 'ABC123' },
    { id: 2, make: 'Honda', model: 'Civic', year: 2019, licensePlate: 'XYZ789' },
  ]);

  const [serviceTypes] = useState([
    { id: 1, name: 'Oil Change', duration: 30, price: 50 },
    { id: 2, name: 'Brake Service', duration: 60, price: 120 },
    { id: 3, name: 'Tire Rotation', duration: 45, price: 40 },
    { id: 4, name: 'General Inspection', duration: 90, price: 80 },
    { id: 5, name: 'Engine Diagnostic', duration: 120, price: 150 },
  ]);

  const [defaultTimeSlots] = useState([
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'
  ]);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedTimeSlot) {
      setFormData(prev => ({
        ...prev,
        timeSlot: selectedTimeSlot.time || ''
      }));
    }
  }, [selectedTimeSlot]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Vehicle validation
    if (!formData.useNewVehicle && !formData.vehicleId) {
      newErrors.vehicleId = 'Please select a vehicle';
    }

    if (formData.useNewVehicle) {
      if (!formData.newVehicle.make) newErrors.make = 'Make is required';
      if (!formData.newVehicle.model) newErrors.model = 'Model is required';
      if (!formData.newVehicle.year) newErrors.year = 'Year is required';
      if (!formData.newVehicle.licensePlate) newErrors.licensePlate = 'License plate is required';
    }

    // Service validation
    if (!formData.serviceType) {
      newErrors.serviceType = 'Please select a service type';
    }

    // Time slot validation
    if (!formData.timeSlot) {
      newErrors.timeSlot = 'Please select a time slot';
    }

    // Customer info validation
    if (!formData.customerInfo.name) newErrors.customerName = 'Name is required';
    if (!formData.customerInfo.phone) newErrors.customerPhone = 'Phone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // derive display fields that mirror what manager sees in AppointmentPopup
    const selectedVehicle = !formData.useNewVehicle
      ? existingVehicles.find(v => v.id === formData.vehicleId)
      : formData.newVehicle;

    const vehicleText = selectedVehicle
      ? `${selectedVehicle.year || ''} ${selectedVehicle.make || ''} ${selectedVehicle.model || ''}`.trim()
      : '';

    const selectedServiceDef = serviceTypes.find(s => s.id === formData.serviceType);

    const bookingData = {
      ...formData,
      date: selectedDate,
      branchId,
      // Normalize to manager status casing
      status: 'Pending',
      createdAt: new Date().toISOString(),
      // Manager-visible summary fields
      customer: formData.customerInfo.name,
      phone: formData.customerInfo.phone,
      vehicle: vehicleText,
      service: selectedServiceDef?.name || '',
      time: formData.timeSlot,
      branch: branchId, // replace with branch display name if available upstream
      notes: formData.notes,
    };

    onSubmit(bookingData);
  };

  const handleClose = () => {
    setFormData({
      vehicleId: '',
      newVehicle: {
        make: '',
        model: '',
        year: '',
        licensePlate: '',
        vin: ''
      },
      serviceType: '',
      timeSlot: '',
      notes: '',
      images: [],
      useNewVehicle: false,
      customerInfo: {
        name: '',
        phone: '',
        email: ''
      }
    });
    setErrors({});
    onClose();
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const selectedService = serviceTypes.find(s => s.id === formData.serviceType);
  const paperStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'min(92vw, 760px)',
    maxHeight: '86vh',
    overflowY: 'auto',
    p: 3,
    borderRadius: 2,
    boxShadow: '0 12px 40px rgba(2,6,23,0.4)'
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(6px)',
          backgroundColor: 'rgba(0,0,0,0.36)'
        }
      }}
    >
      <Paper sx={paperStyle}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Box>
            <Typography variant="h6">Book Appointment</Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDate(selectedDate)}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} color="inherit">
            <Close />
          </IconButton>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={3}>
          {/* Customer Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DirectionsCar /> Customer Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Full Name *"
                  value={formData.customerInfo.name}
                  onChange={(e) => handleNestedInputChange('customerInfo', 'name', e.target.value)}
                  error={!!errors.customerName}
                  helperText={errors.customerName}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Phone Number *"
                  value={formData.customerInfo.phone}
                  onChange={(e) => handleNestedInputChange('customerInfo', 'phone', e.target.value)}
                  error={!!errors.customerPhone}
                  helperText={errors.customerPhone}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.customerInfo.email}
                  onChange={(e) => handleNestedInputChange('customerInfo', 'email', e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Vehicle Selection */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DirectionsCar /> Vehicle Information
            </Typography>
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.useNewVehicle}
                  onChange={(e) => handleInputChange('useNewVehicle', e.target.checked)}
                />
              }
              label="Add new vehicle"
              sx={{ mb: 2 }}
            />

            {!formData.useNewVehicle ? (
              <FormControl fullWidth error={!!errors.vehicleId}>
                <InputLabel>Select Vehicle</InputLabel>
                <Select
                  value={formData.vehicleId}
                  onChange={(e) => handleInputChange('vehicleId', e.target.value)}
                  label="Select Vehicle"
                >
                  {existingVehicles.map((vehicle) => (
                    <MenuItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                    </MenuItem>
                  ))}
                </Select>
                {errors.vehicleId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {errors.vehicleId}
                  </Typography>
                )}
              </FormControl>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Make *"
                    value={formData.newVehicle.make}
                    onChange={(e) => handleNestedInputChange('newVehicle', 'make', e.target.value)}
                    error={!!errors.make}
                    helperText={errors.make}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Model *"
                    value={formData.newVehicle.model}
                    onChange={(e) => handleNestedInputChange('newVehicle', 'model', e.target.value)}
                    error={!!errors.model}
                    helperText={errors.model}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Year *"
                    type="number"
                    value={formData.newVehicle.year}
                    onChange={(e) => handleNestedInputChange('newVehicle', 'year', e.target.value)}
                    error={!!errors.year}
                    helperText={errors.year}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="License Plate *"
                    value={formData.newVehicle.licensePlate}
                    onChange={(e) => handleNestedInputChange('newVehicle', 'licensePlate', e.target.value.toUpperCase())}
                    error={!!errors.licensePlate}
                    helperText={errors.licensePlate}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="VIN"
                    value={formData.newVehicle.vin}
                    onChange={(e) => handleNestedInputChange('newVehicle', 'vin', e.target.value.toUpperCase())}
                  />
                </Grid>
              </Grid>
            )}
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Service Selection */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Build /> Service Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.serviceType}>
                  <InputLabel>Service Type *</InputLabel>
                  <Select
                    value={formData.serviceType}
                    onChange={(e) => handleInputChange('serviceType', e.target.value)}
                    label="Service Type *"
                  >
                    {serviceTypes.map((service) => (
                      <MenuItem key={service.id} value={service.id}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <span>{service.name}</span>
                          <span>${service.price}</span>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.serviceType && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      {errors.serviceType}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.timeSlot}>
                  <InputLabel>Time Slot *</InputLabel>
                  <Select
                    value={formData.timeSlot}
                    onChange={(e) => handleInputChange('timeSlot', e.target.value)}
                    label="Time Slot *"
                  >
                    {(dayTimeSlots.length ? dayTimeSlots : defaultTimeSlots).map((time) => (
                      <MenuItem key={time} value={time}>
                        {time}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.timeSlot && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      {errors.timeSlot}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            {selectedService && (
              <Card sx={{ mt: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <CardContent sx={{ py: 1.5 }}>
                  <Typography variant="body2">
                    <strong>Service Details:</strong> {selectedService.name} - 
                    Duration: {selectedService.duration} mins - 
                    Price: ${selectedService.price}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Notes and Images */}
          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Additional Information
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes or Special Instructions"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Describe any specific issues, concerns, or special requests..."
              sx={{ mb: 2 }}
            />

            {/* Image Upload */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Attach Images (optional)
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                multiple
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCamera />}
                  sx={{ mr: 1 }}
                >
                  Upload Images
                </Button>
              </label>

              {formData.images.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.images.map((image, index) => (
                    <Chip
                      key={index}
                      label={image.name}
                      onDelete={() => removeImage(index)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Booking Summary */}
        {(formData.serviceType && formData.timeSlot) && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Booking Summary:</strong><br />
              Date: {formatDate(selectedDate)}<br />
              Time: {formData.timeSlot}<br />
              Service: {selectedService?.name}<br />
              Estimated Duration: {selectedService?.duration} minutes<br />
              Price: ${selectedService?.price}
            </Typography>
          </Alert>
        )}

        <Stack direction="row" spacing={1} sx={{ p: 2, pt: 3 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.serviceType || !formData.timeSlot}
          >
            Book Appointment
          </Button>
        </Stack>
      </Paper>
    </Modal>
  );
};

export default BookingModal;
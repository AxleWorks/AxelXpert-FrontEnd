import React, { useEffect, useState, useRef } from "react";
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
  Fade,
  CircularProgress,
} from "@mui/material";
import {
  Close,
  DirectionsCar,
  Build,
  PhotoCamera,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { authenticatedAxios } from "../../utils/axiosConfig";
import {
  BRANCHES_URL,
  VEHICLES_URL,
  SERVICES_URL,
} from "../../config/apiEndpoints";

const CustomerBookingModal = ({
  open,
  onClose,
  selectedDate,
  selectedTimeSlot,
  onSubmit,
  branchId,
  dayTimeSlots = [],
  services,
  vehicles,
}) => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const paperRef = useRef(null);
  const { user } = useAuth?.() || { user: null };

  // API data states
  const [branches, setBranches] = useState([]);
  const [apiVehicles, setApiVehicles] = useState([]);
  const [apiServices, setApiServices] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState(null);

  const defaultVehicles = [
    {
      id: 1,
      type: "Car",
      year: 2018,
      make: "Toyota",
      model: "Corolla",
      plateNumber: "PLT-1001",
      chassisNumber: "CHASSIS1001",
    },
    {
      id: 2,
      type: "Car",
      year: 2020,
      make: "Honda",
      model: "Civic",
      plateNumber: "PLT-1002",
      chassisNumber: "CHASSIS1002",
    },
  ];

  const defaultServices = [
    { id: 1, name: "Oil Change", price: 29.99, durationMinutes: 30 },
    { id: 2, name: "Tire Rotation", price: 49.99, durationMinutes: 45 },
    { id: 3, name: "Brake Inspection", price: 79.99, durationMinutes: 60 },
    { id: 4, name: "Battery Replacement", price: 119.99, durationMinutes: 30 },
    { id: 5, name: "Full Service", price: 249.99, durationMinutes: 180 },
    { id: 6, name: "AC Service", price: 99.99, durationMinutes: 60 },
  ];

  const [defaultTimeSlots] = useState([
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
  ]);

  // Fetch branches, vehicles, and services from API
  useEffect(() => {
    const fetchData = async () => {
      if (!open) return; // Only fetch when modal is open

      setLoadingData(true);
      setDataError(null);

      try {
        // Fetch all data in parallel
        const [branchesRes, vehiclesRes, servicesRes] = await Promise.all([
          authenticatedAxios
            .get(`${BRANCHES_URL}/all`)
            .catch(() => ({ data: [] })),
          user?.id
            ? authenticatedAxios
                .get(`${VEHICLES_URL}/user/${user.id}`)
                .catch(() => ({ data: [] }))
            : Promise.resolve({ data: [] }),
          authenticatedAxios
            .get(`${SERVICES_URL}/all`)
            .catch(() => ({ data: defaultServices })),
        ]);

        setBranches(branchesRes.data || []);
        setApiVehicles(vehiclesRes.data || []);
        setApiServices(servicesRes.data || defaultServices);
      } catch (error) {
        console.error("Error fetching modal data:", error);
        setDataError("Failed to load some data. Please try again.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [open, user?.id]);

  // Form data with vehicle selection support
  const [formData, setFormData] = useState({
    vehicleId: "",
    vehicleType: "",
    serviceType: "",
    timeSlot: "",
    customerInfo: {
      name: user?.username || user?.name || "",
      phone: user?.phone || user?.phoneNumber || "",
    },
    branchId: branchId || "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  // Update customer info when user changes
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customerInfo: {
          name: user?.username || user?.name || "",
          phone: user?.phone || user?.phoneNumber || "",
        },
      }));
    }
  }, [user]);

  useEffect(() => {
    if (selectedTimeSlot?.time)
      setFormData((p) => ({ ...p, timeSlot: selectedTimeSlot.time }));
  }, [selectedTimeSlot]);

  // Auto-fill vehicle type when existing vehicle is selected
  useEffect(() => {
    if (!formData.vehicleId) return;
    const sel = apiVehicles.find(
      (v) => v.id === formData.vehicleId || v.id === Number(formData.vehicleId)
    );
    if (sel && sel.type) {
      setFormData((p) => ({ ...p, vehicleType: sel.type }));
      if (errors.vehicleType)
        setErrors((prev) => ({ ...prev, vehicleType: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.vehicleId, apiVehicles]);

  // Check if scroll indicator should be shown
  useEffect(() => {
    const checkScroll = () => {
      if (paperRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = paperRef.current;
        setShowScrollIndicator(
          scrollHeight > clientHeight &&
            scrollTop < scrollHeight - clientHeight - 10
        );
      }
    };

    checkScroll();
    const timer = setTimeout(checkScroll, 100);

    return () => clearTimeout(timer);
  }, [open, formData]);

  const handleScroll = () => {
    if (paperRef.current) {
      const { scrollTop } = paperRef.current;
      // Hide indicator as soon as user starts scrolling
      if (scrollTop > 0) {
        setShowScrollIndicator(false);
      }
    }
  };

  useEffect(() => {
    if (selectedTimeSlot?.time)
      setFormData((p) => ({ ...p, timeSlot: selectedTimeSlot.time }));
  }, [selectedTimeSlot]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };
  const handleNestedInputChange = (parent, field, value) =>
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  // no image upload in simplified form

  const validateForm = () => {
    const newErrors = {};
    // Require either selected existing vehicle or a vehicle type
    if (!formData.vehicleType && !formData.vehicleId)
      newErrors.vehicleType = "Please select a vehicle";
    if (!formData.serviceType)
      newErrors.serviceType = "Please select a service type";
    if (!formData.timeSlot) newErrors.timeSlot = "Please select a time slot";
    // Require branch selection
    if (!formData.branchId) newErrors.branchId = "Please select a branch";
    if (!formData.customerInfo.name)
      newErrors.customerName = "Name is required";
    if (!formData.customerInfo.phone)
      newErrors.customerPhone = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const selectedVehicle = apiVehicles.find(
      (v) => v.id === formData.vehicleId || v.id === Number(formData.vehicleId)
    );
    const vehicleText = selectedVehicle
      ? `${selectedVehicle.make} ${selectedVehicle.model} (${
          selectedVehicle.plateNumber || selectedVehicle.licensePlate
        })`
      : formData.vehicleType || "";

    const selectedServiceDef = apiServices.find(
      (s) => s.id === formData.serviceType
    );

    // Use selected branch id
    let chosenBranchId = formData.branchId || branchId || null;

    const chosenBranch =
      branches.find((b) => b.id === chosenBranchId) ||
      branches.find((b) => b.id === Number(chosenBranchId)) ||
      null;

    // Format date to YYYY-MM-DD in LOCAL timezone (not UTC)
    let formattedDate;
    if (selectedDate instanceof Date) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      formattedDate = `${year}-${month}-${day}`;
    } else {
      formattedDate = selectedDate;
    }

    // Build payload matching backend CreateBookingRequest DTO
    const bookingPayload = {
      branch: chosenBranchId, // Long branchId
      customer: formData.customerInfo.name, // String (username or name)
      service: formData.serviceType, // Long serviceId or String serviceName
      date: formattedDate, // String date (YYYY-MM-DD)
      time: formData.timeSlot, // String time (e.g., "09:00 AM")
      vehicle: vehicleText, // String vehicle description
      status: "PENDING", // String status
      notes: formData.notes || "", // String notes
      customerName: formData.customerInfo.name, // String customerName
      customerPhone: formData.customerInfo.phone || "", // String customerPhone
      totalPrice: selectedServiceDef?.price || null, // BigDecimal totalPrice
    };

    try {
      // Call the onSubmit callback with formatted data
      await onSubmit(bookingPayload);

      // Close modal on success
      handleClose();
    } catch (error) {
      console.error("Error submitting booking:", error);
      setErrors({ submit: "Failed to create booking. Please try again." });
    }
  };

  const handleClose = () => {
    setFormData({
      vehicleId: "",
      vehicleType: "",
      serviceType: "",
      timeSlot: "",
      customerInfo: {
        name: user?.username || user?.name || "",
        phone: user?.phone || user?.phoneNumber || "",
      },
      branchId: branchId || "",
      notes: "",
    });
    setErrors({});
    onClose();
  };

  const formatDate = (date) =>
    !date
      ? ""
      : date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  const selectedService = apiServices.find(
    (s) => s.id === formData.serviceType
  );

  const paperStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "min(95vw, 650px)",
    maxHeight: "90vh",
    overflowY: "auto",
    p: 4,
    borderRadius: 3,
    boxShadow: 24,
    bgcolor: "background.paper",
    // Hide scrollbar
    "&::-webkit-scrollbar": {
      display: "none",
    },
    msOverflowStyle: "none", // IE and Edge
    scrollbarWidth: "none", // Firefox
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropProps={{
        sx: {
          backdropFilter: "blur(6px)",
          backgroundColor: "rgba(0,0,0,0.36)",
        },
      }}
    >
      <Paper ref={paperRef} onScroll={handleScroll} sx={paperStyle}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
        >
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

        {errors.submit && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.submit}
          </Alert>
        )}

        {dataError && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {dataError}
          </Alert>
        )}

        {loadingData ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 8,
            }}
          >
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Loading booking information...
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ mt: 2 }}>
              {/* Customer Information Section */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <DirectionsCar /> Customer Information
                </Typography>
                <Stack spacing={2.5}>
                  <TextField
                    fullWidth
                    label="Full Name *"
                    value={formData.customerInfo.name}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "customerInfo",
                        "name",
                        e.target.value
                      )
                    }
                    error={!!errors.customerName}
                    helperText={errors.customerName}
                    disabled
                    InputProps={{
                      sx: { fontSize: "16px" },
                    }}
                    InputLabelProps={{
                      sx: { fontSize: "16px" },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Phone Number *"
                    value={formData.customerInfo.phone}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "customerInfo",
                        "phone",
                        e.target.value
                      )
                    }
                    error={!!errors.customerPhone}
                    helperText={errors.customerPhone}
                    placeholder="e.g., +1 234 567 8900"
                    disabled
                    InputProps={{
                      sx: { fontSize: "16px" },
                    }}
                    InputLabelProps={{
                      sx: { fontSize: "16px" },
                    }}
                  />

                  <FormControl fullWidth error={!!errors.branchId}>
                    <InputLabel>Branch *</InputLabel>
                    <Select
                      value={formData.branchId}
                      label="Branch *"
                      onChange={(e) =>
                        handleInputChange("branchId", e.target.value)
                      }
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                          },
                        },
                      }}
                    >
                      <MenuItem value="">
                        <em>Select a branch</em>
                      </MenuItem>
                      {branches.map((b) => (
                        <MenuItem key={b.id} value={b.id}>
                          {b.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.branchId && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, ml: 1.5 }}
                      >
                        {errors.branchId}
                      </Typography>
                    )}
                  </FormControl>
                </Stack>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Vehicle Information Section */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <DirectionsCar /> Vehicle Information
                </Typography>
                <Stack spacing={2.5}>
                  <FormControl fullWidth error={!!errors.vehicleId}>
                    <InputLabel>Select Your Vehicle *</InputLabel>
                    <Select
                      value={formData.vehicleId}
                      label="Select Your Vehicle *"
                      onChange={(e) =>
                        handleInputChange("vehicleId", e.target.value)
                      }
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                          },
                        },
                      }}
                    >
                      <MenuItem value="">
                        <em>Select a vehicle</em>
                      </MenuItem>
                      {apiVehicles.map((v) => (
                        <MenuItem key={v.id} value={v.id}>
                          {v.make} {v.model} ({v.year}) —{" "}
                          {v.plateNumber || v.licensePlate}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.vehicleId && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, ml: 1.5 }}
                      >
                        {errors.vehicleId}
                      </Typography>
                    )}
                  </FormControl>

                  <FormControl fullWidth error={!!errors.vehicleType}>
                    <InputLabel>Vehicle Type *</InputLabel>
                    <Select
                      value={formData.vehicleType}
                      onChange={(e) =>
                        handleInputChange("vehicleType", e.target.value)
                      }
                      label="Vehicle Type *"
                      disabled={!!formData.vehicleId}
                    >
                      <MenuItem value="">
                        <em>Select vehicle type</em>
                      </MenuItem>
                      {["Car", "Truck", "SUV", "Van"].map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.vehicleType && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, ml: 1.5 }}
                      >
                        {errors.vehicleType}
                      </Typography>
                    )}
                  </FormControl>
                </Stack>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Service Information Section */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <Build /> Service Information
                </Typography>
                <Stack spacing={2.5}>
                  <FormControl fullWidth error={!!errors.serviceType}>
                    <InputLabel>Service Type *</InputLabel>
                    <Select
                      value={formData.serviceType}
                      onChange={(e) =>
                        handleInputChange("serviceType", e.target.value)
                      }
                      label="Service Type *"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                          },
                        },
                      }}
                    >
                      <MenuItem value="">
                        <em>Select a service</em>
                      </MenuItem>
                      {apiServices.map((service) => (
                        <MenuItem key={service.id} value={service.id}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                              alignItems: "center",
                            }}
                          >
                            <span>{service.name}</span>
                            <Chip
                              label={`$${service.price}`}
                              size="small"
                              color="primary"
                              sx={{ ml: 2 }}
                            />
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.serviceType && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, ml: 1.5 }}
                      >
                        {errors.serviceType}
                      </Typography>
                    )}
                  </FormControl>

                  <FormControl fullWidth error={!!errors.timeSlot}>
                    <InputLabel>Time Slot *</InputLabel>
                    <Select
                      value={formData.timeSlot}
                      onChange={(e) =>
                        handleInputChange("timeSlot", e.target.value)
                      }
                      label="Time Slot *"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                          },
                        },
                      }}
                    >
                      <MenuItem value="">
                        <em>Select time slot</em>
                      </MenuItem>
                      {(dayTimeSlots.length
                        ? dayTimeSlots
                        : defaultTimeSlots
                      ).map((time) => (
                        <MenuItem key={time} value={time}>
                          {time}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.timeSlot && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, ml: 1.5 }}
                      >
                        {errors.timeSlot}
                      </Typography>
                    )}
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Additional Notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    multiline
                    rows={3}
                    placeholder="Any special requests or additional information..."
                    InputProps={{
                      sx: { fontSize: "16px" },
                    }}
                    InputLabelProps={{
                      sx: { fontSize: "16px" },
                    }}
                  />

                  {selectedService && (
                    <Card
                      sx={{
                        bgcolor: "primary.light",
                        borderLeft: 4,
                        borderColor: "primary.main",
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{ fontWeight: 600 }}
                        >
                          Service Details
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>Service:</strong> {selectedService.name}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>Duration:</strong> {selectedService.duration}{" "}
                          minutes
                        </Typography>
                        <Typography variant="body2">
                          <strong>Price:</strong> ${selectedService.price}
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                </Stack>
              </Box>
            </Box>

            {formData.serviceType && formData.timeSlot && (
              <Alert
                severity="info"
                icon={<Build />}
                sx={{ mt: 3, borderRadius: 2 }}
              >
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
                  Booking Summary
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2 }}>
                  <Typography component="li" variant="body2">
                    <strong>Date:</strong> {formatDate(selectedDate)}
                  </Typography>
                  <Typography component="li" variant="body2">
                    <strong>Time:</strong> {formData.timeSlot}
                  </Typography>
                  <Typography component="li" variant="body2">
                    <strong>Service:</strong> {selectedService?.name}
                  </Typography>
                  <Typography component="li" variant="body2">
                    <strong>Duration:</strong> {selectedService?.duration}{" "}
                    minutes
                  </Typography>
                  <Typography component="li" variant="body2">
                    <strong>Price:</strong> ${selectedService?.price}
                  </Typography>
                </Box>
              </Alert>
            )}

            <Stack
              direction="row"
              spacing={2}
              sx={{ mt: 4, justifyContent: "flex-end" }}
            >
              <Button
                onClick={handleClose}
                variant="outlined"
                size="large"
                sx={{ minWidth: 120 }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                size="large"
                disabled={
                  !formData.serviceType || !formData.timeSlot || loadingData
                }
                sx={{ minWidth: 160 }}
              >
                Book Appointment
              </Button>
            </Stack>
          </>
        )}

        {/* Scroll Indicator */}
        <Fade in={showScrollIndicator}>
          <Box
            sx={{
              position: "absolute",
              bottom: 20,
              right: 20,
              backgroundColor: "primary.main",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: 3,
              animation: "bounce 2s infinite",
              "@keyframes bounce": {
                "0%, 20%, 50%, 80%, 100%": {
                  transform: "translateY(0)",
                },
                "40%": {
                  transform: "translateY(-10px)",
                },
                "60%": {
                  transform: "translateY(-5px)",
                },
              },
            }}
          >
            <KeyboardArrowDown sx={{ color: "white" }} />
          </Box>
        </Fade>
      </Paper>
    </Modal>
  );
};

export default CustomerBookingModal;

import React, { useEffect, useState, useRef } from "react";
import { USERS_URL, VEHICLES_URL } from "../../config/apiEndpoints";
import { Modal, Button, TextField, FormControl, InputLabel, Select, MenuItem, Box, Typography, Grid, Chip, IconButton, Paper, Alert, Divider, Card, CardContent, FormControlLabel, Checkbox, Stack, Fade, Snackbar } from "@mui/material";
import { Close, DirectionsCar, Build, PhotoCamera, KeyboardArrowDown, CheckCircle, Error, Warning, Info } from "@mui/icons-material";

const CustomerBookingModal = ({ open, onClose, selectedDate, selectedTimeSlot, onSubmit, branchId, dayTimeSlots = [], services }) => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const paperRef = useRef(null);

  const defaultServices = [
    { id: 1, name: "Oil Change", price: 29.99, durationMinutes: 30 },
    { id: 2, name: "Tire Rotation", price: 49.99, durationMinutes: 45 },
    { id: 3, name: "Brake Inspection", price: 79.99, durationMinutes: 60 },
    { id: 4, name: "Battery Replacement", price: 119.99, durationMinutes: 30 },
    { id: 5, name: "Full Service", price: 249.99, durationMinutes: 180 },
    { id: 6, name: "AC Service", price: 99.99, durationMinutes: 60 },
  ];

  // Branch list for dropdown selection. Replace with prop or API if available.
  const [branches] = useState([
    {
      id: 1,
      name: "Moratuwa",
      address: "100 Central Ave",
      phone: "555-4001",
      email: "example@axlexpert.com",
      mapLink: "https://maps.app.goo.gl/zGXzfHtBCkaU5VpB6",
      openHours: "10:33",
      closeHours: "19:32",
      createdAt: null,
      updatedAt: "2025-10-19T10:32:40.112605",
      managerId: 11,
      managerName: "mgr1",
    },
    { id: 2, name: "Kiribathgoda", address: "200 North Rd", phone: "0112 457 860 ", email: null, mapLink: null, openHours: null, closeHours: null, createdAt: null, updatedAt: "2025-10-19T10:10:13.04426", managerId: 12, managerName: "mgr2" },
    { id: 3, name: "East", address: "300 East Blvd", phone: "555-4003", email: null, mapLink: null, openHours: null, closeHours: null, createdAt: null, updatedAt: null, managerId: 13, managerName: "mgr3" },
    { id: 4, name: "South", address: "400 South St", phone: "555-4004", email: null, mapLink: null, openHours: null, closeHours: null, createdAt: null, updatedAt: null, managerId: 14, managerName: "mgr4" },
    { id: 5, name: "West", address: "500 West Ln", phone: "555-4005", email: null, mapLink: null, openHours: null, closeHours: null, createdAt: null, updatedAt: null, managerId: 15, managerName: "mgr5" },
  ]);

  // User's vehicles fetched from API
  const [userVehicles, setUserVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  const [serviceTypes] = useState(() => {
    const src = Array.isArray(services) && services.length ? services : defaultServices;
    return src.map((s) => ({ id: s.id, name: s.name, price: s.price, duration: s.durationMinutes ?? s.duration }));
  });

  const [defaultTimeSlots] = useState(["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM"]);

  // Form data with vehicle selection support
  const [formData, setFormData] = useState({ 
    vehicleId: "", 
    serviceType: "", 
    customerInfo: { 
      name: "", 
      phone: "" 
    }, 
    branchId: branchId || "",
    notes: ""
  });
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [errors, setErrors] = useState({});

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info" // success, error, warning, info
  });

  // Auto-select branch when modal opens - removed since no branch input needed
  // useEffect removed

  // Check if scroll indicator should be shown
  useEffect(() => {
    const checkScroll = () => {
      if (paperRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = paperRef.current;
        setShowScrollIndicator(scrollHeight > clientHeight && scrollTop < scrollHeight - clientHeight - 10);
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
    if (selectedTimeSlot?.time) setFormData((p) => ({ ...p, timeSlot: selectedTimeSlot.time }));
  }, [selectedTimeSlot]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };
  const handleNestedInputChange = (parent, field, value) => setFormData((prev) => ({ ...prev, [parent]: { ...prev[parent], [field]: value } }));
  // no image upload in simplified form

  // Snackbar helper functions
  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const hideSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const validateForm = () => {
    const newErrors = {};
    // Require vehicle selection
    if (!formData.vehicleId) newErrors.vehicleId = "Please select a vehicle";
    if (!formData.serviceType) newErrors.serviceType = "Please select a service type";
    // Require branch selection
    if (!formData.branchId) newErrors.branchId = "Please select a branch";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch logged-in user info using id from localStorage when modal opens
  useEffect(() => {
    if (!open) return;

    // Read authUser from localStorage (your app stores it under 'authUser')
    const raw = localStorage.getItem("authUser");
    if (!raw) {
      // nothing stored; clear fields
      setCustomerName("");
      setCustomerPhone("");
      setLoadingCustomer(false);
      setUserVehicles([]);
      showSnackbar("Please sign in to book an appointment", "warning");
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("Failed to parse authUser from localStorage", err);
      setCustomerName("");
      setCustomerPhone("");
      setLoadingCustomer(false);
      setUserVehicles([]);
      showSnackbar("Authentication data is invalid. Please sign in again.", "error");
      return;
    }

    // Immediate fallback: show username right away if available
    if (parsed.username) {
      setCustomerName(parsed.username);
    } else if (parsed.email) {
      setCustomerName(parsed.email);
    }

    // If there's an id, fetch the full user record from backend to get phoneNumber
    if (parsed.id) {
      setLoadingCustomer(true);
      showSnackbar("Loading customer information...", "info");

      // Build fetch options. If you have an auth token, read it here and include it:
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      fetch(`${USERS_URL}/${parsed.id}`, { headers })
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(`Failed to load user: ${res.status} ${text}`);
          }
          return res.json();
        })
        .then((user) => {
          // backend UserDTO uses field name phoneNumber
          if (user.username) setCustomerName(user.username);
          if (user.phoneNumber) setCustomerPhone(user.phoneNumber);
          showSnackbar("Customer information loaded successfully", "success");
        })
        .catch((err) => {
          console.error("Error fetching user details:", err);
          showSnackbar("Failed to load customer information", "error");
          // keep username fallback from localStorage; clear phone if none
          setCustomerPhone((prev) => prev || "");
        })
        .finally(() => setLoadingCustomer(false));

      // Fetch user's vehicles
      setLoadingVehicles(true);
      showSnackbar("Loading your vehicles...", "info");
      fetch(`${VEHICLES_URL}/user/${parsed.id}`, { headers })
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(`Failed to load vehicles: ${res.status} ${text}`);
          }
          return res.json();
        })
        .then((vehicles) => {
          // Map backend vehicle data to our format
          const mapped = vehicles.map((v) => ({
            id: v.id,
            make: v.make || "",
            model: v.model || "",
            year: v.year || "",
            type: v.type || v.vehicleType || "",
            licensePlate: v.licensePlate || v.plateNumber || "",
            vin: v.vin || v.chassisNumber || ""
          }));
          setUserVehicles(mapped);
          if (mapped.length === 0) {
            showSnackbar("No vehicles found. Please add a vehicle first.", "warning");
          } else {
            showSnackbar(`${mapped.length} vehicle(s) loaded successfully`, "success");
          }
        })
        .catch((err) => {
          console.error("Error fetching user vehicles:", err);
          showSnackbar("Failed to load vehicles", "error");
          setUserVehicles([]);
        })
        .finally(() => setLoadingVehicles(false));
    } else {
      setLoadingCustomer(false);
      setLoadingVehicles(false);
    }
  }, [open]); // run when the modal opens

  const handleSubmit = async () => {
    if (!validateForm()) {
      showSnackbar("Please fill in all required fields", "error");
      return;
    }
    
    showSnackbar("Creating booking...", "info");
    
    const selectedVehicle = userVehicles.find((v) => v.id === formData.vehicleId || v.id === Number(formData.vehicleId));
    const vehicleText = selectedVehicle 
      ? `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.licensePlate})` 
      : "";
    
    const selectedServiceDef = serviceTypes.find((s) => s.id === formData.serviceType);
    
    // Use the selected branch from the form
    const chosenBranchId = formData.branchId || branchId;
    const chosenBranch = branches.find((b) => b.id === chosenBranchId) || branches.find((b) => b.id === Number(chosenBranchId)) || null;
    const chosenBranchName = chosenBranch?.name || "";
    
    // Format date and time for backend
    let formattedDate;
    let formattedTime = selectedTimeSlot?.time || "09:00 AM"; // Default to 9 AM if no time slot selected
    let formattedDateTime; // Combined datetime string
    
    if (selectedDate instanceof Date) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      formattedDate = `${year}-${month}-${day}`;
      
      // Convert time from "09:00 AM" to 24-hour format HH:mm:ss
      const timeMatch = formattedTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = timeMatch[2];
        const period = timeMatch[3].toUpperCase();
        
        // Convert to 24-hour format
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        const hoursStr = String(hours).padStart(2, '0');
        formattedTime = `${hoursStr}:${minutes}`; // HH:mm format (without seconds)
      } else {
        // Fallback if time format doesn't match - use 9 AM
        formattedTime = "09:00";
      }
      
      // Create combined datetime string (ISO 8601 format: YYYY-MM-DDTHH:mm:ss)
      formattedDateTime = `${formattedDate}T${formattedTime}:00`;
    } else {
      formattedDate = selectedDate;
      // Ensure we have a valid time even if date is a string
      if (!formattedTime || formattedTime === "") {
        formattedTime = "09:00";
      }
      formattedDateTime = `${formattedDate}T${formattedTime}:00`;
    }
    
    // Build payload matching backend CreateBookingRequest DTO
    const bookingPayload = {
      branch: chosenBranchId,                    // Long branchId
      customer: customerName,                    // String (username or name) - from fetched data
      service: String(formData.serviceType),     // String serviceId (convert to string)
      date: formattedDate,                       // String date (YYYY-MM-DD)
      time: formattedTime,                       // String time (HH:mm:ss format)
      vehicle: vehicleText,                      // String vehicle description
      status: "PENDING",                         // String status
      notes: formData.notes || "",               // String notes
      customerName: customerName,                // String customerName - from fetched data
      customerPhone: customerPhone || "",        // String customerPhone - from fetched data
      totalPrice: selectedServiceDef?.price || null     // BigDecimal totalPrice
    };
    
    console.log("Booking payload being sent:", JSON.stringify(bookingPayload, null, 2));
    console.log("Selected time slot:", selectedTimeSlot);
    console.log("Formatted date:", formattedDate);
    console.log("Formatted time:", formattedTime);
    
    try {
      // Call the onSubmit callback with formatted data
      await onSubmit(bookingPayload);
      
      showSnackbar("Booking created successfully!", "success");
      // Close modal on success
      handleClose();
    } catch (error) {
      console.error("Error submitting booking:", error);
      showSnackbar("Failed to create booking. Please try again.", "error");
      setErrors({ submit: "Failed to create booking. Please try again." });
    }
  };

  const handleClose = () => {
    setFormData({ 
      vehicleId: "", 
      serviceType: "", 
      customerInfo: { 
        name: "", 
        phone: "" 
      }, 
      branchId: branchId || "",
      notes: ""
    });
    setErrors({});
    // Hide snackbar when closing
    hideSnackbar();
    onClose();
  };

  const formatDate = (date) => (!date ? "" : date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
  const selectedService = serviceTypes.find((s) => s.id === formData.serviceType);
  
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
    bgcolor: 'background.paper',
    // Hide scrollbar
    '&::-webkit-scrollbar': {
      display: 'none'
    },
    msOverflowStyle: 'none',  // IE and Edge
    scrollbarWidth: 'none',  // Firefox
  };

  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition BackdropProps={{ sx: { backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.36)" } }}>
      <Paper ref={paperRef} onScroll={handleScroll} sx={paperStyle}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Box>
            <Typography variant="h6">Book Appointment</Typography>
            <Typography variant="body2" color="text.secondary">{formatDate(selectedDate)}</Typography>
          </Box>
          <IconButton onClick={handleClose} color="inherit"><Close /></IconButton>
        </Stack>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ mt: 2 }}>
          {/* Customer Information (auto-filled) */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <DirectionsCar /> Customer Information
            </Typography>
            <Stack spacing={1}>
              {/* We no longer show editable name/phone fields. These are auto-filled from the logged-in user. */}
              <Typography variant="body2">
                Customer: <strong>{loadingCustomer ? "(loading...)" : (customerName || "(not signed in)")}</strong>
              </Typography>
              <Typography variant="body2">
                Phone: <strong>{loadingCustomer ? "-" : (customerPhone || "-")}</strong>
              </Typography>

              <FormControl fullWidth error={!!errors.branchId}>
                <InputLabel>Branch *</InputLabel>
                <Select 
                  value={formData.branchId} 
                  label="Branch *" 
                  onChange={(e) => handleInputChange("branchId", e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      }
                    }
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
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {errors.branchId}
                  </Typography>
                )}
              </FormControl>
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Vehicle Information Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <DirectionsCar /> Vehicle Information
            </Typography>
            <Stack spacing={2.5}>
              <FormControl fullWidth error={!!errors.vehicleId}>
                <InputLabel>Select Your Vehicle *</InputLabel>
                <Select 
                  value={formData.vehicleId} 
                  label="Select Your Vehicle *" 
                  onChange={(e) => handleInputChange("vehicleId", e.target.value)}
                  disabled={loadingVehicles}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      }
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>{loadingVehicles ? "Loading your vehicles..." : "Select a vehicle"}</em>
                  </MenuItem>
                  {userVehicles.length === 0 && !loadingVehicles && (
                    <MenuItem disabled>
                      <em>No vehicles found. Please add a vehicle first.</em>
                    </MenuItem>
                  )}
                  {userVehicles.map((v) => (
                    <MenuItem key={v.id} value={v.id}>
                      {v.make} {v.model} ({v.year}) — {v.licensePlate}
                    </MenuItem>
                  ))}
                </Select>
                {errors.vehicleId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {errors.vehicleId}
                  </Typography>
                )}
              </FormControl>
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Service Information Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Build /> Service Information
            </Typography>
            <Stack spacing={2.5}>
              <FormControl fullWidth error={!!errors.serviceType}>
                <InputLabel>Service Type *</InputLabel>
                <Select 
                  value={formData.serviceType} 
                  onChange={(e) => handleInputChange("serviceType", e.target.value)} 
                  label="Service Type *"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      }
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>Select a service</em>
                  </MenuItem>
                  {serviceTypes.map((service) => (
                    <MenuItem key={service.id} value={service.id}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                        <span>{service.name}</span>
                        <Chip label={`$${service.price}`} size="small" color="primary" sx={{ ml: 2 }} />
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

              <TextField
                fullWidth
                label="Additional Notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                multiline
                rows={3}
                placeholder="Any special requests or additional information..."
                InputProps={{
                  sx: { fontSize: '16px' }
                }}
                InputLabelProps={{
                  sx: { fontSize: '16px' }
                }}
              />

              {selectedService && (
                <Card sx={{ bgcolor: "primary.light", borderLeft: 4, borderColor: "primary.main" }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                      Service Details
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Service:</strong> {selectedService.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Duration:</strong> {selectedService.duration} minutes
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

        {formData.serviceType && (
          <Alert severity="info" icon={<Build />} sx={{ mt: 3, borderRadius: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              Booking Summary
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              <Typography component="li" variant="body2">
                <strong>Date:</strong> {formatDate(selectedDate)}
              </Typography>
              <Typography component="li" variant="body2">
                <strong>Time:</strong> {selectedTimeSlot?.time || "Not specified"}
              </Typography>
              <Typography component="li" variant="body2">
                <strong>Service:</strong> {selectedService?.name}
              </Typography>
              <Typography component="li" variant="body2">
                <strong>Duration:</strong> {selectedService?.duration} minutes
              </Typography>
              <Typography component="li" variant="body2">
                <strong>Price:</strong> ${selectedService?.price}
              </Typography>
            </Box>
          </Alert>
        )}

        <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: "flex-end" }}>
          <Button onClick={handleClose} variant="outlined" size="large" sx={{ minWidth: 120 }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            size="large"
            disabled={!formData.serviceType || !formData.vehicleId}
            sx={{ minWidth: 160 }}
          >
            Book Appointment
          </Button>
        </Stack>

        {/* Scroll Indicator */}
        <Fade in={showScrollIndicator}>
          <Box
            sx={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              backgroundColor: 'primary.main',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 3,
              animation: 'bounce 2s infinite',
              '@keyframes bounce': {
                '0%, 20%, 50%, 80%, 100%': {
                  transform: 'translateY(0)',
                },
                '40%': {
                  transform: 'translateY(-10px)',
                },
                '60%': {
                  transform: 'translateY(-5px)',
                },
              },
            }}
          >
            <KeyboardArrowDown sx={{ color: 'white' }} />
          </Box>
        </Fade>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={hideSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={hideSnackbar} 
            severity={snackbar.severity} 
            sx={{ 
              width: '100%',
              '& .MuiAlert-icon': {
                fontSize: '1.2rem'
              }
            }}
            iconMapping={{
              success: <CheckCircle fontSize="inherit" />,
              error: <Error fontSize="inherit" />,
              warning: <Warning fontSize="inherit" />,
              info: <Info fontSize="inherit" />
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Modal>
  );
};

export default CustomerBookingModal;

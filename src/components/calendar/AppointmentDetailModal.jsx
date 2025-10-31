import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Paper,
  Box,
  Typography,
  Stack,
  Divider,
  IconButton,
  Chip,
  Grid,
  Card,
  CardContent,
  Button,
  Fade,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Close,
  CalendarToday,
  AccessTime,
  DirectionsCar,
  Build,
  LocationOn,
  Phone,
  Person,
  AttachMoney,
  Notes,
  CheckCircle,
  HourglassEmpty,
  Cancel,
  KeyboardArrowDown,
  Delete,
  Error,
  Warning,
  Info,
} from "@mui/icons-material";

const AppointmentDetailModal = ({ open, onClose, appointment, onDelete }) => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const paperRef = useRef(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info" // success, error, warning, info
  });

  // Reset snackbar when modal opens
  useEffect(() => {
    if (open) {
      setSnackbar({ open: false, message: "", severity: "info" });
    }
  }, [open]);

  useEffect(() => {
    const checkScroll = () => {
      if (paperRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = paperRef.current;
        // Show indicator if there's more content below
        setShowScrollIndicator(scrollHeight > clientHeight && scrollTop < scrollHeight - clientHeight - 10);
      }
    };

    // Check on mount and when content changes
    checkScroll();
    
    const timer = setTimeout(checkScroll, 100); // Delay to ensure content is rendered

    return () => clearTimeout(timer);
  }, [open, appointment]);

  // Snackbar helper functions
  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const hideSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleScroll = () => {
    if (paperRef.current) {
      const { scrollTop } = paperRef.current;
      // Hide indicator as soon as user starts scrolling
      if (scrollTop > 0) {
        setShowScrollIndicator(false);
      }
    }
  };

  const handleDelete = async () => {
    if (!appointment?.id) return;
    
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      setDeleteConfirmOpen(false);
      showSnackbar("Deleting appointment...", "info");
      
      console.log("Deleting appointment ID:", appointment.id);
      await onDelete(appointment.id);
      
      showSnackbar("Appointment deleted successfully", "success");
      onClose();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      const errorMessage = error.message || "Failed to delete appointment. Please try again.";
      showSnackbar(`Delete failed: ${errorMessage}`, "error");
    } finally {
      setDeleting(false);
    }
  };

  if (!appointment) return null;

  const paperStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "min(95vw, 600px)",
    maxHeight: "90vh",
    overflowY: "auto",
    p: 4,
    borderRadius: 3,
    boxShadow: 24,
    bgcolor: "background.paper",
    // Hide scrollbar
    '&::-webkit-scrollbar': {
      display: 'none'
    },
    msOverflowStyle: 'none',  // IE and Edge
    scrollbarWidth: 'none',  // Firefox
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusConfig = (status) => {
    const statusUpper = status?.toUpperCase() || "PENDING";
    switch (statusUpper) {
      case "APPROVED":
        return {
          color: "success",
          icon: <CheckCircle />,
          label: "Approved",
        };
      case "COMPLETED":
        return {
          color: "info",
          icon: <CheckCircle />,
          label: "Completed",
        };
      case "CANCELLED":
        return {
          color: "error",
          icon: <Cancel />,
          label: "Cancelled",
        };
      case "PENDING":
      default:
        return {
          color: "warning",
          icon: <HourglassEmpty />,
          label: "Pending",
        };
    }
  };

  const statusConfig = getStatusConfig(appointment.status);

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropProps={{
        sx: {
          backdropFilter: "blur(6px)",
          backgroundColor: "rgba(0,0,0,0.36)",
        },
      }}
    >
      <Paper 
        ref={paperRef}
        sx={paperStyle}
        onScroll={handleScroll}
      >
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h5" fontWeight={600}>
              Appointment Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Booking ID: #{appointment.id}
            </Typography>
          </Box>
          <IconButton onClick={onClose} color="inherit">
            <Close />
          </IconButton>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* Status Badge */}
        <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
          <Chip
            icon={statusConfig.icon}
            label={statusConfig.label}
            color={statusConfig.color}
            size="large"
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              px: 2,
              py: 3,
            }}
          />
        </Box>

        {/* Appointment Information */}
        <Stack spacing={3}>
          {/* Date & Time Section */}
          <Card variant="outlined">
            <CardContent>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 600, mb: 2 }}
              >
                Schedule
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <CalendarToday color="primary" fontSize="small" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Date
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {formatDate(appointment.date)}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <AccessTime color="primary" fontSize="small" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Time
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {appointment.time || "N/A"}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card variant="outlined">
            <CardContent>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 600, mb: 2 }}
              >
                Customer Information
              </Typography>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Person color="primary" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {appointment.customer || "N/A"}
                    </Typography>
                  </Box>
                </Stack>
                {appointment.customerPhone && (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Phone color="primary" fontSize="small" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {appointment.customerPhone}
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* Service & Vehicle Information */}
          <Card variant="outlined">
            <CardContent>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 600, mb: 2 }}
              >
                Service Details
              </Typography>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Build color="primary" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Service Type
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {appointment.service || "N/A"}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <DirectionsCar color="primary" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Vehicle
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {appointment.vehicle || "N/A"}
                    </Typography>
                  </Box>
                </Stack>
                {appointment.totalPrice && (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <AttachMoney color="primary" fontSize="small" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Total Price
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        ${Number(appointment.totalPrice).toFixed(2)}
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* Branch Information */}
          {appointment.branchName && (
            <Card variant="outlined">
              <CardContent>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ fontWeight: 600, mb: 2 }}
                >
                  Location
                </Typography>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <LocationOn color="primary" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Branch
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {appointment.branchName}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {appointment.notes && (
            <Card variant="outlined">
              <CardContent>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ fontWeight: 600, mb: 2 }}
                >
                  Additional Notes
                </Typography>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Notes color="primary" fontSize="small" sx={{ mt: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {appointment.notes}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Stack>

        {/* Actions */}
        <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: "space-between" }}>
          {appointment.status?.toUpperCase() === "PENDING" && (
            <Button 
              onClick={handleDelete} 
              variant="outlined" 
              color="error" 
              size="large" 
              disabled={deleting}
              startIcon={<Delete />}
              sx={{ minWidth: 140 }}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          )}
          <Box sx={{ flex: 1 }} />
          <Button onClick={onClose} variant="contained" size="large" sx={{ minWidth: 120 }}>
            Close
          </Button>
        </Stack>

        {/* Scroll Indicator */}
        <Fade in={showScrollIndicator}>
          <Box
            sx={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              zIndex: 1,
              pointerEvents: 'none',
            }}
          >
            <Box
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
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
              <KeyboardArrowDown />
            </Box>
          </Box>
        </Fade>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">
            Confirm Delete
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete this appointment? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2000}
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

export default AppointmentDetailModal;

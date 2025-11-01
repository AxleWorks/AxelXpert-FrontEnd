import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Box,
  CircularProgress,
  Button,
  Alert,
  Grid,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { SERVICES_URL } from "../../config/apiEndpoints.jsx";
import { authenticatedAxios } from "../../utils/axiosConfig.js";
import ManagerLayout from "../../layouts/manager/ManagerLayout";
import ManageSubTasksModal from "../../components/services/ManageSubTasksModal";
import ServiceFormDialog from "../../components/services/ServiceFormDialog";
import DeleteServiceDialog from "../../components/services/DeleteServiceDialog";
import ServiceCard from "../../components/services/ServiceCard";

const ManagerServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [search, setSearch] = useState("");

  // Service form dialog state
  const [serviceFormOpen, setServiceFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [editingService, setEditingService] = useState(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingService, setDeletingService] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // SubTasks modal state
  const [subTasksModalOpen, setSubTasksModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await authenticatedAxios.get(SERVICES_URL);
      // Ensure we have an array of services
      const servicesData = Array.isArray(response.data) ? response.data : [];
      setServices(servicesData);
      setError(null);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to fetch services"
      );
      setServices([]); // Set empty array to prevent filter error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddNew = () => {
    setEditingService({
      name: "",
      price: "",
      durationMinutes: "",
      description: "",
    });
    setFormMode("add");
    setServiceFormOpen(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormMode("edit");
    setServiceFormOpen(true);
  };

  const handleSaveService = async (formData) => {
    setError(null);
    setSuccess(null);
    try {
      const serviceData = {
        name: formData.name,
        price: parseFloat(formData.price),
        durationMinutes: parseInt(formData.durationMinutes, 10),
        description: formData.description,
      };

      if (formMode === "add") {
        await authenticatedAxios.post(SERVICES_URL, serviceData);
        setSuccess("Service added successfully!");
      } else {
        await authenticatedAxios.put(
          `${SERVICES_URL}/${editingService.id}`,
          serviceData
        );
        setSuccess("Service updated successfully!");
      }

      await fetchServices();
      setServiceFormOpen(false);
      setEditingService(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error saving service:", err);

      // Handle specific error cases
      let errorMessage = "Failed to save service";

      if (err.response?.status === 403) {
        errorMessage =
          "Access denied: You don't have permission to perform this action. Please check your user role or contact your administrator.";
      } else if (err.response?.status === 401) {
        errorMessage =
          "Authentication failed: Your session has expired. Please log in again.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);

      // Clear error message after 8 seconds for longer messages
      setTimeout(() => setError(null), 8000);

      throw err;
    }
  };

  const handleDeleteClick = (service) => {
    setDeletingService(service);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    setError(null);
    setSuccess(null);
    try {
      await authenticatedAxios.delete(`${SERVICES_URL}/${deletingService.id}`);
      await fetchServices();
      setDeleteDialogOpen(false);
      setDeletingService(null);
      setSuccess("Service deleted successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting service:", err);

      // Handle specific error cases
      let errorMessage = "Failed to delete service";

      if (err.response?.status === 403) {
        errorMessage =
          "Access denied: You don't have permission to delete services. Please check your user role or contact your administrator.";
      } else if (err.response?.status === 401) {
        errorMessage =
          "Authentication failed: Your session has expired. Please log in again.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);

      // Clear error message after 8 seconds
      setTimeout(() => setError(null), 8000);
    } finally {
      setDeleting(false);
    }
  };

  const handleManageSubTasks = (service) => {
    setSelectedService(service);
    setSubTasksModalOpen(true);
  };

  const handleCloseSubTasksModal = () => {
    setSubTasksModalOpen(false);
    setSelectedService(null);
  };

  // Filter services by search - ensure services is always an array
  const filteredServices = Array.isArray(services)
    ? services.filter(
        (service) =>
          service.name?.toLowerCase().includes(search.toLowerCase()) ||
          (service.description &&
            service.description.toLowerCase().includes(search.toLowerCase()))
      )
    : [];

  return (
    <ManagerLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Service Management
        </Typography>

        {/* Success Message */}
        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setSuccess(null)}
          >
            {success}
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Search Section */}
        <Box display="flex" gap={2} mb={3} alignItems="center">
          <Paper sx={{ flex: 1, p: 1.5, borderRadius: 2, boxShadow: 0 }}>
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                fontSize: 16,
                outline: "none",
              }}
            />
          </Paper>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddNew}
            disableElevation
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1.5,
              whiteSpace: "nowrap",
            }}
          >
            Add Service
          </Button>
        </Box>

        {/* Services Grid */}
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={400}
          >
            <CircularProgress size={48} />
          </Box>
        ) : filteredServices.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: "center",
              borderRadius: 3,
              border: 2,
              borderStyle: "dashed",
              borderColor: "grey.300",
            }}
          >
            <Typography
              variant="h6"
              color="text.secondary"
              fontWeight={600}
              gutterBottom
            >
              {search ? "No services found" : "No services yet"}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {search
                ? "Try adjusting your search terms"
                : "Get started by adding your first service"}
            </Typography>
            {!search && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddNew}
                sx={{ textTransform: "none" }}
              >
                Add Your First Service
              </Button>
            )}
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredServices.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <ServiceCard
                  service={service}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  onManageSubTasks={handleManageSubTasks}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Service Form Dialog (Add/Edit) */}
        <ServiceFormDialog
          open={serviceFormOpen}
          onClose={() => {
            setServiceFormOpen(false);
            setEditingService(null);
          }}
          onSave={handleSaveService}
          initialData={editingService}
          mode={formMode}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteServiceDialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setDeletingService(null);
          }}
          onConfirm={handleConfirmDelete}
          serviceName={deletingService?.name}
          loading={deleting}
        />

        {/* SubTasks Management Modal */}
        <ManageSubTasksModal
          open={subTasksModalOpen}
          onClose={handleCloseSubTasksModal}
          service={selectedService}
        />
      </Box>
    </ManagerLayout>
  );
};

export default ManagerServicesPage;

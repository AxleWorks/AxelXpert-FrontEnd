import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
} from "@mui/material";
import { Edit, Delete, Add, ListAlt } from "@mui/icons-material";
import { SERVICES_URL } from "../../config/apiEndpoints.jsx";
import { authenticatedAxios } from "../../utils/axiosConfig.js";
import ManagerLayout from "../../layouts/manager/ManagerLayout";
import ManageSubTasksModal from "../../components/services/ManageSubTasksModal";

const emptyService = {
  name: "",
  price: "",
  durationMinutes: "",
  description: "",
};

const ManagerServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentService, setCurrentService] = useState(emptyService);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
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

  const handleDialogOpen = (service = emptyService) => {
    setCurrentService(service);
    setEditMode(!!service.id);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrentService(emptyService);
    setEditMode(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentService((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const serviceData = {
        name: currentService.name,
        price: parseFloat(currentService.price),
        durationMinutes: parseInt(currentService.durationMinutes, 10),
        description: currentService.description,
      };

      if (editMode) {
        await authenticatedAxios.put(
          `${SERVICES_URL}/${currentService.id}`,
          serviceData
        );
      } else {
        await authenticatedAxios.post(SERVICES_URL, serviceData);
      }

      await fetchServices();
      handleDialogClose();
      setError(null);
    } catch (err) {
      console.error("Error saving service:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to save service"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;

    try {
      await authenticatedAxios.delete(`${SERVICES_URL}/${id}`);
      await fetchServices();
      setError(null);
    } catch (err) {
      console.error("Error deleting service:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to delete service"
      );
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
        {/* Search Section */}
        <Paper sx={{ mb: 2, p: 1.5, borderRadius: 2, boxShadow: 0 }}>
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
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleDialogOpen()}
            >
              Add Service
            </Button>
          </Box>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={120}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Duration (min)</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="center">SubTasks</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>${service.price.toFixed(2)}</TableCell>
                      <TableCell>{service.durationMinutes}</TableCell>
                      <TableCell>{service.description || "-"}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ListAlt />}
                          onClick={() => handleManageSubTasks(service)}
                        >
                          Manage
                        </Button>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handleDialogOpen(service)}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(service.id)}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>{editMode ? "Edit Service" : "Add Service"}</DialogTitle>
          <DialogContent>
            <TextField
              margin="normal"
              label="Name"
              name="name"
              value={currentService.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              margin="normal"
              label="Price"
              name="price"
              type="number"
              value={currentService.price}
              onChange={handleInputChange}
              fullWidth
              required
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              margin="normal"
              label="Duration (minutes)"
              name="durationMinutes"
              type="number"
              value={currentService.durationMinutes}
              onChange={handleInputChange}
              fullWidth
              required
              inputProps={{ min: 1, step: 1 }}
            />
            <TextField
              margin="normal"
              label="Description"
              name="description"
              value={currentService.description || ""}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={2}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} variant="contained" disabled={saving}>
              {saving ? "Saving..." : editMode ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>

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

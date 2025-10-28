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
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import ManagerLayout from "../../layouts/manager/ManagerLayout";

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

  const fetchServices = () => {
    setLoading(true);
    fetch("http://localhost:8080/api/services")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch services");
        return res.json();
      })
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
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

  const handleSave = () => {
    setSaving(true);
    const method = editMode ? "PUT" : "POST";
    const url = editMode
      ? `http://localhost:8080/api/services/${currentService.id}`
      : "http://localhost:8080/api/services";
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: currentService.name,
        price: parseFloat(currentService.price),
        durationMinutes: parseInt(currentService.durationMinutes, 10),
        description: currentService.description,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save service");
        return res.json();
      })
      .then(() => {
        fetchServices();
        handleDialogClose();
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setSaving(false));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;
    fetch(`http://localhost:8080/api/services/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete service");
        fetchServices();
      })
      .catch((err) => setError(err.message));
  };

  return (
    <ManagerLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Service Management
        </Typography>
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
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>${service.price.toFixed(2)}</TableCell>
                      <TableCell>{service.durationMinutes}</TableCell>
                      <TableCell>{service.description || "-"}</TableCell>
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
      </Box>
    </ManagerLayout>
  );
};

export default ManagerServicesPage;

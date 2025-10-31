import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  IconButton,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Paper,
  Divider,
  Alert,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  DragIndicator,
} from "@mui/icons-material";
import { authenticatedAxios } from "../../utils/axiosConfig.js";
import { SERVICES_URL } from "../../config/apiEndpoints.jsx";

const emptySubTask = {
  title: "",
  description: "",
  orderIndex: 1,
  isMandatory: true,
};

const ManageSubTasksModal = ({ open, onClose, service }) => {
  const [subTasks, setSubTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newSubTask, setNewSubTask] = useState(null);
  const [formData, setFormData] = useState(emptySubTask);

  useEffect(() => {
    if (open && service?.id) {
      fetchSubTasks();
    }
  }, [open, service]);

  const fetchSubTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authenticatedAxios.get(
        `${SERVICES_URL}/${service.id}/subtasks`
      );
      const sortedSubTasks = Array.isArray(response.data)
        ? response.data.sort((a, b) => a.orderIndex - b.orderIndex)
        : [];
      setSubTasks(sortedSubTasks);
    } catch (err) {
      console.error("Error fetching subtasks:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to fetch subtasks"
      );
      setSubTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    const maxOrder =
      subTasks.length > 0
        ? Math.max(...subTasks.map((st) => st.orderIndex))
        : 0;
    setFormData({
      ...emptySubTask,
      orderIndex: maxOrder + 1,
    });
    setNewSubTask(true);
  };

  const handleEdit = (subTask) => {
    setFormData(subTask);
    setEditingId(subTask.id);
    setNewSubTask(false);
  };

  const handleCancelEdit = () => {
    setFormData(emptySubTask);
    setEditingId(null);
    setNewSubTask(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        orderIndex: parseInt(formData.orderIndex, 10),
        isMandatory: formData.isMandatory,
      };

      if (newSubTask) {
        // Add new subtask
        await authenticatedAxios.post(
          `${SERVICES_URL}/${service.id}/subtasks`,
          payload
        );
      } else {
        // Update existing subtask
        await authenticatedAxios.patch(
          `${SERVICES_URL}/subtasks/${editingId}`,
          payload
        );
      }

      await fetchSubTasks();
      handleCancelEdit();
    } catch (err) {
      console.error("Error saving subtask:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to save subtask"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (subTaskId) => {
    if (!window.confirm("Are you sure you want to delete this subtask?"))
      return;

    try {
      await authenticatedAxios.delete(`${SERVICES_URL}/subtasks/${subTaskId}`);
      await fetchSubTasks();
      setError(null);
    } catch (err) {
      console.error("Error deleting subtask:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to delete subtask"
      );
    }
  };

  const handleClose = () => {
    handleCancelEdit();
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Manage SubTasks
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {service?.name} - Define the steps for this service
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={200}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ mt: 1 }}>
            {error && (
              <Alert
                severity="error"
                sx={{ mb: 2 }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            {/* Add New Button */}
            {!newSubTask && !editingId && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddNew}
                sx={{ mb: 2 }}
              >
                Add New Subtask
              </Button>
            )}

            {/* Add/Edit Form */}
            {(newSubTask || editingId) && (
              <Paper sx={{ p: 2, mb: 2, bgcolor: "grey.50" }}>
                <Typography variant="subtitle2" fontWeight={600} mb={2}>
                  {newSubTask ? "New SubTask" : "Edit SubTask"}
                </Typography>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 2 }}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                  sx={{ mb: 2 }}
                  size="small"
                />
                <Box display="flex" gap={2} mb={2}>
                  <TextField
                    label="Order"
                    name="orderIndex"
                    type="number"
                    value={formData.orderIndex}
                    onChange={handleInputChange}
                    inputProps={{ min: 1 }}
                    size="small"
                    sx={{ width: 120 }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.isMandatory}
                        onChange={handleInputChange}
                        name="isMandatory"
                      />
                    }
                    label="Mandatory"
                  />
                </Box>
                <Box display="flex" gap={1}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={saving}
                    size="small"
                  >
                    {saving ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancelEdit}
                    disabled={saving}
                    size="small"
                  >
                    Cancel
                  </Button>
                </Box>
              </Paper>
            )}

            {/* SubTasks List */}
            <Box>
              {subTasks.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: "center", bgcolor: "grey.50" }}>
                  <Typography color="text.secondary">
                    No subtasks defined yet. Click "Add New Subtask" to get
                    started.
                  </Typography>
                </Paper>
              ) : (
                <Box>
                  {subTasks.map((subTask, index) => (
                    <Paper
                      key={subTask.id}
                      sx={{
                        p: 2,
                        mb: 1.5,
                        border: "1px solid",
                        borderColor: "divider",
                        "&:hover": {
                          bgcolor: "grey.50",
                        },
                      }}
                    >
                      <Box display="flex" alignItems="flex-start" gap={1}>
                        <DragIndicator sx={{ color: "grey.400", mt: 0.5 }} />
                        <Box sx={{ flex: 1 }}>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={0.5}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                bgcolor: "primary.main",
                                color: "white",
                                px: 1,
                                py: 0.25,
                                borderRadius: 1,
                                fontSize: "0.75rem",
                                fontWeight: 600,
                              }}
                            >
                              #{subTask.orderIndex}
                            </Typography>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {subTask.title}
                            </Typography>
                            {subTask.isMandatory && (
                              <Typography
                                variant="caption"
                                sx={{
                                  bgcolor: "error.light",
                                  color: "error.dark",
                                  px: 1,
                                  py: 0.25,
                                  borderRadius: 1,
                                  fontSize: "0.65rem",
                                  fontWeight: 600,
                                }}
                              >
                                MANDATORY
                              </Typography>
                            )}
                          </Box>
                          {subTask.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ ml: 4 }}
                            >
                              {subTask.description}
                            </Typography>
                          )}
                        </Box>
                        <Box>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(subTask)}
                            disabled={newSubTask || editingId !== null}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(subTask.id)}
                            disabled={newSubTask || editingId !== null}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageSubTasksModal;

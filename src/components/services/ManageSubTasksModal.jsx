import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Paper,
  Alert,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import { Add, Close, CheckCircle, InfoOutlined } from "@mui/icons-material";
import { authenticatedAxios } from "../../utils/axiosConfig.js";
import { SERVICES_URL } from "../../config/apiEndpoints.jsx";
import SubTaskFormDialog from "./SubTaskFormDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import SubTaskCard from "./SubTaskCard";

const ManageSubTasksModal = ({ open, onClose, service }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [subTasks, setSubTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form dialog state
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [editingSubTask, setEditingSubTask] = useState(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingSubTask, setDeletingSubTask] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
    setEditingSubTask({
      title: "",
      description: "",
      orderIndex: maxOrder + 1,
      isMandatory: true,
    });
    setFormMode("add");
    setFormDialogOpen(true);
  };

  const handleEdit = (subTask) => {
    setEditingSubTask(subTask);
    setFormMode("edit");
    setFormDialogOpen(true);
  };

  const handleSaveSubTask = async (formData) => {
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        orderIndex: parseInt(formData.orderIndex, 10),
        isMandatory: formData.isMandatory,
      };

      if (formMode === "add") {
        await authenticatedAxios.post(
          `${SERVICES_URL}/${service.id}/subtasks`,
          payload
        );
        setSuccess("SubTask added successfully!");
      } else {
        await authenticatedAxios.patch(
          `${SERVICES_URL}/subtasks/${editingSubTask.id}`,
          payload
        );
        setSuccess("SubTask updated successfully!");
      }

      await fetchSubTasks();
      setFormDialogOpen(false);
      setEditingSubTask(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error saving subtask:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to save subtask"
      );
      throw err;
    }
  };

  const handleDeleteClick = (subTask) => {
    setDeletingSubTask(subTask);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    setError(null);
    setSuccess(null);
    try {
      await authenticatedAxios.delete(
        `${SERVICES_URL}/subtasks/${deletingSubTask.id}`
      );
      await fetchSubTasks();
      setDeleteDialogOpen(false);
      setDeletingSubTask(null);
      setSuccess("SubTask deleted successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting subtask:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to delete subtask"
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(null);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: isDark ? "grey.900" : "background.paper",
            backgroundImage: "none",
            maxHeight: "90vh",
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: "blur(8px)",
              backgroundColor: isDark
                ? "rgba(0, 0, 0, 0.7)"
                : "rgba(0, 0, 0, 0.5)",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            background: isDark
              ? `linear-gradient(135deg, ${alpha(
                  theme.palette.primary.dark,
                  0.2
                )} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`
              : `linear-gradient(135deg, ${alpha(
                  theme.palette.primary.light,
                  0.15
                )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
            borderBottom: 1,
            borderColor: "divider",
            pb: 2,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box flex={1}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Manage SubTasks
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography
                  variant="body1"
                  fontWeight={600}
                  sx={{ color: isDark ? "primary.light" : "primary.main" }}
                >
                  {service?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Define the steps for this service
                </Typography>
              </Box>
            </Box>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, pb: 2 }}>
          {loading ? (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              minHeight={300}
              gap={2}
            >
              <CircularProgress size={48} />
              <Typography variant="body2" color="text.secondary">
                Loading subtasks...
              </Typography>
            </Box>
          ) : (
            <Box>
              {/* Success Message */}
              {success && (
                <Alert
                  severity="success"
                  icon={<CheckCircle />}
                  sx={{ mb: 2.5 }}
                  onClose={() => setSuccess(null)}
                >
                  {success}
                </Alert>
              )}

              {/* Error Message */}
              {error && (
                <Alert
                  severity="error"
                  sx={{ mb: 2.5 }}
                  onClose={() => setError(null)}
                >
                  {error}
                </Alert>
              )}

              {/* Header with Add Button */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2.5}
              >
                <Typography variant="body2" color="text.secondary">
                  {subTasks.length === 0
                    ? "No subtasks yet"
                    : `${subTasks.length} subtask${
                        subTasks.length !== 1 ? "s" : ""
                      } defined`}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddNew}
                  disableElevation
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Add SubTask
                </Button>
              </Box>

              {/* SubTasks List */}
              {subTasks.length === 0 ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 6,
                    textAlign: "center",
                    bgcolor: isDark ? "grey.900" : "grey.50",
                    border: 2,
                    borderStyle: "dashed",
                    borderColor: isDark ? "grey.800" : "grey.300",
                    borderRadius: 3,
                  }}
                >
                  <InfoOutlined
                    sx={{
                      fontSize: 56,
                      color: isDark ? "grey.700" : "grey.400",
                      mb: 2,
                    }}
                  />
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    fontWeight={600}
                    gutterBottom
                  >
                    No subtasks defined yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Break down this service into actionable steps that employees
                    can follow
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddNew}
                    sx={{ textTransform: "none" }}
                  >
                    Create Your First SubTask
                  </Button>
                </Paper>
              ) : (
                <Box>
                  {subTasks.map((subTask) => (
                    <SubTaskCard
                      key={subTask.id}
                      subTask={subTask}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                      disabled={formDialogOpen || deleteDialogOpen}
                    />
                  ))}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>

        <Divider />

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            bgcolor: isDark
              ? alpha(theme.palette.background.paper, 0.5)
              : "grey.50",
          }}
        >
          <Button
            onClick={handleClose}
            variant="contained"
            disableElevation
            sx={{
              bgcolor: isDark ? "grey.800" : "grey.200",
              color: isDark ? "grey.100" : "grey.900",
              "&:hover": {
                bgcolor: isDark ? "grey.700" : "grey.300",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Form Dialog (Add/Edit) */}
      <SubTaskFormDialog
        open={formDialogOpen}
        onClose={() => {
          setFormDialogOpen(false);
          setEditingSubTask(null);
        }}
        onSave={handleSaveSubTask}
        initialData={editingSubTask}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeletingSubTask(null);
        }}
        onConfirm={handleConfirmDelete}
        subTaskTitle={deletingSubTask?.title}
        loading={deleting}
      />
    </>
  );
};

export default ManageSubTasksModal;

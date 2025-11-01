import React, { useEffect, useCallback, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import ManagerLayout from "../../layouts/manager/ManagerLayout";
import { Button } from "../../components/ui/button";
import EmployeeProfileModal from "../../components/userManagement/EmployeeProfileModal";
import EditEmployeeModal from "../../components/userManagement/EditEmployeeModal";
import AddEmployeeModal from "../../components/userManagement/AddEmployeeModal";
import UserManagementStats from "../../components/userManagement/UserManagementStats";
import EmployeesTable from "../../components/userManagement/EmployeesTable";
import DeleteConfirmDialog from "../../components/userManagement/DeleteConfirmDialog";
import BlockConfirmDialog from "../../components/userManagement/BlockConfirmDialog";
import NotificationSnackbar from "../../components/userManagement/NotificationSnackbar";
import { authenticatedAxios } from "../../utils/axiosConfig.js";
import { USERS_URL } from "../../config/apiEndpoints.jsx";
import { useAuth } from "../../contexts/AuthContext";

const StatCard = ({
  title,
  value,
  Icon,
  iconBg = "#f3f8ff",
  iconColor = "#0b75d9",
}) => (
  <Card
    sx={{
      borderRadius: 3,
      display: "flex",
      flexDirection: "column",
      flex: 1,
      minHeight: 140,
      width: "100%",
    }}
  >
    <CardContent
      sx={{
        p: 3,
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          width: "100%",
        }}
      >
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={800} sx={{ lineHeight: 1 }}>
            {value}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 12,
            backgroundColor: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
          }}
        >
          {Icon ? <Icon size={20} color={iconColor} /> : null}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Avatar = ({ name, profileImageUrl }) => {
  const defaultImageUrl =
    "https://cdn-icons-png.flaticon.com/512/9684/9684441.png";

  return (
    <MuiAvatar
      src={profileImageUrl || defaultImageUrl}
      sx={{ bgcolor: "grey.100", color: "text.primary" }}
    >
      {!profileImageUrl && name
        ? name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
        : null}
    </MuiAvatar>
  );
};

const ManagerUserManagementPage = () => {
  const { user } = useAuth(); // Get current manager's info
  const [employees, setEmployees] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const [orderBy, setOrderBy] = React.useState("name");
  const [order, setOrder] = React.useState("asc");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [successTitle, setSuccessTitle] = React.useState("");
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [employeeToDelete, setEmployeeToDelete] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [errorTitle, setErrorTitle] = React.useState("Operation Failed");
  const [showError, setShowError] = React.useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = React.useState(false);
  const [employeeToBlock, setEmployeeToBlock] = React.useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      // Only fetch if we have the manager's branch ID
      if (!user?.branchId) {
        setError("Unable to determine branch. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        // Use the new endpoint to get only active users from the manager's branch
        const response = await axios.get(
          `${USERS_URL}/branch/${user.branchId}/active-users`
        );
        setEmployees(response.data);
      } catch (err) {
        console.error("Failed to fetch employees:", err);
        setError("Failed to load employees. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [user?.branchId]);

  const handleOpenAdd = useCallback(() => {
    console.log("Add Employee button clicked - opening modal");
    setAddOpen(true);
  }, []);

  const openView = useCallback((employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((employee) => {
    setSelectedEmployee(employee);
    setEditModalOpen(true);
  }, []);

  const openDeleteDialog = useCallback((employee) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (employeeToDelete) {
      try {
        await authenticatedAxios.delete(`${USERS_URL}/${employeeToDelete.id}`);

        setEmployees((prev) =>
          prev.filter((e) => e.id !== employeeToDelete.id)
        );
        setSuccessTitle("Employee deleted!");
        setSuccessMessage(
          `${employeeToDelete.username} has been deleted successfully.`
        );
        setShowSuccess(true);
        console.log("Employee deleted successfully");

        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);
      } catch (error) {
        console.error("Failed to delete employee:", error);

        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);

        if (error.response) {
          if (error.response.status === 409) {
            setErrorTitle("Delete Failed");
            setErrorMessage(
              error.response.data ||
                "Cannot delete user: User has active bookings or tasks"
            );
          } else if (error.response.status === 404) {
            setErrorTitle("Delete Failed");
            setErrorMessage(
              "User not found. They may have been already deleted."
            );
          } else {
            setErrorTitle("Delete Failed");
            setErrorMessage("Failed to delete employee. Please try again.");
          }
        } else {
          setErrorTitle("Delete Failed");
          setErrorMessage(
            "Network error. Please check your connection and try again."
          );
        }

        setShowError(true);
      }
    }
  }, [employeeToDelete]);

  const cancelDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  }, []);

  const openBlockDialog = useCallback((employee) => {
    setEmployeeToBlock(employee);
    setBlockDialogOpen(true);
  }, []);

  const confirmBlock = useCallback(async () => {
    if (employeeToBlock) {
      const isCurrentlyBlocked = employeeToBlock.isBlocked;
      const newBlockedStatus = !isCurrentlyBlocked;

      try {
        const response = await authenticatedAxios.put(
          `${USERS_URL}/${employeeToBlock.id}/block`,
          { blocked: newBlockedStatus }
        );

        setEmployees((prev) =>
          prev.map((e) => (e.id === response.data.id ? response.data : e))
        );

        setSuccessTitle(newBlockedStatus ? "User blocked!" : "User unblocked!");
        setSuccessMessage(
          newBlockedStatus
            ? `${employeeToBlock.username} has been blocked successfully.`
            : `${employeeToBlock.username} has been unblocked successfully.`
        );
        setShowSuccess(true);
        console.log(
          `User ${newBlockedStatus ? "blocked" : "unblocked"} successfully`
        );

        setBlockDialogOpen(false);
        setEmployeeToBlock(null);
      } catch (error) {
        console.error("Failed to update block status:", error);

        setBlockDialogOpen(false);
        setEmployeeToBlock(null);

        if (error.response) {
          if (error.response.status === 409) {
            setErrorTitle(newBlockedStatus ? "Block Failed" : "Unblock Failed");
            setErrorMessage(
              error.response.data ||
                "Cannot block user: User has active bookings or tasks"
            );
          } else if (error.response.status === 404) {
            setErrorTitle(newBlockedStatus ? "Block Failed" : "Unblock Failed");
            setErrorMessage("User not found.");
          } else if (error.response.status === 400) {
            setErrorTitle(newBlockedStatus ? "Block Failed" : "Unblock Failed");
            setErrorMessage("Invalid request. Please try again.");
          } else {
            setErrorTitle(newBlockedStatus ? "Block Failed" : "Unblock Failed");
            setErrorMessage("Failed to update user status. Please try again.");
          }
        } else {
          setErrorTitle(newBlockedStatus ? "Block Failed" : "Unblock Failed");
          setErrorMessage(
            "Network error. Please check your connection and try again."
          );
        }

        setShowError(true);
      }
    }
  }, [employeeToBlock]);

  const cancelBlock = useCallback(() => {
    setBlockDialogOpen(false);
    setEmployeeToBlock(null);
  }, []);

  const handleSaveEdit = useCallback((updated) => {
    authenticatedAxios
      .put(`${USERS_URL}/${updated.id}`, {
        username: updated.username,
        role: updated.role,
        branchId: updated.branchId,
        phoneNumber: updated.phoneNumber,
        address: updated.address,
        isActive: updated.isActive,
      })
      .then((response) => {
        setEmployees((prev) =>
          prev.map((e) => (e.id === response.data.id ? response.data : e))
        );
        setSuccessTitle("Profile updated!");
        setSuccessMessage("Your profile has been updated successfully.");
        setShowSuccess(true);
        console.log("User updated successfully");
      })
      .catch((error) => {
        console.error("Failed to update user:", error);
        setError("Failed to update user. Please try again.");
      });
    setEditModalOpen(false);
    setSelectedEmployee(null);
  }, []);

  const sortedEmployees = React.useMemo(() => {
    return [...filteredEmployees].sort(getComparator(order, orderBy));
  }, [filteredEmployees, order, orderBy, getComparator]);

  // Calculate stats from actual data
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(
    (emp) => emp.isActive && !emp.isBlocked
  ).length;
  const inactiveEmployees = employees.filter(
    (emp) => !emp.isActive || emp.isBlocked
  ).length;

  if (loading) {
    return (
      <ManagerLayout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress />
        </Box>
      </ManagerLayout>
    );
  }

  if (error) {
    return (
      <ManagerLayout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Box>
      </ManagerLayout>
    );
  }

  // edits are handled by EmployeeProfileModal's onSave handler

  return (
    <ManagerLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          User Management
        </Typography>

        {/* Loading State */}
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={400}
          >
            <CircularProgress size={48} />
          </Box>
        ) : error ? (
          /* Error State */
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          /* Main Content */
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography color="text.secondary">
                Manage employees and their assignments
              </Typography>
              {/* Only show Add Employee button on Employees tab */}
              {currentTab === 0 && (
                <Button
                  startIcon={<AddIcon />}
                  sx={{
                    backgroundColor: "#0b75d9",
                    color: "white",
                    borderRadius: 2,
                    padding: "8px 16px",
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": { backgroundColor: "#0765b6" },
                  }}
                  onClick={handleOpenAdd}
                >
                  Add Employee
                </Button>
              )}
            </Box>

            {/* Tabs for Employees and Customers */}
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: "1rem",
                    minWidth: 120,
                  },
                  "& .Mui-selected": {
                    color: "#0b75d9",
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#0b75d9",
                  },
                }}
              >
                <Tab
                  icon={<PeopleIcon />}
                  iconPosition="start"
                  label={`Employees (${employees.length})`}
                />
                <Tab
                  icon={<PersonIcon />}
                  iconPosition="start"
                  label={`Customers (${users.length})`}
                />
              </Tabs>
            </Box>

            <UserManagementStats
              employees={currentData}
              type={currentTab === 0 ? "employees" : "customers"}
            />

            <EmployeesTable
              employees={currentData}
              onView={openView}
              onEdit={openEdit}
              onDelete={openDeleteDialog}
              onBlock={openBlockDialog}
            />
          </>
        )}

        {/* Modals - Always rendered, controlled by state */}
        <EmployeeProfileModal
          open={modalOpen}
          onClose={handleCloseView}
          employee={selectedEmployee}
        />

        <EditEmployeeModal
          open={editModalOpen}
          onClose={handleCloseEdit}
          employee={selectedEmployee}
          onSave={handleSaveEdit}
        />

        <AddEmployeeModal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          managerInfo={user} // Pass the manager's information
          onCreate={(newEmployee) => {
            // Add the new employee returned from the backend to the local state
            setEmployees((prev) => [...prev, newEmployee]);
            setSuccessTitle("Employee added!");
            setSuccessMessage(`Login credentials have been sent.`);
            setShowSuccess(true);
            setAddOpen(false);
          }}
        />

        <NotificationSnackbar
          open={showSuccess}
          onClose={handleCloseSuccess}
          severity="success"
          title={successTitle}
          message={successMessage}
        />

        <NotificationSnackbar
          open={showError}
          onClose={handleCloseError}
          severity="error"
          title={errorTitle}
          message={errorMessage}
        />
      </Box>
    </ManagerLayout>
  );
};

export default ManagerUserManagementPage;

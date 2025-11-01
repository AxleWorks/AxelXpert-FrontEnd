import React, { useEffect, useCallback, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
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

const ManagerUserManagementPage = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]); // Separate state for users (customers)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successTitle, setSuccessTitle] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorTitle, setErrorTitle] = useState("Operation Failed");
  const [showError, setShowError] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [employeeToBlock, setEmployeeToBlock] = useState(null);
  const [currentTab, setCurrentTab] = useState(0); // 0 for employees, 1 for users

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        console.log("Fetching user data...", {
          userRole: user?.role,
          userBranchId: user?.branchId,
          isAdmin,
        });

        // Fetch all user types: employees, managers, and users
        const [employeesRes, managersRes, usersRes] = await Promise.all([
          authenticatedAxios.get(`${USERS_URL}/employees`),
          authenticatedAxios.get(`${USERS_URL}/managers`),
          authenticatedAxios.get(`${USERS_URL}/users`),
        ]);

        console.log("=== RAW API Response ===");
        console.log("Employees:", employeesRes.data);
        console.log("Managers:", managersRes.data);
        console.log("Users (Customers):", usersRes.data);
        console.log("========================");

        console.log("API Response:", {
          employees: employeesRes.data.length,
          managers: managersRes.data.length,
          users: usersRes.data.length,
          usersData: usersRes.data,
        });

        // Both admin and manager can see ALL users (customers) regardless of branch
        // Manager can only see employees from their branch
        // Admin can see employees from all branches

        if (!isAdmin && user?.branchId) {
          // MANAGER VIEW
          const branchEmployees = employeesRes.data.filter(
            (emp) => emp.branchId === user.branchId
          );

          console.log("Manager view:", {
            branchEmployees: branchEmployees.length,
            allCustomers: usersRes.data.length,
          });

          setEmployees(branchEmployees); // Only their branch employees
          setUsers(usersRes.data); // ALL users/customers regardless of branch
        } else {
          // Admin view: all employees/managers in one tab, all users in another
          const allEmployees = [...employeesRes.data, ...managersRes.data];

          console.log(
            "Admin view - employees:",
            allEmployees.length,
            "users:",
            usersRes.data.length
          );
          setEmployees(allEmployees);
          setUsers(usersRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch employees:", err);
        setError("Failed to load employees. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [user, isAdmin]);

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

  const handleCreateEmployee = useCallback((newEmployee) => {
    setEmployees((prev) => [...prev, newEmployee]);
    setSuccessTitle("Employee added!");
    setSuccessMessage(
      `Login credentials has been sent to ${newEmployee.email}.`
    );
    setShowSuccess(true);
    setAddOpen(false);
  }, []);

  const handleCloseView = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditModalOpen(false);
    setSelectedEmployee(null);
  }, []);

  const handleCloseAdd = useCallback(() => {
    setAddOpen(false);
  }, []);

  const handleCloseSuccess = useCallback(() => {
    setShowSuccess(false);
  }, []);

  const handleCloseError = useCallback(() => {
    setShowError(false);
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Get current data based on active tab
  const currentData = currentTab === 0 ? employees : users;
  const currentDataLabel = currentTab === 0 ? "Employees" : "Customers";

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
          onClose={handleCloseAdd}
          onCreate={handleCreateEmployee}
          isAdmin={isAdmin}
          userBranchId={user?.branchId}
        />

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          employee={employeeToDelete}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />

        <BlockConfirmDialog
          open={blockDialogOpen}
          employee={employeeToBlock}
          onConfirm={confirmBlock}
          onCancel={cancelBlock}
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

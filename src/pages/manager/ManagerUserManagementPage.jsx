import React, { useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar as MuiAvatar,
  IconButton,
  Paper,
  Tooltip,
  TableSortLabel,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { UserCheck, User, UserX } from "lucide-react";
import ManagerLayout from "../../layouts/manager/ManagerLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import EmployeeProfileModal from "../../components/userManagement/EmployeeProfileModal";
import EditEmployeeModal from "../../components/userManagement/EditEmployeeModal";
import AddEmployeeModal from "../../components/userManagement/AddEmployeeModal";
import axios from "axios";
import { Visibility, Edit, Delete, Block } from "@mui/icons-material";

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
      try {
        const response = await axios.get("http://localhost:8080/api/users/all");
        setEmployees(response.data);
      } catch (err) {
        console.error("Failed to fetch employees:", err);
        setError("Failed to load employees. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleOpenAdd = () => {
    // helpful console log for debugging in browser
    console.log("Add Employee button clicked - opening modal");
    setAddOpen(true);
  };

  const openView = (employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  const openEdit = (employee) => {
    setSelectedEmployee(employee);
    setEditModalOpen(true);
  };

  const openDeleteDialog = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (employeeToDelete) {
      try {
        await axios.delete(`http://localhost:8080/api/users/${employeeToDelete.id}`);
        
        // Success - HTTP 204 No Content
        setEmployees((prev) => prev.filter((e) => e.id !== employeeToDelete.id));
        setSuccessTitle("Employee deleted!");
        setSuccessMessage(`${employeeToDelete.username} has been deleted successfully.`);
        setShowSuccess(true);
        console.log("Employee deleted successfully");
        
        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);
      } catch (error) {
        console.error("Failed to delete employee:", error);
        
        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);
        
        // Handle different error scenarios
        if (error.response) {
          if (error.response.status === 409) {
            // Conflict - User has active bookings or tasks
            setErrorTitle("Delete Failed");
            setErrorMessage(error.response.data || "Cannot delete user: User has active bookings or tasks");
          } else if (error.response.status === 404) {
            // Not found
            setErrorTitle("Delete Failed");
            setErrorMessage("User not found. They may have been already deleted.");
          } else {
            // Other errors
            setErrorTitle("Delete Failed");
            setErrorMessage("Failed to delete employee. Please try again.");
          }
        } else {
          // Network or other errors
          setErrorTitle("Delete Failed");
          setErrorMessage("Network error. Please check your connection and try again.");
        }
        
        setShowError(true);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const openBlockDialog = (employee) => {
    setEmployeeToBlock(employee);
    setBlockDialogOpen(true);
  };

  const confirmBlock = async () => {
    if (employeeToBlock) {
      const isCurrentlyBlocked = employeeToBlock.isBlocked;
      const newBlockedStatus = !isCurrentlyBlocked;
      
      try {
        const response = await axios.put(
          `http://localhost:8080/api/users/${employeeToBlock.id}/block`,
          { blocked: newBlockedStatus }
        );
        
        // Success - update local state with response data
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
        console.log(`User ${newBlockedStatus ? 'blocked' : 'unblocked'} successfully`);
        
        setBlockDialogOpen(false);
        setEmployeeToBlock(null);
      } catch (error) {
        console.error("Failed to update block status:", error);
        
        setBlockDialogOpen(false);
        setEmployeeToBlock(null);
        
        // Handle different error scenarios
        if (error.response) {
          if (error.response.status === 409) {
            // Conflict - User has active bookings or tasks
            setErrorTitle(newBlockedStatus ? "Block Failed" : "Unblock Failed");
            setErrorMessage(
              error.response.data || 
              "Cannot block user: User has active bookings or tasks"
            );
          } else if (error.response.status === 404) {
            // Not found
            setErrorTitle(newBlockedStatus ? "Block Failed" : "Unblock Failed");
            setErrorMessage("User not found.");
          } else if (error.response.status === 400) {
            // Bad request
            setErrorTitle(newBlockedStatus ? "Block Failed" : "Unblock Failed");
            setErrorMessage("Invalid request. Please try again.");
          } else {
            // Other errors
            setErrorTitle(newBlockedStatus ? "Block Failed" : "Unblock Failed");
            setErrorMessage("Failed to update user status. Please try again.");
          }
        } else {
          // Network or other errors
          setErrorTitle(newBlockedStatus ? "Block Failed" : "Unblock Failed");
          setErrorMessage("Network error. Please check your connection and try again.");
        }
        
        setShowError(true);
      }
    }
  };

  const cancelBlock = () => {
    setBlockDialogOpen(false);
    setEmployeeToBlock(null);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const descendingComparator = React.useCallback((a, b, orderBy) => {
    let aValue = a[orderBy];
    let bValue = b[orderBy];

    // Handle null/undefined values
    if (aValue == null) aValue = "";
    if (bValue == null) bValue = "";

    // Convert to lowercase for string comparison
    if (typeof aValue === "string") aValue = aValue.toLowerCase();
    if (typeof bValue === "string") bValue = bValue.toLowerCase();

    if (bValue < aValue) return -1;
    if (bValue > aValue) return 1;
    return 0;
  }, []);

  const getComparator = React.useCallback((order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }, [descendingComparator]);

  const filteredEmployees = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return employees;
    }
    
    const query = searchQuery.toLowerCase();
    return employees.filter((employee) => {
      return (
        employee.username?.toLowerCase().includes(query) ||
        employee.email?.toLowerCase().includes(query) ||
        employee.role?.toLowerCase().includes(query) ||
        employee.branchName?.toLowerCase().includes(query) ||
        employee.phoneNumber?.toLowerCase().includes(query) ||
        employee.address?.toLowerCase().includes(query)
      );
    });
  }, [employees, searchQuery]);

  const sortedEmployees = React.useMemo(() => {
    return [...filteredEmployees].sort(getComparator(order, orderBy));
  }, [filteredEmployees, order, orderBy, getComparator]);

  // Calculate stats from actual data
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.isActive && !emp.isBlocked).length;
  const inactiveEmployees = employees.filter(emp => !emp.isActive || emp.isBlocked).length;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // edits are handled by EmployeeProfileModal's onSave handler

  return (
    <ManagerLayout>
      <Box sx={{ pb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <div>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              User Management
            </Typography>
            <Typography color="text.secondary">
              Manage employees and their assignments
            </Typography>
          </div>
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
        </Box>

        <Grid
          container
          spacing={3}
          sx={{ mb: 3, alignItems: "stretch", width: "100%" }}
        >
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              alignItems: "stretch",
              flex: 1,
              minWidth: 0,
            }}
          >
            <StatCard
              title="Total Employees"
              value={totalEmployees}
              Icon={User}
              iconBg="#eaf3ff"
              iconColor="#0b75d9"
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              alignItems: "stretch",
              flex: 1,
              minWidth: 0,
            }}
          >
            <StatCard
              title="Active"
              value={activeEmployees}
              Icon={UserCheck}
              iconBg="#e9fbf0"
              iconColor="#10b981"
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              alignItems: "stretch",
              flex: 1,
              minWidth: 0,
            }}
          >
            <StatCard
              title="Inactive/Blocked"
              value={inactiveEmployees}
              Icon={UserX}
              iconBg="#fff6ea"
              iconColor="#f59e0b"
            />
          </Grid>
        </Grid>

        <Card sx={{ borderRadius: 3 }}>
          <CardHeader>
            <CardTitle>Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <Box sx={{ mb: 3 }}>
              <TextField
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{
                borderRadius: 3,
                boxShadow: "none",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>
                      <TableSortLabel
                        active={orderBy === "username"}
                        direction={orderBy === "username" ? order : "asc"}
                        onClick={() => handleRequestSort("username")}
                      >
                        Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      <TableSortLabel
                        active={orderBy === "role"}
                        direction={orderBy === "role" ? order : "asc"}
                        onClick={() => handleRequestSort("role")}
                      >
                        Role
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      <TableSortLabel
                        active={orderBy === "branchName"}
                        direction={orderBy === "branchName" ? order : "asc"}
                        onClick={() => handleRequestSort("branchName")}
                      >
                        Branch
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      <TableSortLabel
                        active={orderBy === "phoneNumber"}
                        direction={orderBy === "phoneNumber" ? order : "asc"}
                        onClick={() => handleRequestSort("phoneNumber")}
                      >
                        Phone Number
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                        <Typography color="text.secondary" variant="body1">
                          {searchQuery
                            ? `No employees found matching "${searchQuery}"`
                            : "No employees found"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedEmployees.map((employee) => (
                    <TableRow
                      key={employee.id}
                      sx={{
                        cursor: "pointer",
                        transition: "background-color 150ms ease",
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            name={employee.username}
                            profileImageUrl={employee.profileImageUrl}
                          />
                          <Box>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                              {employee.username}
                            </Typography>
                            <Typography 
                              sx={{ 
                                color: 'text.secondary',
                                fontSize: '0.875rem',
                                mt: 0.25,
                              }}
                            >
                              {employee.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ textTransform: 'capitalize' }}>
                          {employee.role}
                        </Typography>
                      </TableCell>
                      <TableCell>{employee.branchName || "No Branch"}</TableCell>
                      <TableCell>
                        <Typography>{employee.phoneNumber || "N/A"}</Typography>
                      </TableCell>
                      <TableCell>
                        <Badge
                          sx={{
                            borderRadius: 8,
                            padding: "4px 10px",
                            backgroundColor: employee.isBlocked
                              ? "#ef4444" // Red for blocked
                              : employee.isActive
                              ? "#10b981" // Green for active
                              : "#f59e0b", // Orange for inactive
                            color: "white",
                          }}
                        >
                          {employee.isBlocked ? (
                            <Typography>Blocked</Typography>
                          ) : employee.isActive ? (
                            <Typography>Active</Typography>
                          ) : (
                            <Typography>Inactive</Typography>
                          )}
                        </Badge>
                      </TableCell>

                      <TableCell align="center">
                        <Tooltip title="View">
                          <IconButton
                            onClick={() => openView(employee)}
                            style={{ color: "#4caf50" }}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => openEdit(employee)}
                            style={{ color: "#0b75d9" }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => openDeleteDialog(employee)}
                            style={{ color: "#f44336" }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={employee.isBlocked ? "Unblock" : "Block"}>
                          <IconButton
                            onClick={() => openBlockDialog(employee)}
                            style={{ 
                              color: employee.isBlocked ? "#10b981" : "#ff9800" 
                            }}
                          >
                            <Block />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
        <EmployeeProfileModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          employee={selectedEmployee}
        />
        <EditEmployeeModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedEmployee(null);
          }}
          employee={selectedEmployee}
          onSave={(updated) => {
            // Update user via backend API
            axios.put(`http://localhost:8080/api/users/${updated.id}`, {
              username: updated.username,
              role: updated.role,
              branchId: updated.branchId,
              phoneNumber: updated.phoneNumber,
              address: updated.address,
              isActive: updated.isActive,
            })
            .then((response) => {
              // Update local state with response data
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
          }}
        />
        <AddEmployeeModal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onCreate={(newEmployee) => {
            const id = Math.max(0, ...employees.map((e) => e.id)) + 1;
            setEmployees((prev) => [...prev, { id, ...newEmployee }]);
            setSuccessTitle("Employee added!");
            setSuccessMessage("New employee has been added successfully.");
            setShowSuccess(true);
            setAddOpen(false);
          }}
        />
        <Snackbar
          open={showSuccess}
          autoHideDuration={4000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ mt: 2 }}
        >
          <Alert 
            onClose={() => setShowSuccess(false)} 
            severity="success" 
            variant="filled"
            icon={
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981',
                }}
              >
                ✓
              </Box>
            }
            sx={{ 
              width: '400px',
              backgroundColor: '#d1fae5',
              color: '#065f46',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              fontSize: '0.95rem',
              '& .MuiAlert-message': {
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
              },
              '& .MuiAlert-icon': {
                marginRight: 1.5,
              },
              '& .MuiIconButton-root': {
                color: '#065f46',
                '&:hover': {
                  backgroundColor: 'rgba(6, 95, 70, 0.1)',
                },
              },
            }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#065f46' }}>
              {successTitle}
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: '#047857' }}>
              {successMessage}
            </Typography>
          </Alert>
        </Snackbar>
        
        {/* Error Notification */}
        <Snackbar
          open={showError}
          autoHideDuration={5000}
          onClose={() => setShowError(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ mt: 2 }}
        >
          <Alert 
            onClose={() => setShowError(false)} 
            severity="error" 
            variant="filled"
            icon={
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ef4444',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                }}
              >
                ✕
              </Box>
            }
            sx={{ 
              width: '400px',
              backgroundColor: '#fee2e2',
              color: '#7f1d1d',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              fontSize: '0.95rem',
              '& .MuiAlert-message': {
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
              },
              '& .MuiAlert-icon': {
                marginRight: 1.5,
              },
              '& .MuiIconButton-root': {
                color: '#7f1d1d',
                '&:hover': {
                  backgroundColor: 'rgba(127, 29, 29, 0.1)',
                },
              },
            }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#7f1d1d' }}>
              {errorTitle}
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: '#991b1b' }}>
              {errorMessage}
            </Typography>
          </Alert>
        </Snackbar>
        
        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={cancelDelete}
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 3,
              minWidth: 400,
            }
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            textAlign: 'center',
            gap: 2,
          }}>
            {/* Delete Warning Icon */}
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: '#ffebee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid #ffcdd2',
              }}
            >
              <Delete 
                sx={{ 
                  fontSize: '2rem', 
                  color: '#f44336',
                }}
              />
            </Box>

            {/* Title */}
            <DialogTitle sx={{ 
              fontSize: '1.5rem', 
              fontWeight: 600,
              p: 0,
              color: '#1a1a1a',
            }}>
              Confirm Delete
            </DialogTitle>

            {/* Message */}
            <DialogContent sx={{ p: 0 }}>
              <DialogContentText sx={{ 
                color: '#666666', 
                fontSize: '1rem',
                lineHeight: 1.5,
              }}>
                Are you sure you want to delete <strong>{employeeToDelete?.username}</strong>?
              </DialogContentText>
              <DialogContentText sx={{ 
                color: '#999999', 
                fontSize: '0.875rem',
                lineHeight: 1.5,
                mt: 1.5,
                fontStyle: 'italic',
              }}>
                Note: Users with active appointments or tasks cannot be deleted.
              </DialogContentText>
            </DialogContent>

            {/* Buttons */}
            <DialogActions sx={{ p: 0, gap: 2, width: '100%', justifyContent: 'center' }}>
              <Button
                onClick={cancelDelete}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.2,
                  textTransform: 'uppercase',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#0b75d9',
                  border: '1px solid #0b75d9',
                  backgroundColor: 'transparent',
                  minWidth: 120,
                  '&:hover': {
                    backgroundColor: 'rgba(11, 117, 217, 0.04)',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.2,
                  textTransform: 'uppercase',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  backgroundColor: '#0b75d9',
                  color: 'white',
                  minWidth: 120,
                  '&:hover': {
                    backgroundColor: '#0960b8',
                  },
                }}
              >
                Confirm
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        {/* Block/Unblock Confirmation Dialog */}
        <Dialog
          open={blockDialogOpen}
          onClose={cancelBlock}
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 3,
              minWidth: 400,
            }
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            textAlign: 'center',
            gap: 2,
          }}>
            {/* Block/Unblock Warning Icon */}
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: employeeToBlock?.isBlocked ? '#e9fbf0' : '#fff6ea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: employeeToBlock?.isBlocked 
                  ? '3px solid #a7f3d0' 
                  : '3px solid #fde68a',
              }}
            >
              {employeeToBlock?.isBlocked ? (
                <UserCheck 
                  size={32}
                  color="#10b981"
                />
              ) : (
                <Block 
                  sx={{ 
                    fontSize: '2rem', 
                    color: '#f59e0b',
                  }}
                />
              )}
            </Box>

            {/* Title */}
            <DialogTitle sx={{ 
              fontSize: '1.5rem', 
              fontWeight: 600,
              p: 0,
              color: '#1a1a1a',
            }}>
              {employeeToBlock?.isBlocked ? 'Confirm Unblock' : 'Confirm Block'}
            </DialogTitle>

            {/* Message */}
            <DialogContent sx={{ p: 0 }}>
              <DialogContentText sx={{ 
                color: '#666666', 
                fontSize: '1rem',
                lineHeight: 1.5,
              }}>
                {employeeToBlock?.isBlocked ? (
                  <>
                    Are you sure you want to unblock <strong>{employeeToBlock?.username}</strong>?
                  </>
                ) : (
                  <>
                    Are you sure you want to block <strong>{employeeToBlock?.username}</strong>?
                  </>
                )}
              </DialogContentText>
              <DialogContentText sx={{ 
                color: '#999999', 
                fontSize: '0.875rem',
                lineHeight: 1.5,
                mt: 1.5,
                fontStyle: 'italic',
              }}>
                {employeeToBlock?.isBlocked ? (
                  "This will restore the user's access to the system."
                ) : (
                  "Note: Users with active appointments or tasks cannot be blocked."
                )}
              </DialogContentText>
            </DialogContent>

            {/* Buttons */}
            <DialogActions sx={{ p: 0, gap: 2, width: '100%', justifyContent: 'center' }}>
              <Button
                onClick={cancelBlock}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.2,
                  textTransform: 'uppercase',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#0b75d9',
                  border: '1px solid #0b75d9',
                  backgroundColor: 'transparent',
                  minWidth: 120,
                  '&:hover': {
                    backgroundColor: 'rgba(11, 117, 217, 0.04)',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmBlock}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.2,
                  textTransform: 'uppercase',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  backgroundColor: '#0b75d9',
                  color: 'white',
                  minWidth: 120,
                  '&:hover': {
                    backgroundColor: '#0960b8',
                  },
                }}
              >
                Confirm
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Box>
    </ManagerLayout>
  );
};

export default ManagerUserManagementPage;

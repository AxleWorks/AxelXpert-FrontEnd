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

  const handleDelete = (employeeId) => {
    console.log("Delete employee with ID:", employeeId);
  };

  const handleBan = (employeeId) => {
    console.log("Ban employee with ID:", employeeId);
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
                            onClick={() => handleDelete(employee.id)}
                            style={{ color: "#f44336" }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={employee.isBlocked ? "Unblock" : "Block"}>
                          <IconButton
                            onClick={() => handleBan(employee.id)}
                            style={{ color: employee.isBlocked ? "#4caf50" : "#ff9800" }}
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
            setAddOpen(false);
          }}
        />
      </Box>
    </ManagerLayout>
  );
};

export default ManagerUserManagementPage;

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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
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
  const [modalMode, setModalMode] = React.useState("view");
  const [selectedEmployee, setSelectedEmployee] = React.useState(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const [tasksOpen, setTasksOpen] = React.useState(false);
  const [orderBy, setOrderBy] = React.useState("name");
  const [order, setOrder] = React.useState("asc");

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
    setModalMode("view");
    setModalOpen(true);
  };

  const openEdit = (employee) => {
    setSelectedEmployee(employee);
    setModalMode("edit");
    setModalOpen(true);
  };

  const openTasks = (employee) => {
    // resolve taskIds to actual task objects for the modal
    const assigned = getTasksByIds(employee.taskIds || []);
    setSelectedEmployee({ ...employee, assignedTasks: assigned });
    setTasksOpen(true);
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

  const sortedEmployees = React.useMemo(() => {
    return [...employees].sort(getComparator(order, orderBy));
  }, [employees, order, orderBy, getComparator]);

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
              value={8}
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
              value={6}
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
              title="On Leave"
              value={2}
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
                        active={orderBy === "name"}
                        direction={orderBy === "name" ? order : "asc"}
                        onClick={() => handleRequestSort("name")}
                      >
                        Employee
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      <TableSortLabel
                        active={orderBy === "username"}
                        direction={orderBy === "username" ? order : "asc"}
                        onClick={() => handleRequestSort("username")}
                      >
                        User Name
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
                        active={orderBy === "branch"}
                        direction={orderBy === "branch" ? order : "asc"}
                        onClick={() => handleRequestSort("branch")}
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
                  {sortedEmployees.map((employee) => (
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
                            name={employee.name}
                            profileImageUrl={employee.profileImageUrl}
                          />
                          <Box>
                            <Typography sx={{ fontWeight: 600 }}>
                              {employee.name}
                            </Typography>
                            <Typography color="text.secondary" variant="body2">
                              {employee.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{employee.username}</TableCell>
                      <TableCell>{employee.role}</TableCell>
                      <TableCell>{employee.branch || "No Branch"}</TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Box sx={{ color: "#f6c84c", fontSize: 18 }}></Box>
                          <Typography>{employee.phoneNumber}</Typography>
                        </Box>
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
                        <Tooltip title="Ban">
                          <IconButton
                            onClick={() => handleBan(employee.id)}
                            style={{ color: "#ff9800" }}
                          >
                            <Block />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
        <EmployeeProfileModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          employee={selectedEmployee}
          mode={modalMode}
          onSave={(updated) => {
            // normalize and save
            const normalized = {
              ...updated,
              name: updated.name || updated.fullName || selectedEmployee?.name,
              role: updated.role,
              branch: updated.branch,
              phone: updated.phone,
              address: updated.address,
              hired_at:
                updated.hiredAt ??
                updated.hired_at ??
                selectedEmployee?.hired_at,
              status: updated.status || selectedEmployee?.status,
            };
            setEmployees((prev) =>
              prev.map((e) =>
                e.id === normalized.id ? { ...e, ...normalized } : e
              )
            );
            setModalOpen(false);
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

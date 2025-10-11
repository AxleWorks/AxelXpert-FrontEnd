import React from "react";
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
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import { UserCheck, User, UserX } from "lucide-react";
import ManagerLayout from "../../layouts/manager/ManagerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {} from "@mui/material";
import EmployeeProfileModal from "../../components/manager/EmployeeProfileModal";
import AddEmployeeModal from "../../components/manager/AddEmployeeModal";
import AssignedTasksModal from "../../components/manager/AssignedTasksModal";
import { employees as mockEmployees, getTasksByIds } from '../../data/mockData';

const initialEmployees = mockEmployees;

const StatCard = ({ title, value, Icon, iconBg = "#f3f8ff", iconColor = "#0b75d9" }) => (
  <Card sx={{ borderRadius: 3, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 140, width: '100%' }}>
    <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, width: '100%' }}>
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

const Avatar = ({ name }) => (
  <MuiAvatar sx={{ bgcolor: "grey.100", color: "text.primary" }}>
    {name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")}
  </MuiAvatar>
);



const ManagerUserManagementPage = () => {
  const [employees, setEmployees] = React.useState(initialEmployees);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menuId, setMenuId] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState('view');
  const [selectedEmployee, setSelectedEmployee] = React.useState(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const [tasksOpen, setTasksOpen] = React.useState(false);

  const handleOpenAdd = () => {
    // helpful console log for debugging in browser
    console.log('Add Employee button clicked - opening modal');
    setAddOpen(true);
  };

  const handleOpenMenu = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const openView = (employee) => {
    setSelectedEmployee(employee);
    setModalMode('view');
    setModalOpen(true);
  };

  const openEdit = (employee) => {
    setSelectedEmployee(employee);
    setModalMode('edit');
    setModalOpen(true);
  };

  const openTasks = (employee) => {
    // resolve taskIds to actual task objects for the modal
    const assigned = getTasksByIds(employee.taskIds || []);
    setSelectedEmployee({ ...employee, assignedTasks: assigned });
    setTasksOpen(true);
  };

  // edits are handled by EmployeeProfileModal's onSave handler

  return (
    <ManagerLayout>
      <Box sx={{ pb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <div>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              User Management
            </Typography>
            <Typography color="text.secondary">Manage employees and their assignments</Typography>
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
              '&:hover': { backgroundColor: "#0765b6" },
            }}
            onClick={handleOpenAdd}
          >
            Add Employee
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mb: 3, alignItems: 'stretch', width: '100%' }}>
          <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'stretch', flex: 1, minWidth: 0 }}>
            <StatCard title="Total Employees" value={8} Icon={User} iconBg="#eaf3ff" iconColor="#0b75d9" />
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'stretch', flex: 1, minWidth: 0 }}>
            <StatCard title="Active" value={6} Icon={UserCheck} iconBg="#e9fbf0" iconColor="#10b981" />
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'stretch', flex: 1, minWidth: 0 }}>
            <StatCard title="On Leave" value={2} Icon={UserX} iconBg="#fff6ea" iconColor="#f59e0b" />
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
              sx={{ borderRadius: 3, boxShadow: "none", border: "1px solid rgba(0,0,0,0.06)" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Branch</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Tasks Completed</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow
                      key={employee.id}
                      sx={{
                        cursor: 'pointer',
                        transition: 'background-color 150ms ease',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar name={employee.name} />
                          <Box>
                            <Typography sx={{ fontWeight: 600 }}>{employee.name}</Typography>
                            <Typography color="text.secondary" variant="body2">
                              {employee.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{employee.role}</TableCell>
                      <TableCell>{employee.branch}</TableCell>
                      <TableCell>{employee.tasksCompleted}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box sx={{ color: "#f6c84c", fontSize: 18 }}>★</Box>
                          <Typography>{employee.rating}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Badge
                          sx={{
                            borderRadius: 8,
                            padding: "4px 10px",
                            backgroundColor: employee.status === "Active" ? "#10b981" : "#f59e0b",
                            color: "white",
                          }}
                        >
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={(e) => handleOpenMenu(e, employee.id)}>
                          <MoreVertIcon />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={menuId === employee.id} onClose={handleCloseMenu}>
                          <MenuItem
                            onClick={() => {
                              openView(employee);
                              handleCloseMenu();
                            }}
                          >
                            View Profile
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              openEdit(employee);
                              handleCloseMenu();
                            }}
                          >
                            Edit Details
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              openTasks(employee);
                              handleCloseMenu();
                            }}
                          >
                            Assign Tasks
                          </MenuItem>
                          <MenuItem onClick={handleCloseMenu} sx={{ color: "error.main" }}>
                            Deactivate
                          </MenuItem>
                        </Menu>
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
              hired_at: updated.hiredAt ?? updated.hired_at ?? selectedEmployee?.hired_at,
              status: updated.status || selectedEmployee?.status,
            };
            setEmployees((prev) => prev.map((e) => (e.id === normalized.id ? { ...e, ...normalized } : e)));
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
        <AssignedTasksModal open={tasksOpen} onClose={() => { setTasksOpen(false); setSelectedEmployee(null); }} employee={selectedEmployee} />
      </Box>
    </ManagerLayout>
  );
};

export default ManagerUserManagementPage;

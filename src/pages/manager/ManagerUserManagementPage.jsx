import React, { useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Avatar,
  Chip,
  IconButton,
  Rating as MuiRating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Menu,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { 
  Add, 
  People, 
  PersonOutlined, 
  HowToReg, 
  MoreVert, 
  Star,
  Edit,
  Delete,
  Block
} from "@mui/icons-material";
import StatCard from "../../components/dashboard/cards/StatCard";
import ManagerLayout from "../../layouts/manager/ManagerLayout";

const ManagerUserManagementPage = () => {
  const [openAddEmployeeDialog, setOpenAddEmployeeDialog] = useState(false);
  const [openEditEmployeeDialog, setOpenEditEmployeeDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    role: "",
    branch: "Downtown",
  });
  
  const [editEmployee, setEditEmployee] = useState({
    id: null,
    name: "",
    email: "",
    role: "",
    branch: "",
    tasksCompleted: 0,
    rating: 0,
    status: "Active",
  });
  
  // Mock data for employees
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Michael Chen",
      initials: "MC",
      email: "michael.chen@axlexpert.com",
      role: "Senior Technician",
      branch: "Downtown",
      tasksCompleted: 145,
      rating: 4.8,
      status: "Active",
    },
    {
      id: 2,
      name: "Sarah Wilson",
      initials: "SW",
      email: "sarah.wilson@axlexpert.com",
      role: "Technician",
      branch: "Downtown",
      tasksCompleted: 98,
      rating: 4.6,
      status: "Active",
    },
    {
      id: 3,
      name: "David Martinez",
      initials: "DM",
      email: "david.martinez@axlexpert.com",
      role: "Junior Technician",
      branch: "Downtown",
      tasksCompleted: 54,
      rating: 4.5,
      status: "On Leave",
    },
    {
      id: 4,
      name: "Emily Thompson",
      initials: "ET",
      email: "emily.thompson@axlexpert.com",
      role: "Technician",
      branch: "Downtown",
      tasksCompleted: 112,
      rating: 4.9,
      status: "Active",
    },
  ]);

  const activeEmployees = employees.filter(emp => emp.status === "Active");
  const onLeaveEmployees = employees.filter(emp => emp.status === "On Leave");

  const handleAddEmployeeOpen = () => {
    setOpenAddEmployeeDialog(true);
  };
  const handleAddEmployeeClose = () => {
    setOpenAddEmployeeDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({
      ...newEmployee,
      [name]: value,
    });
  };
  
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditEmployee({
      ...editEmployee,
      [name]: value,
    });
  };
  
  const handleRatingChange = (newValue) => {
    setEditEmployee({
      ...editEmployee,
      rating: newValue,
    });
  };
  
  const handleMenuOpen = (event, employee) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleEditClick = () => {
    setEditEmployee({...selectedEmployee});
    setOpenEditEmployeeDialog(true);
    handleMenuClose();
  };
  
  const handleEditEmployeeClose = () => {
    setOpenEditEmployeeDialog(false);
  };
  
  const handleEditEmployeeSave = () => {
    const updatedEmployees = employees.map(emp => 
      emp.id === editEmployee.id ? {...editEmployee} : emp
    );
    
    setEmployees(updatedEmployees);
    setOpenEditEmployeeDialog(false);
  };
  
  const handleDeleteEmployee = () => {
    if (selectedEmployee) {
      const updatedEmployees = employees.filter(emp => emp.id !== selectedEmployee.id);
      setEmployees(updatedEmployees);
      handleMenuClose();
    }
  };
  
  const handleToggleStatus = () => {
    if (selectedEmployee) {
      const newStatus = selectedEmployee.status === "Active" ? "On Leave" : "Active";
      const updatedEmployees = employees.map(emp => 
        emp.id === selectedEmployee.id ? {...emp, status: newStatus} : emp
      );
      
      setEmployees(updatedEmployees);
      handleMenuClose();
    }
  };
  const handleAddEmployee = () => {
    const initials = newEmployee.name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
      
    const newEmployeeData = {
      id: employees.length + 1,
      initials,
      name: newEmployee.name,
      email: newEmployee.email,
      role: newEmployee.role,
      branch: newEmployee.branch,
      tasksCompleted: 0,
      rating: 0,
      status: "Active",
    };
    
    setEmployees([...employees, newEmployeeData]);
    setNewEmployee({
      name: "",
      email: "",
      role: "",
      branch: "Downtown",
    });
    handleAddEmployeeClose();
  };

  return (
    <ManagerLayout>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            User Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage employees and their assignments
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddEmployeeOpen}
          sx={{ borderRadius: 2 }}
        >
          Add Employee
        </Button>
      </Box>      {/* Stats Cards */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          width: '100%', 
          mb: 4,
          gap: 2,
          backgroundColor: '#0f172a', 
          borderRadius: 2,
          p: 2
        }}
      >
        <Box sx={{ flex: 1, display: 'flex', borderRadius: 2, bgcolor: '#1e293b', p: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              {employees.length}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Total Employees
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: '#3b82f6', width: 56, height: 56 }}>
            <People />
          </Avatar>
        </Box>
        
        <Box sx={{ flex: 1, display: 'flex', borderRadius: 2, bgcolor: '#1e293b', p: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              {activeEmployees.length}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Active
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: '#22c55e', width: 56, height: 56 }}>
            <HowToReg />
          </Avatar>
        </Box>
        
        <Box sx={{ flex: 1, display: 'flex', borderRadius: 2, bgcolor: '#1e293b', p: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              {onLeaveEmployees.length}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              On Leave
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: '#f59e0b', width: 56, height: 56 }}>
            <PersonOutlined />
          </Avatar>
        </Box>
      </Box>

      {/* Employees Table */}
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, overflow: "hidden" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Employees
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Tasks Completed</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{ 
                          bgcolor: "#e2e8f0", 
                          color: "#64748b", 
                          mr: 2,
                          width: 40,
                          height: 40,
                          fontSize: "0.9rem",
                          fontWeight: "bold"
                        }}
                      >
                        {employee.initials}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {employee.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {employee.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>{employee.branch}</TableCell>
                  <TableCell>{employee.tasksCompleted}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Star sx={{ color: "#f59e0b", mr: 0.5, fontSize: 18 }} />
                      <Typography variant="body2">{employee.rating}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={employee.status}
                      color={employee.status === "Active" ? "success" : "warning"}
                      size="small"
                      sx={{ 
                        borderRadius: 1,
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>                  <TableCell align="center">
                    <IconButton 
                      size="small" 
                      onClick={(e) => handleMenuOpen(e, employee)}
                      aria-label="actions"
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>      {/* Add Employee Dialog */}
      <Dialog open={openAddEmployeeDialog} onClose={handleAddEmployeeClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={newEmployee.name}
              onChange={handleInputChange}
              margin="dense"
              required
            />
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={newEmployee.email}
              onChange={handleInputChange}
              margin="dense"
              required
            />
            <FormControl fullWidth margin="dense" required>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={newEmployee.role}
                label="Role"
                onChange={handleInputChange}
              >
                <MenuItem value="Senior Technician">Senior Technician</MenuItem>
                <MenuItem value="Technician">Technician</MenuItem>
                <MenuItem value="Junior Technician">Junior Technician</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense" required>
              <InputLabel>Branch</InputLabel>
              <Select
                name="branch"
                value={newEmployee.branch}
                label="Branch"
                onChange={handleInputChange}
              >
                <MenuItem value="Downtown">Downtown</MenuItem>
                <MenuItem value="East End">East End</MenuItem>
                <MenuItem value="West Side">West Side</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddEmployeeClose}>Cancel</Button>
          <Button 
            onClick={handleAddEmployee} 
            variant="contained" 
            disabled={!newEmployee.name || !newEmployee.email || !newEmployee.role}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={openEditEmployeeDialog} onClose={handleEditEmployeeClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={editEmployee.name}
              onChange={handleEditInputChange}
              margin="dense"
              required
            />
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={editEmployee.email}
              onChange={handleEditInputChange}
              margin="dense"
              required
            />
            <FormControl fullWidth margin="dense" required>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={editEmployee.role}
                label="Role"
                onChange={handleEditInputChange}
              >
                <MenuItem value="Senior Technician">Senior Technician</MenuItem>
                <MenuItem value="Technician">Technician</MenuItem>
                <MenuItem value="Junior Technician">Junior Technician</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense" required>
              <InputLabel>Branch</InputLabel>
              <Select
                name="branch"
                value={editEmployee.branch}
                label="Branch"
                onChange={handleEditInputChange}
              >
                <MenuItem value="Downtown">Downtown</MenuItem>
                <MenuItem value="East End">East End</MenuItem>
                <MenuItem value="West Side">West Side</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense" required>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={editEmployee.status}
                label="Status"
                onChange={handleEditInputChange}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="On Leave">On Leave</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
              <Typography variant="body1" sx={{ mr: 2 }}>Rating:</Typography>
              <MuiRating
                name="rating"
                value={Number(editEmployee.rating)}
                onChange={(event, newValue) => handleRatingChange(newValue)}
                precision={0.1}
              />
              <Typography variant="body2" sx={{ ml: 2 }}>
                {editEmployee.rating}
              </Typography>
            </Box>
            <TextField
              fullWidth
              label="Tasks Completed"
              name="tasksCompleted"
              type="number"
              value={editEmployee.tasksCompleted}
              onChange={handleEditInputChange}
              margin="dense"
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditEmployeeClose}>Cancel</Button>
          <Button 
            onClick={handleEditEmployeeSave} 
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Employee Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{ mt: 1 }}
      >
        <MenuItem onClick={handleEditClick}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Edit" />
        </MenuItem>
        <MenuItem onClick={handleToggleStatus}>
          <ListItemIcon>
            <Block fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary={selectedEmployee?.status === "Active" ? "Set to On Leave" : "Set to Active"} 
          />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteEmployee} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>
    </ManagerLayout>
  );
};

export default ManagerUserManagementPage;

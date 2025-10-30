import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  IconButton,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Divider,
  useTheme,
} from "@mui/material";
import {
  QrCode,
  Fingerprint,
  CameraAlt,
  Badge,
  Schedule,
  LocationOn,
  Notifications,
} from "@mui/icons-material";

const EmployeeManagementPanel = ({ employees = [], onUpdateEmployee }) => {
  const theme = useTheme();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setEditMode(false);
  };

  const handleGenerateQRCode = (employeeId) => {
    // Implement QR code generation for employee check-in
    console.log(`Generating QR code for employee ${employeeId}`);
  };

  const handleSetupFingerprint = (employeeId) => {
    // Implement fingerprint setup
    console.log(`Setting up fingerprint for employee ${employeeId}`);
  };

  const handleUpdatePhoto = (employeeId) => {
    // Implement photo update
    console.log(`Updating photo for employee ${employeeId}`);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
        Employee Management Panel
      </Typography>

      <Grid container spacing={3}>
        {/* Employee List */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: "fit-content" }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Employee Directory
            </Typography>
            <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
              {employees.map((employee) => (
                <Card
                  key={employee.id}
                  elevation={selectedEmployee?.id === employee.id ? 3 : 1}
                  sx={{
                    mb: 2,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    border: selectedEmployee?.id === employee.id ? 2 : 1,
                    borderColor: selectedEmployee?.id === employee.id 
                      ? theme.palette.primary.main 
                      : theme.palette.divider,
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: theme.shadows[4],
                    },
                  }}
                  onClick={() => handleEmployeeSelect(employee)}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        src={employee.avatar}
                        sx={{ width: 48, height: 48 }}
                      >
                        {employee.name.charAt(0)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {employee.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {employee.position} • {employee.department}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                          <Chip
                            label={employee.employeeId}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            label={employee.department}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Employee Details and Settings */}
        <Grid item xs={12} md={6}>
          {selectedEmployee ? (
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Employee Details
                </Typography>
                <Button
                  variant={editMode ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? "Save Changes" : "Edit"}
                </Button>
              </Box>

              {/* Employee Info */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Avatar
                  src={selectedEmployee.avatar}
                  sx={{ width: 80, height: 80 }}
                >
                  {selectedEmployee.name.charAt(0)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {selectedEmployee.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {selectedEmployee.position}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Chip label={selectedEmployee.employeeId} size="small" />
                    <Chip label={selectedEmployee.department} size="small" color="primary" />
                  </Box>
                </Box>
                <IconButton onClick={() => handleUpdatePhoto(selectedEmployee.id)}>
                  <CameraAlt />
                </IconButton>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Quick Actions */}
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<QrCode />}
                    onClick={() => handleGenerateQRCode(selectedEmployee.id)}
                    sx={{ py: 1.5 }}
                  >
                    Generate QR Code
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Fingerprint />}
                    onClick={() => handleSetupFingerprint(selectedEmployee.id)}
                    sx={{ py: 1.5 }}
                  >
                    Setup Biometric
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Badge />}
                    sx={{ py: 1.5 }}
                  >
                    Issue ID Badge
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Schedule />}
                    sx={{ py: 1.5 }}
                  >
                    Set Schedule
                  </Button>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Employee Settings */}
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Attendance Settings
              </Typography>
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Allow Remote Check-in"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Overtime Tracking"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Strict Punctuality Mode"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Break Time Tracking"
                />
              </Box>

              {/* Contact Information */}
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Contact Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={selectedEmployee.email}
                    disabled={!editMode}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={selectedEmployee.phone}
                    disabled={!editMode}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={selectedEmployee.department}
                      label="Department"
                      disabled={!editMode}
                    >
                      <MenuItem value="Technical">Technical</MenuItem>
                      <MenuItem value="Customer Service">Customer Service</MenuItem>
                      <MenuItem value="Administration">Administration</MenuItem>
                      <MenuItem value="Sales">Sales</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          ) : (
            <Paper elevation={2} sx={{ p: 6, borderRadius: 3, textAlign: "center" }}>
              <Badge sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Select an employee to view details and manage settings
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeManagementPanel;

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Avatar,
  Typography,
  FormControlLabel,
  Switch,
  Grid,
} from "@mui/material";

export default function EmployeeProfileModal({
  open,
  onClose,
  employee,
  mode = "view",
  onSave,
}) {
  const [form, setForm] = React.useState(() => ({
    fullName: employee?.name || "",
    role: employee?.role || "",
    branch: employee?.branch || "",
    email: employee?.email || "",
    phone: employee?.phone || "",
    address: employee?.address || "",
    hiredAt: employee?.hiredAt ?? employee?.hired_at ?? "",
    active: employee?.status === "Active",
  }));

  React.useEffect(() => {
    setForm({
      fullName: employee?.name || "",
      role: employee?.role || "",
      branch: employee?.branch || "",
      email: employee?.email || "",
      phone: employee?.phone || "",
      address: employee?.address || "",
      hiredAt: employee?.hiredAt ?? employee?.hired_at ?? "",
      active: employee?.status === "Active",
    });
  }, [employee, open]);

  const readOnly = mode === "view";

  const handleChange = (field) => (e) => {
    const value = field === "active" ? e.target.checked : e.target.value;
    setForm((s) => ({ ...s, [field]: value }));
  };

  const handleSave = () => {
    if (onSave) {
      const updated = {
        ...employee,
        name: form.fullName,
        role: form.role,
        branch: form.branch,
        phone: form.phone,
        address: form.address,
        hiredAt: form.hiredAt,
        status: form.active ? "Active" : "On Leave",
      };
      onSave(updated);
    }
    onClose();
  };

  return (
    <Dialog open={!!open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === "view" ? "View Profile" : "Edit Profile"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: "#f1f5f9",
              color: "#1f2937",
              fontWeight: 700,
            }}
          >
            {employee?.name
              ?.split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </Avatar>
          <Box>
            <Typography variant="h6">{employee?.name}</Typography>
            <Typography color="text.secondary">{employee?.role}</Typography>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Full Name"
              value={form.fullName}
              onChange={handleChange("fullName")}
              fullWidth
              InputProps={{ readOnly }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Role"
              value={form.role}
              onChange={handleChange("role")}
              fullWidth
              InputProps={{ readOnly }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              value={form.email}
              fullWidth
              InputProps={{ readOnly: true }}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Phone"
              value={form.phone}
              onChange={handleChange("phone")}
              fullWidth
              InputProps={{ readOnly }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Address"
              value={form.address}
              onChange={handleChange("address")}
              fullWidth
              InputProps={{ readOnly }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Branch"
              value={form.branch}
              onChange={handleChange("branch")}
              fullWidth
              InputProps={{ readOnly }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Hired At"
              value={form.hiredAt}
              onChange={handleChange("hiredAt")}
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              disabled
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.active}
                  onChange={handleChange("active")}
                  disabled={readOnly}
                />
              }
              label="Active"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {mode === "edit" && (
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

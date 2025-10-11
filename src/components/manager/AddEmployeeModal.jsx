import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Grid,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Button } from '../../components/ui/button';

export default function AddEmployeeModal({ open, onClose, onCreate }) {
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    role: '',
    branch: '',
    phone: '',
    address: '',
    hiredAt: '',
    status: 'Active',
  });

  React.useEffect(() => {
    if (!open) {
      setForm({ name: '', email: '', role: '', branch: '', phone: '', address: '', hiredAt: '', status: 'Active' });
    }
  }, [open]);

  const handleChange = (key) => (e) => setForm((s) => ({ ...s, [key]: e.target.value }));
  const handleToggle = (e) => setForm((s) => ({ ...s, status: e.target.checked ? 'Active' : 'On Leave' }));

  const handleCreate = () => {
    if (!form.name || !form.email) return; // basic required
    onCreate({
      ...form,
      hired_at: form.hiredAt,
    });
    onClose();
  };

  return (
    <Dialog open={!!open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Employee</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField label="Full Name" value={form.name} onChange={handleChange('name')} fullWidth required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Email" value={form.email} onChange={handleChange('email')} fullWidth required />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField label="Role" value={form.role} onChange={handleChange('role')} fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Branch" value={form.branch} onChange={handleChange('branch')} fullWidth />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField label="Phone" value={form.phone} onChange={handleChange('phone')} fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Hired At" type="date" value={form.hiredAt} onChange={handleChange('hiredAt')} fullWidth InputLabelProps={{ shrink: true }} />
            </Grid>

            <Grid item xs={12}>
              <TextField label="Address" value={form.address} onChange={handleChange('address')} fullWidth />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel control={<Switch checked={form.status === 'Active'} onChange={handleToggle} />} label="Active" />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreate}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}

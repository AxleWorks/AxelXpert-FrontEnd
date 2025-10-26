import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Button } from "../../components/ui/button";
import axios from "axios";

export default function AddEmployeeModal({ open, onClose, onCreate }) {
  const [form, setForm] = React.useState({
    email: "",
    role: "",
    branch: "",
  });
  const [branches, setBranches] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  // Fetch branches when modal opens
  React.useEffect(() => {
    if (open) {
      const fetchBranches = async () => {
        setLoading(true);
        try {
          const response = await axios.get("http://localhost:8080/api/branches/all");
          setBranches(response.data);
        } catch (err) {
          console.error("Failed to fetch branches:", err);
          setError("Failed to load branches");
        } finally {
          setLoading(false);
        }
      };
      fetchBranches();
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) {
      setForm({
        email: "",
        role: "",
        branch: "",
      });
      setError("");
    }
  }, [open]);

  const handleChange = (key) => (e) =>
    setForm((s) => ({ ...s, [key]: e.target.value }));

  const handleCreate = () => {
    if (!form.email || !form.role || !form.branch) {
      setError("All fields are required");
      return;
    }
    
    onCreate({
      email: form.email,
      role: form.role,
      branch: form.branch,
    });
    onClose();
  };

  return (
    <Dialog 
      open={!!open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        }
      }}
    >
      <DialogTitle sx={{ 
        fontSize: '1.5rem', 
        fontWeight: 600,
        pb: 2,
        pt: 3,
        px: 3,
      }}>
        Add Employee
      </DialogTitle>
      <DialogContent sx={{ px: 3, py: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 1, 
                color: 'text.secondary',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              Email
            </Typography>
            <TextField
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              fullWidth
              required
              placeholder="example@axlexpert.com"
              error={!!error && !form.email}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0b75d9',
                  },
                },
                '& .MuiInputBase-input': {
                  padding: '12px 14px',
                },
              }}
            />
          </Box>

          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 1, 
                color: 'text.secondary',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              Role
            </Typography>
            <FormControl 
              fullWidth 
              required 
              error={!!error && !form.role}
            >
              <Select
                value={form.role}
                onChange={handleChange("role")}
                displayEmpty
                sx={{
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0b75d9',
                  },
                  '& .MuiSelect-select': {
                    padding: '12px 14px',
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <Typography sx={{ color: 'text.secondary' }}>Select role</Typography>
                </MenuItem>
                <MenuItem value="USER">User</MenuItem>
                <MenuItem value="EMPLOYEE">Employee</MenuItem>
                <MenuItem value="MANAGER">Manager</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 1, 
                color: 'text.secondary',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              Branch
            </Typography>
            <FormControl 
              fullWidth 
              required 
              error={!!error && !form.branch} 
              disabled={loading}
            >
              <Select
                value={form.branch}
                onChange={handleChange("branch")}
                displayEmpty
                sx={{
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0b75d9',
                  },
                  '& .MuiSelect-select': {
                    padding: '12px 14px',
                  },
                }}
              >
                {loading ? (
                  <MenuItem disabled>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} />
                      <Typography>Loading branches...</Typography>
                    </Box>
                  </MenuItem>
                ) : branches.length === 0 ? (
                  <MenuItem value="" disabled>
                    <Typography sx={{ color: 'text.secondary' }}>No branches available</Typography>
                  </MenuItem>
                ) : (
                  [
                    <MenuItem key="placeholder" value="" disabled>
                      <Typography sx={{ color: 'text.secondary' }}>Select branch</Typography>
                    </MenuItem>,
                    ...branches.map((branch) => (
                      <MenuItem key={branch.id} value={branch.name}>
                        {branch.name}
                      </MenuItem>
                    ))
                  ]
                )}
              </Select>
            </FormControl>
          </Box>

          {error && (
            <Box sx={{ 
              color: "error.main", 
              fontSize: "0.875rem",
              mt: -1,
            }}>
              {error}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 2 }}>
        <Button 
          variant="outline" 
          onClick={onClose}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.5,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
            borderColor: 'rgba(0, 0, 0, 0.12)',
            color: 'text.primary',
            '&:hover': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleCreate}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.5,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
            backgroundColor: '#0b75d9',
            color: 'white',
            '&:hover': {
              backgroundColor: '#0765b6',
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

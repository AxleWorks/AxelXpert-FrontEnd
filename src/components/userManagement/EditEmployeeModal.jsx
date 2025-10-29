import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
} from "@mui/material";
import { Button } from "../ui/button";
import axios from "axios";
import { BRANCHES_URL, USERS_URL } from "../../config/apiEndpoints.jsx";

export default function EditEmployeeModal({ open, onClose, employee, onSave }) {
  const [form, setForm] = React.useState({
    username: "",
    role: "",
    branchId: "",
    branchName: "",
    phoneNumber: "",
    address: "",
    isActive: true,
  });
  const [branches, setBranches] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  // Fetch branches and set initial form data
  React.useEffect(() => {
    if (open && employee) {
      // Fetch fresh employee data
      setLoading(true);
      Promise.all([
        axios.get(`${USERS_URL}/${employee.id}`),
        axios.get(`${BRANCHES_URL}/all`),
      ])
        .then(([userResponse, branchesResponse]) => {
          const userData = userResponse.data;
          setForm({
            username: userData.username || "",
            role: userData.role || "",
            branchId: userData.branchId || "",
            branchName: userData.branchName || "",
            phoneNumber: userData.phoneNumber || "",
            address: userData.address || "",
            isActive: userData.isActive ?? true,
          });
          setBranches(branchesResponse.data);
        })
        .catch((err) => {
          console.error("Failed to fetch data:", err);
          setError("Failed to load data");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, employee]);

  // Reset form when modal closes
  React.useEffect(() => {
    if (!open) {
      setForm({
        username: "",
        role: "",
        branchId: "",
        branchName: "",
        phoneNumber: "",
        address: "",
        isActive: true,
      });
      setError("");
    }
  }, [open]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;

    if (field === "branchId") {
      // When branch changes, update both branchId and branchName
      const selectedBranch = branches.find((b) => b.id === value);
      setForm((s) => ({
        ...s,
        branchId: value,
        branchName: selectedBranch?.name || "",
      }));
    } else {
      setForm((s) => ({ ...s, [field]: value }));
    }
  };

  const handleSave = () => {
    if (!form.username || !form.role) {
      setError("Username and Role are required");
      return;
    }

    // Call onSave with updated data
    if (onSave) {
      onSave({
        ...employee,
        username: form.username,
        role: form.role,
        branchId: form.branchId || null,
        branchName: form.branchName,
        phoneNumber: form.phoneNumber,
        address: form.address,
        isActive: form.isActive,
      });
    }
    onClose();
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor: "background.paper",
      "& fieldset": {
        borderColor: "rgba(0, 0, 0, 0.12)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(0, 0, 0, 0.23)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#0b75d9",
      },
      "&.Mui-disabled": {
        backgroundColor: "rgba(0, 0, 0, 0.02)",
      },
    },
    "& .MuiInputBase-input": {
      padding: "12px 14px",
    },
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "rgba(0, 0, 0, 0.6)",
    },
  };

  const labelStyles = {
    mb: 1,
    color: "text.secondary",
    fontSize: "0.875rem",
    fontWeight: 500,
  };

  if (loading) {
    return (
      <Dialog
        open={!!open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogContent sx={{ px: 3, py: 4, textAlign: "center" }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading...</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={!!open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1.5rem",
          fontWeight: 600,
          pb: 2,
          pt: 3,
          px: 3,
        }}
      >
        Edit Profile
      </DialogTitle>
      <DialogContent sx={{ px: 3, py: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
          {/* User Name */}
          <Box>
            <Typography variant="body2" sx={labelStyles}>
              User Name
            </Typography>
            <TextField
              value={form.username}
              onChange={handleChange("username")}
              fullWidth
              placeholder="Enter user name"
              error={!!error && !form.username}
              sx={inputStyles}
            />
          </Box>

          {/* Email - Not Editable */}
          <Box>
            <Typography variant="body2" sx={labelStyles}>
              Email
            </Typography>
            <TextField
              value={employee?.email || ""}
              fullWidth
              disabled
              sx={inputStyles}
            />
          </Box>

          {/* Role Dropdown */}
          <Box>
            <Typography variant="body2" sx={labelStyles}>
              Role
            </Typography>
            <FormControl fullWidth error={!!error && !form.role}>
              <Select
                value={form.role}
                onChange={handleChange("role")}
                displayEmpty
                sx={{
                  borderRadius: 2,
                  backgroundColor: "background.paper",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0, 0, 0, 0.12)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0b75d9",
                  },
                  "& .MuiSelect-select": {
                    padding: "12px 14px",
                    textTransform: "capitalize",
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <Typography sx={{ color: "text.secondary" }}>
                    Select role
                  </Typography>
                </MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="employee">Employee</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Branch Dropdown */}
          <Box>
            <Typography variant="body2" sx={labelStyles}>
              Branch
            </Typography>
            <FormControl fullWidth disabled={loading}>
              <Select
                value={form.branchId}
                onChange={handleChange("branchId")}
                displayEmpty
                sx={{
                  borderRadius: 2,
                  backgroundColor: "background.paper",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0, 0, 0, 0.12)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0b75d9",
                  },
                  "& .MuiSelect-select": {
                    padding: "12px 14px",
                  },
                }}
              >
                {loading ? (
                  <MenuItem disabled>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CircularProgress size={20} />
                      <Typography>Loading branches...</Typography>
                    </Box>
                  </MenuItem>
                ) : branches.length === 0 ? (
                  <MenuItem value="" disabled>
                    <Typography sx={{ color: "text.secondary" }}>
                      No branches available
                    </Typography>
                  </MenuItem>
                ) : (
                  [
                    <MenuItem key="placeholder" value="" disabled>
                      <Typography sx={{ color: "text.secondary" }}>
                        Select branch
                      </Typography>
                    </MenuItem>,
                    ...branches.map((branch) => (
                      <MenuItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </MenuItem>
                    )),
                  ]
                )}
              </Select>
            </FormControl>
          </Box>

          {/* Phone Number */}
          <Box>
            <Typography variant="body2" sx={labelStyles}>
              Phone Number
            </Typography>
            <TextField
              value={form.phoneNumber}
              onChange={handleChange("phoneNumber")}
              fullWidth
              placeholder="Enter phone number"
              sx={inputStyles}
            />
          </Box>

          {/* Address */}
          <Box>
            <Typography variant="body2" sx={labelStyles}>
              Address
            </Typography>
            <TextField
              value={form.address}
              onChange={handleChange("address")}
              fullWidth
              placeholder="Enter address"
              sx={inputStyles}
            />
          </Box>

          {/* Status Dropdown */}
          <Box>
            <Typography variant="body2" sx={labelStyles}>
              Status
            </Typography>
            <FormControl fullWidth>
              <Select
                value={form.isActive ? "active" : "inactive"}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    isActive: e.target.value === "active",
                  }))
                }
                sx={{
                  borderRadius: 2,
                  backgroundColor: "background.paper",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0, 0, 0, 0.12)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0b75d9",
                  },
                  "& .MuiSelect-select": {
                    padding: "12px 14px",
                  },
                }}
              >
                <MenuItem value="active">
                  <Typography sx={{ color: "#10b981", fontWeight: 500 }}>
                    Active
                  </Typography>
                </MenuItem>
                <MenuItem value="inactive">
                  <Typography sx={{ color: "#f59e0b", fontWeight: 500 }}>
                    Inactive
                  </Typography>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Created At - Not Editable */}
          <Box>
            <Typography variant="body2" sx={labelStyles}>
              Created At
            </Typography>
            <TextField
              value={
                employee?.createdAt
                  ? new Date(employee.createdAt).toLocaleString()
                  : "N/A"
              }
              fullWidth
              disabled
              sx={inputStyles}
            />
          </Box>

          {error && (
            <Box
              sx={{
                color: "error.main",
                fontSize: "0.875rem",
                mt: -1,
              }}
            >
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
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 500,
            borderColor: "rgba(0, 0, 0, 0.12)",
            color: "text.primary",
            "&:hover": {
              borderColor: "rgba(0, 0, 0, 0.23)",
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.5,
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 500,
            backgroundColor: "#0b75d9",
            color: "white",
            "&:hover": {
              backgroundColor: "#0765b6",
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

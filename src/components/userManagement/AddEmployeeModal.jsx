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
  CircularProgress,
  Typography,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { Button } from "../../components/ui/button";
import { authenticatedAxios } from "../../utils/axiosConfig.js";
import { BRANCHES_URL, USERS_URL } from "../../config/apiEndpoints.jsx";
import { useAuth } from "../../contexts/AuthContext";

export default function AddEmployeeModal({ open, onClose, onCreate }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { user } = useAuth();
  const [form, setForm] = React.useState({
    email: "",
    role: "",
    branch: "",
  });
  const [branches, setBranches] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  // Fetch branches when modal opens
  React.useEffect(() => {
    if (open) {
      const fetchBranches = async () => {
        setLoading(true);
        try {
          const response = await authenticatedAxios.get(`${BRANCHES_URL}/all`);
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

  const handleCreate = async () => {
    // Validation
    if (!form.email || !form.role || !form.branch) {
      setError("All fields are required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // For managers, validate they're adding to their own branch
    if (user?.role === "manager" && user?.branchId) {
      const selectedBranch = branches.find((b) => b.name === form.branch);
      if (selectedBranch && selectedBranch.id !== user.branchId) {
        setError("You can only add employees to your own branch");
        return;
      }
    }

    setSubmitting(true);
    setError("");

    try {
      // Call backend API to add employee
      const response = await authenticatedAxios.post(
        `${USERS_URL}/add-employee`,
        {
          email: form.email,
          role: form.role,
          branch: form.branch,
        }
      );

      // Success - pass the created employee data to parent
      onCreate(response.data);
      onClose();
    } catch (err) {
      console.error("Failed to add employee:", err);

      // Handle different error scenarios
      if (err.response) {
        if (err.response.status === 400) {
          // Bad request - validation error or email exists
          setError(
            err.response.data || "Invalid data. Please check your inputs."
          );
        } else if (err.response.status === 403) {
          // Forbidden - manager trying to add to wrong branch
          setError(
            err.response.data || "You can only add employees to your own branch"
          );
        } else if (err.response.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("Failed to add employee. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setSubmitting(false);
    }
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
    },
    "& .MuiInputBase-input": {
      padding: "12px 14px",
    },
  };

  const labelStyles = {
    mb: 1,
    color: "text.secondary",
    fontSize: "0.875rem",
    fontWeight: 500,
  };

  const selectStyles = {
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
  };

  return (
    <Dialog
      open={!!open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          bgcolor: isDark ? "grey.900" : "background.paper",
          backgroundImage: "none",
          borderRadius: 3,
          boxShadow: isDark
            ? "0 20px 60px rgba(0, 0, 0, 0.6)"
            : "0 20px 60px rgba(0, 0, 0, 0.15)",
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(10px)",
            backgroundColor: isDark
              ? "rgba(0, 0, 0, 0.75)"
              : "rgba(0, 0, 0, 0.4)",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
          pt: 3,
          px: 3,
          borderBottom: 1,
          borderColor: isDark ? "grey.800" : "grey.200",
          bgcolor: isDark
            ? alpha(theme.palette.success.dark, 0.05)
            : alpha(theme.palette.success.light, 0.05),
        }}
      >
        <Box
          sx={{
            fontSize: "1.35rem",
            fontWeight: 700,
            color: isDark ? "grey.50" : "grey.900",
            letterSpacing: "-0.02em",
          }}
        >
          Add Employee
        </Box>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          size="small"
          sx={{
            color: isDark ? "grey.400" : "grey.600",
            transition: "all 0.2s ease",
            "&:hover": {
              color: isDark ? "grey.100" : "grey.900",
              bgcolor: isDark
                ? alpha(theme.palette.error.dark, 0.2)
                : alpha(theme.palette.error.light, 0.15),
              transform: "rotate(90deg)",
            },
          }}
        >
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: 3, py: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
          {/* Email */}
          <Box>
            <Typography variant="body2" sx={labelStyles}>
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
              sx={inputStyles}
            />
          </Box>

          {/* Role */}
          <Box>
            <Typography variant="body2" sx={labelStyles}>
              Role
            </Typography>
            <FormControl fullWidth required error={!!error && !form.role}>
              <Select
                value={form.role}
                onChange={handleChange("role")}
                displayEmpty
                sx={selectStyles}
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

          {/* Branch */}
          <Box>
            <Typography variant="body2" sx={labelStyles}>
              Branch
              {user?.role === "manager" && (
                <Typography
                  component="span"
                  sx={{ color: "text.secondary", fontSize: "0.75rem", ml: 1 }}
                >
                  (You can only add to your branch)
                </Typography>
              )}
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
                sx={selectStyles}
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
                      <MenuItem key={branch.id} value={branch.name}>
                        {branch.name}
                      </MenuItem>
                    )),
                  ]
                )}
              </Select>
            </FormControl>
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
          onClick={handleCreate}
          disabled={submitting}
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
            "&:disabled": {
              backgroundColor: "#a0c4e8",
              color: "white",
            },
          }}
        >
          {submitting ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={16} sx={{ color: "white" }} />
              <span>Saving...</span>
            </Box>
          ) : (
            "Save"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

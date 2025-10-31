import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Typography,
  IconButton,
  MenuItem,
  useTheme,
  alpha,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { Button } from "../ui/button";

const BranchFormDialog = ({
  open,
  onClose,
  branch,
  onChange,
  onSave,
  managers = [],
  loadingManagers = false,
  mode = "add", // "add" or "edit"
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: isDark
            ? `0 20px 60px ${alpha(theme.palette.common.black, 0.6)}`
            : `0 20px 60px ${alpha(theme.palette.primary.main, 0.15)}`,
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(10px)",
          backgroundColor: isDark
            ? "rgba(0, 0, 0, 0.75)"
            : "rgba(0, 0, 0, 0.4)",
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle
          sx={{
            background: isDark
              ? `linear-gradient(135deg, ${alpha(
                  theme.palette.success.dark,
                  0.2
                )}, ${alpha(theme.palette.success.main, 0.1)})`
              : `linear-gradient(135deg, ${alpha(
                  theme.palette.success.light,
                  0.15
                )}, ${alpha(theme.palette.success.main, 0.05)})`,
            borderBottom: 1,
            borderColor: isDark ? "grey.800" : "grey.200",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 2.5,
            px: 3,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {mode === "add" ? "Add New Branch" : "Edit Branch"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {mode === "add"
                ? "Create a new service center"
                : "Update branch information"}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: isDark ? "grey.400" : "grey.600",
              transition: "all 0.2s ease",
              "&:hover": {
                color: isDark ? "grey.200" : "grey.800",
                transform: "rotate(90deg)",
                bgcolor: isDark
                  ? alpha(theme.palette.grey[700], 0.3)
                  : alpha(theme.palette.grey[300], 0.3),
              },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 4, px: 3, pb: 2, mt: 2 }}>
          <Box display="flex" flexDirection="column" gap={2.5}>
            <TextField
              label="Branch Name"
              fullWidth
              required
              value={branch?.name || ""}
              onChange={(e) => onChange({ ...branch, name: e.target.value })}
              sx={{
                mt: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: isDark
                      ? alpha(theme.palette.success.dark, 0.05)
                      : alpha(theme.palette.success.light, 0.05),
                  },
                  "&.Mui-focused": {
                    bgcolor: isDark
                      ? alpha(theme.palette.success.dark, 0.08)
                      : alpha(theme.palette.success.light, 0.08),
                  },
                },
              }}
            />

            <TextField
              label="Address"
              fullWidth
              required
              multiline
              rows={2}
              value={branch?.address || ""}
              onChange={(e) => onChange({ ...branch, address: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: isDark
                      ? alpha(theme.palette.success.dark, 0.05)
                      : alpha(theme.palette.success.light, 0.05),
                  },
                  "&.Mui-focused": {
                    bgcolor: isDark
                      ? alpha(theme.palette.success.dark, 0.08)
                      : alpha(theme.palette.success.light, 0.08),
                  },
                },
              }}
            />

            <Box display="flex" gap={2}>
              <TextField
                label="Opening Hours"
                type="time"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={branch?.openHours || ""}
                onChange={(e) =>
                  onChange({ ...branch, openHours: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: isDark
                        ? alpha(theme.palette.warning.dark, 0.05)
                        : alpha(theme.palette.warning.light, 0.05),
                    },
                    "&.Mui-focused": {
                      bgcolor: isDark
                        ? alpha(theme.palette.warning.dark, 0.08)
                        : alpha(theme.palette.warning.light, 0.08),
                    },
                  },
                }}
              />

              <TextField
                label="Closing Hours"
                type="time"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={branch?.closeHours || ""}
                onChange={(e) =>
                  onChange({ ...branch, closeHours: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: isDark
                        ? alpha(theme.palette.warning.dark, 0.05)
                        : alpha(theme.palette.warning.light, 0.05),
                    },
                    "&.Mui-focused": {
                      bgcolor: isDark
                        ? alpha(theme.palette.warning.dark, 0.08)
                        : alpha(theme.palette.warning.light, 0.08),
                    },
                  },
                }}
              />
            </Box>

            <TextField
              label="Manager"
              select
              fullWidth
              required
              value={branch?.managerId || ""}
              onChange={(e) =>
                onChange({ ...branch, managerId: e.target.value })
              }
              helperText={
                loadingManagers
                  ? "Loading managers..."
                  : managers.length === 0
                  ? "No managers available"
                  : "Select a manager for this branch"
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: isDark
                      ? alpha(theme.palette.primary.dark, 0.05)
                      : alpha(theme.palette.primary.light, 0.05),
                  },
                  "&.Mui-focused": {
                    bgcolor: isDark
                      ? alpha(theme.palette.primary.dark, 0.08)
                      : alpha(theme.palette.primary.light, 0.08),
                  },
                },
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      maxHeight: 300,
                      borderRadius: 2,
                      mt: 0.5,
                      boxShadow: isDark
                        ? `0 8px 32px ${alpha(theme.palette.common.black, 0.4)}`
                        : `0 8px 32px ${alpha(theme.palette.grey[900], 0.1)}`,
                    },
                  },
                },
              }}
            >
              {loadingManagers ? (
                <MenuItem disabled>Loading...</MenuItem>
              ) : managers.length === 0 ? (
                <MenuItem disabled>No managers available</MenuItem>
              ) : (
                managers.map((manager) => (
                  <MenuItem key={manager.id} value={manager.id}>
                    {manager.username} ({manager.email})
                  </MenuItem>
                ))
              )}
            </TextField>

            <TextField
              label="Phone Number"
              fullWidth
              value={branch?.phone || ""}
              onChange={(e) => onChange({ ...branch, phone: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: isDark
                      ? alpha(theme.palette.info.dark, 0.05)
                      : alpha(theme.palette.info.light, 0.05),
                  },
                  "&.Mui-focused": {
                    bgcolor: isDark
                      ? alpha(theme.palette.info.dark, 0.08)
                      : alpha(theme.palette.info.light, 0.08),
                  },
                },
              }}
            />

            <TextField
              label="Email"
              type="email"
              fullWidth
              value={branch?.email || ""}
              onChange={(e) => onChange({ ...branch, email: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: isDark
                      ? alpha(theme.palette.info.dark, 0.05)
                      : alpha(theme.palette.info.light, 0.05),
                  },
                  "&.Mui-focused": {
                    bgcolor: isDark
                      ? alpha(theme.palette.info.dark, 0.08)
                      : alpha(theme.palette.info.light, 0.08),
                  },
                },
              }}
            />

            <TextField
              label="Map Link (Optional)"
              fullWidth
              value={branch?.mapLink || ""}
              onChange={(e) => onChange({ ...branch, mapLink: e.target.value })}
              placeholder="https://maps.google.com/..."
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: isDark
                      ? alpha(theme.palette.grey[700], 0.3)
                      : alpha(theme.palette.grey[300], 0.3),
                  },
                  "&.Mui-focused": {
                    bgcolor: isDark
                      ? alpha(theme.palette.grey[700], 0.4)
                      : alpha(theme.palette.grey[300], 0.4),
                  },
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
            pt: 2,
            gap: 1.5,
            bgcolor: isDark
              ? alpha(theme.palette.background.paper, 0.4)
              : alpha(theme.palette.grey[50], 0.5),
            borderTop: 1,
            borderColor: isDark ? "grey.800" : "grey.200",
          }}
        >
          <Button
            onClick={onClose}
            variant="outline"
            sx={{
              borderRadius: 2,
              px: 3,
              borderColor: isDark ? "grey.700" : "grey.300",
              "&:hover": {
                borderColor: isDark ? "grey.600" : "grey.400",
                bgcolor: isDark
                  ? alpha(theme.palette.grey[800], 0.5)
                  : alpha(theme.palette.grey[200], 0.5),
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              borderRadius: 2,
              px: 4,
              bgcolor: isDark ? "success.dark" : "success.main",
              boxShadow: isDark
                ? `0 4px 14px ${alpha(theme.palette.success.dark, 0.4)}`
                : `0 4px 14px ${alpha(theme.palette.success.main, 0.3)}`,
              "&:hover": {
                bgcolor: isDark ? "success.main" : "success.dark",
                boxShadow: isDark
                  ? `0 6px 20px ${alpha(theme.palette.success.dark, 0.5)}`
                  : `0 6px 20px ${alpha(theme.palette.success.main, 0.4)}`,
              },
            }}
          >
            {mode === "add" ? "Add Branch" : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BranchFormDialog;

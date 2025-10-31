import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  TableContainer,
  Paper,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  TableSortLabel,
  IconButton,
  MenuItem,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

import { USERS_URL } from "../../config/apiEndpoints.jsx";
import { createAuthenticatedFetchOptions } from "../../utils/jwtUtils.js";

export default function BranchesComponent({
  branches,
  isManager,
  onAdd,
  onEdit,
  onDelete,
}) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [currentBranch, setCurrentBranch] = useState(null);
  const [managers, setManagers] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [loadingManagers, setLoadingManagers] = useState(false);

  useEffect(() => {
    if (isManager) {
      const fetchManagers = async () => {
        setLoadingManagers(true);
        try {
          const fetchOptions = createAuthenticatedFetchOptions({
            method: "GET",
          });
          console.log("Fetching managers from:", `${USERS_URL}/managers`);
          console.log("Request headers:", fetchOptions.headers);

          const response = await fetch(`${USERS_URL}/managers`, fetchOptions);
          console.log("Managers response status:", response.status);

          if (response.ok) {
            const data = await response.json();
            console.log("Managers data:", data);
            // Sort managers alphabetically by username
            const sortedManagers = data.sort((a, b) =>
              a.username.toLowerCase().localeCompare(b.username.toLowerCase())
            );
            setManagers(sortedManagers);
          } else {
            const errorText = await response.text();
            console.error(
              "Failed to fetch managers:",
              response.status,
              errorText
            );
          }
        } catch (error) {
          console.error("Error fetching managers:", error);
        } finally {
          setLoadingManagers(false);
        }
      };
      fetchManagers();
    }
  }, [isManager]);

  const handleEditClick = (branch) => {
    setCurrentBranch(branch);
    setEditDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setCurrentBranch(null);
  };

  const handleConfirm = async () => {
    if (confirmAction) {
      await confirmAction();
    }
    setConfirmDialogOpen(false);
    setConfirmAction(null);
  };

  const handleDeleteClick = (branchId) => {
    setConfirmAction(() => () => onDelete(branchId));
    setConfirmDialogOpen(true);
  };

  const handleAddSave = async () => {
    setConfirmAction(() => async () => {
      if (currentBranch) {
        await onAdd(currentBranch);
      }
      setAddDialogOpen(false);
      setCurrentBranch(null);
    });
    setConfirmDialogOpen(true);
  };

  const handleSave = async () => {
    setConfirmAction(() => async () => {
      if (currentBranch) {
        await onEdit(currentBranch);
      }
      setEditDialogOpen(false);
      setCurrentBranch(null);
    });
    setConfirmDialogOpen(true);
  };

  const handleAddClick = () => {
    setCurrentBranch({
      name: "",
      address: "",
      openHours: "",
      closeHours: "",
      managerId: "",
      phone: "",
      locationLink: "",
    });
    setAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
    setCurrentBranch(null);
  };

  // Sorting helpers
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const descendingComparator = (a, b, orderBy) => {
    let aValue = a[orderBy];
    let bValue = b[orderBy];
    if (aValue == null) aValue = "";
    if (bValue == null) bValue = "";
    if (typeof aValue === "string") aValue = aValue.toLowerCase();
    if (typeof bValue === "string") bValue = bValue.toLowerCase();
    if (bValue < aValue) return -1;
    if (bValue > aValue) return 1;
    return 0;
  };
  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };
  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  // Filter and sort branches
  const filteredBranches = branches.filter(
    (branch) =>
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (branch.address &&
        branch.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (branch.managerName &&
        branch.managerName.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const sortedBranches = stableSort(
    filteredBranches,
    getComparator(order, orderBy)
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Service Centers
      </Typography>
      <Card sx={{ borderRadius: 3 }}>
        <CardHeader>
          <CardTitle>Branches</CardTitle>
        </CardHeader>
        <CardContent>
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextField
              placeholder="Search branches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              sx={{
                flexGrow: 1,
                mr: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />
            {isManager && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddClick}
                sx={{ borderRadius: 2 }}
              >
                Add Branch
              </Button>
            )}
          </Box>
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
                      Branch Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    <TableSortLabel
                      active={orderBy === "address"}
                      direction={orderBy === "address" ? order : "asc"}
                      onClick={() => handleRequestSort("address")}
                    >
                      Address
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    <TableSortLabel
                      active={orderBy === "openHours"}
                      direction={orderBy === "openHours" ? order : "asc"}
                      onClick={() => handleRequestSort("openHours")}
                    >
                      Open Hours
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    <TableSortLabel
                      active={orderBy === "closeHours"}
                      direction={orderBy === "closeHours" ? order : "asc"}
                      onClick={() => handleRequestSort("closeHours")}
                    >
                      Close Hours
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Manager</TableCell>
                  {isManager && (
                    <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                      Actions
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedBranches.map((branch) => (
                  <TableRow key={branch.id}>
                    <TableCell>{branch.name}</TableCell>
                    <TableCell>{branch.address || "-"}</TableCell>
                    <TableCell>{branch.openHours || "-"}</TableCell>
                    <TableCell>{branch.closeHours || "-"}</TableCell>
                    <TableCell>{branch.managerName || "-"}</TableCell>
                    {isManager && (
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => handleEditClick(branch)}
                          size="small"
                          sx={{ mr: 0.5 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(branch.id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Confirm Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        fullWidth
        sx={{
          "& .MuiBackdrop-root": {
            backdropFilter: "blur(4px)",
          },
        }}
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to proceed?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}
        fullWidth
        sx={{
          "& .MuiBackdrop-root": {
            backdropFilter: "blur(4px)",
          },
        }}
      >
        <DialogTitle>Add New Branch</DialogTitle>
        <DialogContent>
          <TextField
            label="Branch Name"
            fullWidth
            margin="normal"
            value={currentBranch?.name || ""}
            onChange={(e) =>
              setCurrentBranch({ ...currentBranch, name: e.target.value })
            }
          />
          <TextField
            label="Address"
            fullWidth
            margin="normal"
            value={currentBranch?.address || ""}
            onChange={(e) =>
              setCurrentBranch({ ...currentBranch, address: e.target.value })
            }
          />
          <TextField
            label="Open Hours"
            type="time"
            fullWidth
            margin="normal"
            value={currentBranch?.openHours || ""}
            onChange={(e) =>
              setCurrentBranch({ ...currentBranch, openHours: e.target.value })
            }
          />
          <TextField
            label="Close Hours"
            type="time"
            fullWidth
            margin="normal"
            value={currentBranch?.closeHours || ""}
            onChange={(e) =>
              setCurrentBranch({ ...currentBranch, closeHours: e.target.value })
            }
          />
          <TextField
            label="Manager"
            select
            fullWidth
            margin="normal"
            value={currentBranch?.managerId || ""}
            onChange={(e) =>
              setCurrentBranch({ ...currentBranch, managerId: e.target.value })
            }
            helperText={
              loadingManagers
                ? "Loading managers..."
                : managers.length === 0
                ? "No managers available"
                : "Select a manager for this branch"
            }
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  style: {
                    maxHeight: 300,
                    overflow: "auto",
                    fontSize: 14, // Smaller text
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
            label="Phone"
            fullWidth
            margin="normal"
            value={currentBranch?.phone || ""}
            onChange={(e) =>
              setCurrentBranch({ ...currentBranch, phone: e.target.value })
            }
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={currentBranch?.email || ""}
            onChange={(e) =>
              setCurrentBranch({ ...currentBranch, email: e.target.value })
            }
          />
          <TextField
            label="Map Link"
            fullWidth
            margin="normal"
            value={currentBranch?.mapLink || ""}
            onChange={(e) =>
              setCurrentBranch({
                ...currentBranch,
                mapLink: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button onClick={handleAddSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleDialogClose}
        fullWidth
        sx={{
          "& .MuiBackdrop-root": {
            backdropFilter: "blur(4px)",
          },
        }}
      >
        <DialogTitle>Edit Branch</DialogTitle>
        <DialogContent>
          <TextField
            label="Branch Name"
            fullWidth
            margin="normal"
            value={currentBranch?.name || ""}
            onChange={(e) =>
              setCurrentBranch({ ...currentBranch, name: e.target.value })
            }
          />
          <TextField
            label="Address"
            fullWidth
            margin="normal"
            value={currentBranch?.address || ""}
            onChange={(e) =>
              setCurrentBranch({ ...currentBranch, address: e.target.value })
            }
          />
          <TextField
            label="Open Hours"
            type="time"
            fullWidth
            margin="normal"
            value={currentBranch?.openHours || ""}
            onChange={(e) =>
              setCurrentBranch({ ...currentBranch, openHours: e.target.value })
            }
          />
          <TextField
            label="Close Hours"
            type="time"
            fullWidth
            margin="normal"
            value={currentBranch?.closeHours || ""}
            onChange={(e) =>
              setCurrentBranch({ ...currentBranch, closeHours: e.target.value })
            }
          />
          <TextField
            label="Manager"
            select
            fullWidth
            margin="normal"
            value={currentBranch?.managerId || ""}
            onChange={(e) =>
              setCurrentBranch({ ...currentBranch, managerId: e.target.value })
            }
            helperText={
              loadingManagers
                ? "Loading managers..."
                : managers.length === 0
                ? "No managers available"
                : "Select a manager for this branch"
            }
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  style: {
                    maxHeight: 300,
                    overflow: "auto",
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
            label="Phone"
            fullWidth
            margin="normal"
            value={currentBranch?.phone || ""}
            onChange={(e) =>
              setCurrentBranch({ ...currentBranch, phone: e.target.value })
            }
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={currentBranch?.email || ""}
            onChange={(e) =>
              setCurrentBranch({ ...currentBranch, email: e.target.value })
            }
          />
          <TextField
            label="Map Link"
            fullWidth
            margin="normal"
            value={currentBranch?.mapLink || ""}
            onChange={(e) =>
              setCurrentBranch({
                ...currentBranch,
                mapLink: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Badge,
} from "@mui/material";
import {
  LocationOnIcon,
  EditIcon,
  Trash2Icon,
  SearchIcon,
  PlusIcon,
} from "lucide-react";
import { API_BASE, API_PREFIX, USERS_URL } from "../../config/apiEndpoints";
import axios from "axios";

const BranchesComponent = () => {
  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    openHours: "",
    closeHours: "",
    managerName: "",
    status: "Active",
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, branches]);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}${API_PREFIX}/branches`);
      setBranches(response.data);
      setFilteredBranches(response.data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredBranches(branches);
      return;
    }

    const filtered = branches.filter((branch) =>
      Object.values(branch).some((value) =>
        value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredBranches(filtered);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
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

  const handleEditClick = (branch) => {
    setSelectedBranch(branch);
    setFormData({
      name: branch.name || "",
      address: branch.address || "",
      openHours: branch.openHours || "",
      closeHours: branch.closeHours || "",
      managerName: branch.managerName || "",
      status: branch.status || "Active",
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (branchId) => {
    setBranchToDelete(branchId);
    setConfirmDialogOpen(true);
  };

  const handleAddClick = () => {
    setFormData({
      name: "",
      address: "",
      openHours: "",
      closeHours: "",
      managerName: "",
      status: "Active",
    });
    setAddDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE}${API_PREFIX}/branches/${branchToDelete}`);
      fetchBranches();
      setConfirmDialogOpen(false);
      setBranchToDelete(null);
    } catch (error) {
      console.error("Error deleting branch:", error);
    }
  };

  const handleSave = async () => {
    try {
      if (selectedBranch) {
        // Edit existing branch
        await axios.put(
          `${API_BASE}${API_PREFIX}/branches/${selectedBranch.id}`,
          formData
        );
      } else {
        // Add new branch
        await axios.post(`${API_BASE}${API_PREFIX}/branches`, formData);
      }
      fetchBranches();
      setEditDialogOpen(false);
      setAddDialogOpen(false);
      setSelectedBranch(null);
    } catch (error) {
      console.error("Error saving branch:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <Typography>Loading branches...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Branches Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<PlusIcon />}
          onClick={handleAddClick}
        >
          Add Branch
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search branches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "name"}
                      direction={orderBy === "name" ? order : "asc"}
                      onClick={() => handleRequestSort("name")}
                    >
                      Branch Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "openHours"}
                      direction={orderBy === "openHours" ? order : "asc"}
                      onClick={() => handleRequestSort("openHours")}
                    >
                      Open Hours
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "closeHours"}
                      direction={orderBy === "closeHours" ? order : "asc"}
                      onClick={() => handleRequestSort("closeHours")}
                    >
                      Close Hours
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "managerName"}
                      direction={orderBy === "managerName" ? order : "asc"}
                      onClick={() => handleRequestSort("managerName")}
                    >
                      Manager
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "status"}
                      direction={orderBy === "status" ? order : "asc"}
                      onClick={() => handleRequestSort("status")}
                    >
                      Status
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stableSort(
                  filteredBranches,
                  getComparator(order, orderBy)
                ).map((branch) => (
                  <TableRow key={branch.id}>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            bgcolor: "primary.light",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <LocationOnIcon sx={{ color: "white" }} />
                        </Box>
                        <Typography variant="body2" fontWeight="medium">
                          {branch.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{branch.openHours || "N/A"}</TableCell>
                    <TableCell>{branch.closeHours || "N/A"}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ wordBreak: "break-word" }}
                      >
                        {branch.address}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {branch.managerName || "Not assigned"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        color={
                          branch.status === "Active" ? "success" : "secondary"
                        }
                      >
                        {branch.status || "Open"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditClick(branch)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          startIcon={<Trash2Icon />}
                          onClick={() => handleDeleteClick(branch.id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
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
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiBackdrop-root": {
            backdropFilter: "blur(4px)",
          },
        }}
      >
        <DialogTitle>Edit Branch</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Branch Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              fullWidth
            />
            <TextField
              label="Address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Open Hours"
              value={formData.openHours}
              onChange={(e) => handleInputChange("openHours", e.target.value)}
              fullWidth
            />
            <TextField
              label="Close Hours"
              value={formData.closeHours}
              onChange={(e) => handleInputChange("closeHours", e.target.value)}
              fullWidth
            />
            <TextField
              label="Manager Name"
              value={formData.managerName}
              onChange={(e) => handleInputChange("managerName", e.target.value)}
              fullWidth
            />
            <TextField
              label="Status"
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiBackdrop-root": {
            backdropFilter: "blur(4px)",
          },
        }}
      >
        <DialogTitle>Add New Branch</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Branch Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              fullWidth
            />
            <TextField
              label="Address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Open Hours"
              value={formData.openHours}
              onChange={(e) => handleInputChange("openHours", e.target.value)}
              fullWidth
            />
            <TextField
              label="Close Hours"
              value={formData.closeHours}
              onChange={(e) => handleInputChange("closeHours", e.target.value)}
              fullWidth
            />
            <TextField
              label="Manager Name"
              value={formData.managerName}
              onChange={(e) => handleInputChange("managerName", e.target.value)}
              fullWidth
            />
            <TextField
              label="Status"
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Add Branch
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BranchesComponent;

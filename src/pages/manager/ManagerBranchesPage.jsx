import React, { useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating as MuiRating,
} from "@mui/material";
import {
  Add,
  Search,
  Edit,
  Delete,
  LocationOn,
  Business,
  Star,
  Phone
} from "@mui/icons-material";
import ManagerLayout from "../../layouts/manager/ManagerLayout";

const ManagerBranchesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddBranchDialog, setOpenAddBranchDialog] = useState(false);
  const [openEditBranchDialog, setOpenEditBranchDialog] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  
  const [newBranch, setNewBranch] = useState({
    name: "",
    location: "",
    manager: "",
    contact: "",
    status: "Active",
  });
  
  const [editBranch, setEditBranch] = useState({
    id: null,
    name: "",
    location: "",
    manager: "",
    contact: "",
    status: "Active",
  });
  
  // Mock data for branches
  const [branches, setBranches] = useState([
    {
      id: 1,
      name: "Downtown Service Center",
      location: "123 Main Street, Downtown, CA 90001",
      manager: "Sarah Johnson",
      contact: "(555) 123-4567",
      rating: 4.8,
      status: "Active",
    },
    {
      id: 2,
      name: "Westside Auto Care",
      location: "456 West Avenue, Westside, CA 90002",
      manager: "Michael Chen",
      contact: "(555) 234-5678",
      rating: 4.6,
      status: "Active",
    },
    {
      id: 3,
      name: "North Branch Center",
      location: "789 North Road, Northside, CA 90003",
      manager: "David Martinez",
      contact: "(555) 345-6789",
      rating: 4.5,
      status: "Active",
    },
    {
      id: 4,
      name: "South Service Hub",
      location: "321 South Boulevard, Southside, CA 90004",
      manager: "Emily Thompson",
      contact: "(555) 456-7890",
      rating: 4.9,
      status: "Active",
    },
  ]);

  const activeBranches = branches.filter(branch => branch.status === "Active");
  
  const calculateAvgRating = () => {
    const totalRating = branches.reduce((sum, branch) => sum + branch.rating, 0);
    return (totalRating / branches.length).toFixed(1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredBranches = branches.filter((branch) => {
    return (
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.manager.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleAddBranchOpen = () => {
    setOpenAddBranchDialog(true);
  };

  const handleAddBranchClose = () => {
    setOpenAddBranchDialog(false);
  };

  const handleEditBranchOpen = (branch) => {
    setSelectedBranch(branch);
    setEditBranch({ ...branch });
    setOpenEditBranchDialog(true);
  };

  const handleEditBranchClose = () => {
    setOpenEditBranchDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBranch({
      ...newBranch,
      [name]: value,
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditBranch({
      ...editBranch,
      [name]: value,
    });
  };

  const handleEditRatingChange = (newValue) => {
    setEditBranch({
      ...editBranch,
      rating: newValue,
    });
  };

  const handleAddBranch = () => {
    const newBranchData = {
      id: branches.length + 1,
      ...newBranch,
      rating: 0,
    };
    
    setBranches([...branches, newBranchData]);
    setNewBranch({
      name: "",
      location: "",
      manager: "",
      contact: "",
      status: "Active",
    });
    handleAddBranchClose();
  };

  const handleEditBranchSave = () => {
    const updatedBranches = branches.map(branch => 
      branch.id === editBranch.id ? { ...editBranch } : branch
    );
    
    setBranches(updatedBranches);
    handleEditBranchClose();
  };

  const handleDeleteBranch = (branchId) => {
    const updatedBranches = branches.filter(branch => branch.id !== branchId);
    setBranches(updatedBranches);
  };

  return (
    <ManagerLayout>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Branch Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage service center locations and details
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddBranchOpen}
          sx={{ borderRadius: 2 }}
        >
          Add Branch
        </Button>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search branches..."
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            sx: { borderRadius: 4, bgcolor: "background.paper" }
          }}
        />
      </Box>

      {/* Stats Cards */}
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
              {branches.length}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Total Branches
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            bgcolor: '#e0f2fe', 
            width: 56, 
            height: 56, 
            borderRadius: '50%' 
          }}>
            <LocationOn sx={{ color: '#3b82f6' }} />
          </Box>
        </Box>
        
        <Box sx={{ flex: 1, display: 'flex', borderRadius: 2, bgcolor: '#1e293b', p: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              {activeBranches.length}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Active
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            bgcolor: '#dcfce7', 
            width: 56, 
            height: 56, 
            borderRadius: '50%' 
          }}>
            <Business sx={{ color: '#22c55e' }} />
          </Box>
        </Box>
        
        <Box sx={{ flex: 1, display: 'flex', borderRadius: 2, bgcolor: '#1e293b', p: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              {calculateAvgRating()}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Avg Rating
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            bgcolor: '#fef3c7', 
            width: 56, 
            height: 56, 
            borderRadius: '50%' 
          }}>
            <Star sx={{ color: '#f59e0b' }} />
          </Box>
        </Box>
      </Box>

      {/* Branches Table */}
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, overflow: "hidden" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          All Branches ({branches.length})
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Branch Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Manager</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBranches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell>{branch.name}</TableCell>
                  <TableCell>{branch.location}</TableCell>
                  <TableCell>{branch.manager}</TableCell>
                  <TableCell>{branch.contact}</TableCell>
                  <TableCell>
                    <Chip
                      label={branch.status}
                      color={branch.status === "Active" ? "success" : "warning"}
                      size="small"
                      sx={{ 
                        borderRadius: 1,
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleEditBranchOpen(branch)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<Delete />}
                        onClick={() => handleDeleteBranch(branch.id)}
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
      </Paper>

      {/* Add Branch Dialog */}
      <Dialog open={openAddBranchDialog} onClose={handleAddBranchClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Branch</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Branch Name"
              name="name"
              value={newBranch.name}
              onChange={handleInputChange}
              margin="dense"
              required
            />
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={newBranch.location}
              onChange={handleInputChange}
              margin="dense"
              required
            />
            <TextField
              fullWidth
              label="Manager"
              name="manager"
              value={newBranch.manager}
              onChange={handleInputChange}
              margin="dense"
              required
            />
            <TextField
              fullWidth
              label="Contact Number"
              name="contact"
              value={newBranch.contact}
              onChange={handleInputChange}
              margin="dense"
              required
            />
            <FormControl fullWidth margin="dense" required>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={newBranch.status}
                label="Status"
                onChange={handleInputChange}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddBranchClose}>Cancel</Button>
          <Button 
            onClick={handleAddBranch} 
            variant="contained" 
            disabled={!newBranch.name || !newBranch.location || !newBranch.manager || !newBranch.contact}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Branch Dialog */}
      <Dialog open={openEditBranchDialog} onClose={handleEditBranchClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Branch</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Branch Name"
              name="name"
              value={editBranch.name}
              onChange={handleEditInputChange}
              margin="dense"
              required
            />
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={editBranch.location}
              onChange={handleEditInputChange}
              margin="dense"
              required
            />
            <TextField
              fullWidth
              label="Manager"
              name="manager"
              value={editBranch.manager}
              onChange={handleEditInputChange}
              margin="dense"
              required
            />
            <TextField
              fullWidth
              label="Contact Number"
              name="contact"
              value={editBranch.contact}
              onChange={handleEditInputChange}
              margin="dense"
              required
            />
            <FormControl fullWidth margin="dense" required>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={editBranch.status}
                label="Status"
                onChange={handleEditInputChange}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
              <Typography variant="body1" sx={{ mr: 2 }}>Rating:</Typography>
              <MuiRating
                name="rating"
                value={Number(editBranch.rating)}
                onChange={(event, newValue) => handleEditRatingChange(newValue)}
                precision={0.1}
              />
              <Typography variant="body2" sx={{ ml: 2 }}>
                {editBranch.rating}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditBranchClose}>Cancel</Button>
          <Button 
            onClick={handleEditBranchSave} 
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </ManagerLayout>
  );
};

export default ManagerBranchesPage;

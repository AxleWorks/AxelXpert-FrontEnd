import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  alpha,
  useTheme,
  Alert,
  Snackbar,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import BranchCard from "./BranchCard";
import BranchFormDialog from "./BranchFormDialog";
import DeleteBranchDialog from "./DeleteBranchDialog";

import { USERS_URL } from "../../config/apiEndpoints.jsx";
import { createAuthenticatedFetchOptions } from "../../utils/jwtUtils.js";

export default function BranchesComponent({
  branches,
  isManager,
  onAdd,
  onEdit,
  onDelete,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentBranch, setCurrentBranch] = useState(null);
  const [branchToDelete, setBranchToDelete] = useState(null);
  const [managers, setManagers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingManagers, setLoadingManagers] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleDeleteClick = (branchId) => {
    const branch = branches.find((b) => b.id === branchId);
    setBranchToDelete(branch);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (branchToDelete) {
      try {
        await onDelete(branchToDelete.id);
        setSuccessMessage("Branch deleted successfully");
      } catch (error) {
        setErrorMessage("Failed to delete branch");
      }
    }
    setDeleteDialogOpen(false);
    setBranchToDelete(null);
  };

  const handleAddClick = () => {
    setCurrentBranch({
      name: "",
      address: "",
      openHours: "",
      closeHours: "",
      managerId: "",
      phone: "",
      email: "",
      mapLink: "",
    });
    setAddDialogOpen(true);
  };

  const handleSaveAdd = async () => {
    try {
      await onAdd(currentBranch);
      setSuccessMessage("Branch added successfully");
      setAddDialogOpen(false);
      setCurrentBranch(null);
    } catch (error) {
      setErrorMessage("Failed to add branch");
    }
  };

  const handleSaveEdit = async () => {
    try {
      await onEdit(currentBranch);
      setSuccessMessage("Branch updated successfully");
      setEditDialogOpen(false);
      setCurrentBranch(null);
    } catch (error) {
      setErrorMessage("Failed to update branch");
    }
  };

  // Filter branches
  const filteredBranches = branches.filter(
    (branch) =>
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (branch.address &&
        branch.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (branch.managerName &&
        branch.managerName.toLowerCase().includes(searchQuery.toLowerCase()))
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

          {/* Success/Error Alerts */}
          <Snackbar
            open={!!successMessage}
            autoHideDuration={4000}
            onClose={() => setSuccessMessage("")}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSuccessMessage("")}
              severity="success"
              sx={{ width: "100%" }}
            >
              {successMessage}
            </Alert>
          </Snackbar>

          <Snackbar
            open={!!errorMessage}
            autoHideDuration={6000}
            onClose={() => setErrorMessage("")}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={() => setErrorMessage("")}
              severity="error"
              sx={{ width: "100%" }}
            >
              {errorMessage}
            </Alert>
          </Snackbar>

          {/* Branches Grid */}
          {filteredBranches.length === 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              py={8}
              sx={{
                bgcolor: isDark
                  ? alpha(theme.palette.background.paper, 0.4)
                  : "grey.50",
                borderRadius: 3,
                border: 1,
                borderColor: isDark ? "grey.800" : "grey.200",
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                gutterBottom
                fontWeight={600}
              >
                No branches found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchQuery
                  ? "Try adjusting your search query"
                  : isManager
                  ? "Click 'Add Branch' to create your first branch"
                  : "Check back later for available branches"}
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredBranches.map((branch) => (
                <Grid item xs={12} sm={6} md={4} key={branch.id}>
                  <BranchCard
                    branch={branch}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    isManager={isManager}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Add Branch Dialog */}
      <BranchFormDialog
        open={addDialogOpen}
        onClose={() => {
          setAddDialogOpen(false);
          setCurrentBranch(null);
        }}
        branch={currentBranch}
        onChange={setCurrentBranch}
        onSave={handleSaveAdd}
        managers={managers}
        loadingManagers={loadingManagers}
        mode="add"
      />

      {/* Edit Branch Dialog */}
      <BranchFormDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setCurrentBranch(null);
        }}
        branch={currentBranch}
        onChange={setCurrentBranch}
        onSave={handleSaveEdit}
        managers={managers}
        loadingManagers={loadingManagers}
        mode="edit"
      />

      {/* Delete Branch Dialog */}
      <DeleteBranchDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setBranchToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        branchName={branchToDelete?.name}
      />
    </Box>
  );
}

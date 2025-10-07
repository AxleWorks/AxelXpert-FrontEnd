import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography, Button, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ManagerLayout from "../../layouts/manager/ManagerLayout";
import BranchesComponent from "../../components/branches/BranchesComponent";
import { BRANCHES_URL } from "../../config/apiEndpoints";

const ManagerBranchesPage = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch(BRANCHES_URL);
        if (!response.ok) {
          throw new Error(`Failed to fetch branches: ${response.status}`);
        }
        const data = await response.json();
        setBranches(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching branches:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  if (loading) {
    return (
      <ManagerLayout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      </ManagerLayout>
    );
  }

  if (error) {
    return (
      <ManagerLayout>
        <Box sx={{ p: 3 }}>
          <p>Error loading branches: {error}</p>
        </Box>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Branch Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ borderRadius: 2 }}
          >
            Add New Branch
          </Button>
        </Box>

        <BranchesComponent branches={branches} />

        {/* Floating action button for mobile view */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            display: { xs: "flex", md: "none" },
          }}
        >
          <AddIcon />
        </Fab>
      </Box>
    </ManagerLayout>
  );
};

export default ManagerBranchesPage;

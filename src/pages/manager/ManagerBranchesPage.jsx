import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import ManagerLayout from "../../layouts/manager/ManagerLayout";
import BranchesComponent from "../../components/branches/BranchesComponent";
import { BRANCHES_URL } from "../../config/apiEndpoints";
import { createAuthenticatedFetchOptions } from "../../utils/jwtUtils.js";

const ManagerBranchesPage = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch(`${BRANCHES_URL}/all`, createAuthenticatedFetchOptions());
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

  const handleAddBranch = async (newBranch) => {
    try {
      const response = await fetch(BRANCHES_URL, createAuthenticatedFetchOptions({
        method: "POST",
        body: JSON.stringify({
          ...newBranch,
          openHours: newBranch.openHours,
          closeHours: newBranch.closeHours,
        }),
      }));

      if (!response.ok) {
        throw new Error("Failed to add branch");
      }

      const createdBranch = await response.json();
      setBranches((prevBranches) => [...prevBranches, createdBranch]);
    } catch (error) {
      console.error("Error adding branch:", error);
    }
  };

  const handleEditBranch = async (updatedBranch) => {
    try {
      const response = await fetch(`${BRANCHES_URL}/${updatedBranch.id}`, createAuthenticatedFetchOptions({
        method: "PUT",
        body: JSON.stringify({
          ...updatedBranch,
          openHours: updatedBranch.openHours,
          closeHours: updatedBranch.closeHours,
        }),
      }));

      if (!response.ok) {
        throw new Error("Failed to update branch");
      }

      const savedBranch = await response.json();
      setBranches((prevBranches) =>
        prevBranches.map((branch) =>
          branch.id === savedBranch.id ? savedBranch : branch
        )
      );
    } catch (error) {
      console.error("Error updating branch:", error);
    }
  };

  const handleDeleteBranch = async (branchId) => {
    try {
      const response = await fetch(`${BRANCHES_URL}/${branchId}`, createAuthenticatedFetchOptions({
        method: "DELETE",
      }));

      if (!response.ok) {
        throw new Error("Failed to delete branch");
      }

      setBranches((prevBranches) =>
        prevBranches.filter((branch) => branch.id !== branchId)
      );
    } catch (error) {
      console.error("Error deleting branch:", error);
    }
  };

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
        <BranchesComponent
          branches={branches}
          isManager={true}
          onAdd={handleAddBranch}
          onEdit={handleEditBranch}
          onDelete={handleDeleteBranch}
        />
      </Box>
    </ManagerLayout>
  );
};

export default ManagerBranchesPage;

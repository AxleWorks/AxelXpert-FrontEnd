import React, { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import UserLayout from "../../layouts/user/UserLayout";
import BranchesComponent from "../../components/branches/BranchesComponent";
import { BRANCHES_URL } from "../../config/apiEndpoints";
import { createAuthenticatedFetchOptions } from "../../utils/jwtUtils.js";

const UserBranchesPage = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch(
          `${BRANCHES_URL}/all`,
          createAuthenticatedFetchOptions()
        );

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
      <UserLayout>
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
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <Box sx={{ p: 3 }}>
          <p>Error loading branches: {error}</p>
        </Box>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <Box sx={{ p: 2 }}>
        <BranchesComponent branches={branches} isManager={false} />
      </Box>
    </UserLayout>
  );
};

export default UserBranchesPage;

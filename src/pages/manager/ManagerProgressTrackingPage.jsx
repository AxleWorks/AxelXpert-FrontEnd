import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Box,
  CircularProgress,
  Stack,
  Alert,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  RadioButtonUnchecked as NotStartedIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import UserLayout from "../../layouts/user/UserLayout";
import AdminLayout from "../../layouts/admin/AdminLayout";
import ManagerProgressTaskCard from "../../components/dashboard/manager/ManagerProgressTaskCard";
import { getManagerProgressTrackingTasks } from "../../services/managerProgressTrackingService";
import { useAuth } from "../../contexts/AuthContext";
import { API_BASE, API_PREFIX } from "../../config/apiEndpoints.jsx";
import { getAuthHeader } from "../../utils/jwtUtils";

const ManagerProgressTrackingPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");

  // Get the authenticated user from AuthContext
  const { user } = useAuth();

  // Fetch branches for admin on mount
  useEffect(() => {
    const ac = new AbortController();
    async function loadBranches() {
      if (!user) return;

      const isAdmin = user?.role === "admin";

      try {
        const authHeader = getAuthHeader();
        const res = await fetch(`${API_BASE}${API_PREFIX}/branches/all`, {
          signal: ac.signal,
          headers: {
            ...(authHeader && { Authorization: authHeader }),
          },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        setBranches(data || []);

        if (isAdmin) {
          // Admin can see all branches - set the first branch as default
          if (data && data.length > 0) {
            console.log("Setting first branch as default:", data[0]);
            setSelectedBranchId(data[0].id);
          }
        } else {
          // Manager is locked to their branch
          if (user?.branchId) {
            console.log("Setting manager's branch:", user.branchId);
            setSelectedBranchId(user.branchId);
          }
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching branches:", err);
          setError("Failed to load branches");
        }
      }
    }
    loadBranches();
    return () => ac.abort();
  }, [user]);

  // Fetch progress tracking data based on user role and selected branch
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      // For admin, wait until a branch is selected
      if (user.role === "admin" && !selectedBranchId) {
        console.log("Waiting for branch selection...");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let data;
        if (user.role === "admin") {
          // For admin: fetch progress tracking for the selected branch
          console.log("Admin fetching data for branch:", selectedBranchId);
          console.log("Available branches:", branches);

          // Find the manager of the selected branch
          const selectedBranch = branches.find(
            (branch) => branch.id === selectedBranchId
          );

          console.log("Selected branch object:", selectedBranch);

          if (selectedBranch && selectedBranch.managerId) {
            console.log(
              "Fetching progress for manager:",
              selectedBranch.managerId
            );
            data = await getManagerProgressTrackingTasks(
              selectedBranch.managerId
            );
          } else {
            data = [];
            const errorMsg = selectedBranch
              ? "Selected branch has no manager assigned"
              : "Branch not found";
            console.error(errorMsg, { selectedBranchId, branches });
            setError(errorMsg);
          }
        } else {
          // For manager: fetch their own branch's progress tracking
          console.log("Manager fetching own progress data");
          data = await getManagerProgressTrackingTasks(user.id);
        }

        setTasks(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching progress data:", err);
        setError(err.message || "Failed to load progress tracking data");
        setLoading(false);
      }
    };
    fetchData();
  }, [user, selectedBranchId, branches]);

  // Helper to calculate progress percentage of a task based on subtasks
  const calculateProgress = (subTasks) => {
    if (!subTasks || subTasks.length === 0) return 0;
    const completedTasks = subTasks.filter(
      (t) => t.status === "COMPLETED"
    ).length;
    return Math.round((completedTasks / subTasks.length) * 100);
  };

  const activeJobs = (tasks = []) => {
    if (!Array.isArray(tasks)) return 0;
    return tasks.reduce(
      (acc, t) => acc + (t && t.status === "IN_PROGRESS" ? 1 : 0),
      0
    );
  };

  const completedToday = (tasks = []) => {
    if (!Array.isArray(tasks)) return 0;
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    return tasks.reduce((acc, t) => {
      if (t && t.status === "COMPLETED" && t.completedTime) {
        const taskDate = new Date(t.completedTime).toISOString().split("T")[0];
        return acc + (taskDate === today ? 1 : 0);
      }
      return acc;
    }, 0);
  };

  const overdueTasks = (tasks = []) => {
    if (!Array.isArray(tasks)) return 0;
    return tasks.reduce(
      (acc, t) => acc + (t && t.status === "NOT_STARTED" ? 1 : 0),
      0
    );
  };

  const avgProgress = (tasks = []) => {
    if (!Array.isArray(tasks)) return 0;
    const inProgressTasks = tasks.filter(
      (t) => t && t.status === "IN_PROGRESS"
    );
    if (inProgressTasks.length === 0) return 0;

    const totalProgress = inProgressTasks.reduce((acc, task) => {
      return acc + calculateProgress(task.subTasks);
    }, 0);

    return Math.round(totalProgress / inProgressTasks.length);
  };

  // For admin, tasks are already filtered by selected branch
  // For manager, show all their branch's tasks
  const filteredTasks = tasks;

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      );
    }

    if (filteredTasks.length === 0) {
      return (
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="body1">No active services found.</Typography>
        </Paper>
      );
    }

    return (
      <Stack spacing={1}>
        {filteredTasks.map((task) => (
          <ManagerProgressTaskCard key={task.id} task={task} />
        ))}
      </Stack>
    );
  };

  const Layout = user?.role === "admin" ? AdminLayout : UserLayout;
  return (
    <Layout>
      <Box sx={{ width: "100%", maxWidth: "100vw", overflow: "hidden" }}>
        <Typography variant="h4" sx={{ mb: 0, fontWeight: 600 }}>
          Branch Progress Tracking
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          Monitor ongoing services and team performance
        </Typography>

        {/* Branch Filter for Admin */}
        {user?.role === "admin" && (
          <Box sx={{ mb: 3, maxWidth: 320 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="branch-filter-label">Select Branch</InputLabel>
              <Select
                labelId="branch-filter-label"
                id="branch-filter"
                value={selectedBranchId}
                label="Select Branch"
                onChange={(e) => setSelectedBranchId(e.target.value)}
                disabled={branches.length === 0}
              >
                {branches.map((branch) => (
                  <MenuItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* General Overview Section */}
        <Box
          sx={{
            mb: 3,
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 2,
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
            }}
          >
            <Box
              sx={{
                bgcolor: "action.selected",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 3,
                borderRadius: 3,
                minWidth: 0,
                maxWidth: "100%",
                gap: 0.5,
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Active Jobs
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {activeJobs(filteredTasks)}
                </Typography>
              </Box>
              <Chip
                label={<ScheduleIcon />}
                color="primary"
                size="small"
                sx={{
                  height: 40,
                  width: 40,
                  flexShrink: 0,
                  "& .MuiChip-label": {
                    px: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                bgcolor: "action.selected",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 3,
                borderRadius: 3,
                minWidth: 0,
                maxWidth: "100%",
                gap: 0.5,
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Completed Today
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {completedToday(filteredTasks)}
                </Typography>
              </Box>
              <Chip
                label={<CheckCircleIcon />}
                color="success"
                size="small"
                sx={{
                  height: 40,
                  width: 40,
                  flexShrink: 0,
                  "& .MuiChip-label": {
                    px: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                bgcolor: "action.selected",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 3,
                borderRadius: 3,
                minWidth: 0,
                maxWidth: "100%",
                gap: 0.5,
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Overdue
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {overdueTasks(filteredTasks)}
                </Typography>
              </Box>
              <Chip
                label={<NotStartedIcon />}
                color="error"
                size="small"
                sx={{
                  height: 40,
                  width: 40,
                  flexShrink: 0,
                  "& .MuiChip-label": {
                    px: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                bgcolor: "action.selected",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 3,
                borderRadius: 3,
                minWidth: 0,
                maxWidth: "100%",
                gap: 0.5,
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Avg Progress
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {avgProgress(filteredTasks)}%
                </Typography>
              </Box>
              <Chip
                label={<TrendingUpIcon />}
                color="primary"
                size="small"
                sx={{
                  height: 40,
                  width: 40,
                  flexShrink: 0,
                  "& .MuiChip-label": {
                    px: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Ongoing Services Section */}
        <Box sx={{ bgcolor: "action.selected", p: 1, borderRadius: 2 }}>
          <Typography variant="subtitle1" sx={{ m: 2, fontWeight: 500 }}>
            Ongoing Services
          </Typography>
          {/* Scrollable container for header and rows together */}
          <Box sx={{ overflowX: "auto" }}>
            <Box sx={{ minWidth: "max-content" }}>
              {/* Header Row */}
              <Box
                sx={{
                  display: "flex",
                  px: 2,
                  mb: 1,
                  fontWeight: 500,
                  color: "text.secondary",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    flex: "0 0 13%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  Service ID
                </Box>
                <Box
                  sx={{
                    flex: "0 0 13%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  Vehicle
                </Box>
                <Box
                  sx={{
                    flex: "0 0 13%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  Customer
                </Box>
                <Box
                  sx={{
                    flex: "0 0 13%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  Employee
                </Box>
                <Box
                  sx={{
                    flex: "0 0 13%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  Progress
                </Box>
                <Box
                  sx={{
                    flex: "0 0 13%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  ETA
                </Box>
                <Box
                  sx={{
                    flex: "0 0 13%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  Status
                </Box>
              </Box>
              {renderContent()}
            </Box>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default ManagerProgressTrackingPage;

import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import EmployeeTableRow from "./EmployeeTableRow";
import { useAuth } from "../../contexts/AuthContext";

const EmployeesTable = React.memo(
  ({ employees, onView, onEdit, onDelete, onBlock }) => {
    const { user } = useAuth();
    const isManager = user?.role === "manager";
    
    const [orderBy, setOrderBy] = React.useState("username");
    const [order, setOrder] = React.useState("asc");
    const [searchQuery, setSearchQuery] = React.useState("");
    const [branchFilter, setBranchFilter] = React.useState("all");
    const [roleFilter, setRoleFilter] = React.useState("all");

    // Get unique branches and roles for filter dropdowns
    const uniqueBranches = React.useMemo(() => {
      const branches = [
        ...new Set(employees.map((emp) => emp.branchName).filter(Boolean)),
      ];
      return branches.sort();
    }, [employees]);

    const uniqueRoles = React.useMemo(() => {
      const roles = [
        ...new Set(employees.map((emp) => emp.role).filter(Boolean)),
      ];
      return roles.sort();
    }, [employees]);

    const handleRequestSort = React.useCallback(
      (property) => {
        setOrder((prevOrder) =>
          orderBy === property && prevOrder === "asc" ? "desc" : "asc"
        );
        setOrderBy(property);
      },
      [orderBy]
    );

    const descendingComparator = React.useCallback((a, b, orderBy) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      if (aValue == null) aValue = "";
      if (bValue == null) bValue = "";

      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      if (bValue < aValue) return -1;
      if (bValue > aValue) return 1;
      return 0;
    }, []);

    const getComparator = React.useCallback(
      (order, orderBy) => {
        return order === "desc"
          ? (a, b) => descendingComparator(a, b, orderBy)
          : (a, b) => -descendingComparator(a, b, orderBy);
      },
      [descendingComparator]
    );

    const filteredEmployees = React.useMemo(() => {
      let filtered = employees;

      // Apply branch filter
      if (branchFilter !== "all") {
        filtered = filtered.filter(
          (employee) => employee.branchName === branchFilter
        );
      }

      // Apply role filter
      if (roleFilter !== "all") {
        filtered = filtered.filter((employee) => employee.role === roleFilter);
      }

      // Apply search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter((employee) => {
          return (
            employee.username?.toLowerCase().includes(query) ||
            employee.email?.toLowerCase().includes(query) ||
            employee.role?.toLowerCase().includes(query) ||
            employee.branchName?.toLowerCase().includes(query) ||
            employee.phoneNumber?.toLowerCase().includes(query) ||
            employee.address?.toLowerCase().includes(query)
          );
        });
      }

      return filtered;
    }, [employees, searchQuery, branchFilter, roleFilter]);

    const sortedEmployees = React.useMemo(() => {
      return [...filteredEmployees].sort(getComparator(order, orderBy));
    }, [filteredEmployees, order, orderBy, getComparator]);

    const handleSearchChange = React.useCallback((e) => {
      setSearchQuery(e.target.value);
    }, []);

    const handleBranchFilterChange = React.useCallback((e) => {
      setBranchFilter(e.target.value);
    }, []);

    const handleRoleFilterChange = React.useCallback((e) => {
      setRoleFilter(e.target.value);
    }, []);

    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardHeader>
          <CardTitle>Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {/* Search Bar */}
            <Grid item xs={12} md={isManager ? 8 : 6}>
              <TextField
                placeholder="Search employees..."
                value={searchQuery}
                onChange={handleSearchChange}
                size="small"
                fullWidth
                sx={{
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
            </Grid>

            {/* Branch Filter - Hidden for Managers */}
            {!isManager && (
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <Select
                    value={branchFilter}
                    onChange={handleBranchFilterChange}
                    displayEmpty
                    sx={{
                      borderRadius: 2,
                      "& .MuiSelect-select": {
                        py: 1,
                      },
                    }}
                  >
                    <MenuItem value="all">
                      <Typography sx={{ color: "text.secondary" }}>
                        All Branches
                      </Typography>
                    </MenuItem>
                    {uniqueBranches.map((branch) => (
                      <MenuItem key={branch} value={branch}>
                        {branch}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Role Filter */}
            <Grid item xs={12} sm={6} md={isManager ? 4 : 3}>
              <FormControl fullWidth size="small">
                <Select
                  value={roleFilter}
                  onChange={handleRoleFilterChange}
                  displayEmpty
                  sx={{
                    borderRadius: 2,
                    "& .MuiSelect-select": {
                      py: 1,
                    },
                  }}
                >
                  <MenuItem value="all">
                    <Typography sx={{ color: "text.secondary" }}>
                      All Roles
                    </Typography>
                  </MenuItem>
                  {uniqueRoles.map((role) => (
                    <MenuItem key={role} value={role}>
                      <Typography sx={{ textTransform: "capitalize" }}>
                        {role}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
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
                      active={orderBy === "username"}
                      direction={orderBy === "username" ? order : "asc"}
                      onClick={() => handleRequestSort("username")}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    <TableSortLabel
                      active={orderBy === "role"}
                      direction={orderBy === "role" ? order : "asc"}
                      onClick={() => handleRequestSort("role")}
                    >
                      Role
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    <TableSortLabel
                      active={orderBy === "branchName"}
                      direction={orderBy === "branchName" ? order : "asc"}
                      onClick={() => handleRequestSort("branchName")}
                    >
                      Branch
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    <TableSortLabel
                      active={orderBy === "phoneNumber"}
                      direction={orderBy === "phoneNumber" ? order : "asc"}
                      onClick={() => handleRequestSort("phoneNumber")}
                    >
                      Phone Number
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <Typography color="text.secondary" variant="body1">
                        {searchQuery ||
                        branchFilter !== "all" ||
                        roleFilter !== "all"
                          ? "No employees found matching the selected filters"
                          : "No employees found"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedEmployees.map((employee) => (
                    <EmployeeTableRow
                      key={employee.id}
                      employee={employee}
                      onView={onView}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onBlock={onBlock}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    );
  }
);

EmployeesTable.displayName = "EmployeesTable";

export default EmployeesTable;

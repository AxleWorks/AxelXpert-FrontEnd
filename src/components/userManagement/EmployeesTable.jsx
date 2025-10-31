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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import EmployeeTableRow from "./EmployeeTableRow";

const EmployeesTable = React.memo(
  ({ employees, onView, onEdit, onDelete, onBlock }) => {
    const [orderBy, setOrderBy] = React.useState("username");
    const [order, setOrder] = React.useState("asc");
    const [searchQuery, setSearchQuery] = React.useState("");

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
      if (!searchQuery.trim()) {
        return employees;
      }

      const query = searchQuery.toLowerCase();
      return employees.filter((employee) => {
        return (
          employee.username?.toLowerCase().includes(query) ||
          employee.email?.toLowerCase().includes(query) ||
          employee.role?.toLowerCase().includes(query) ||
          employee.branchName?.toLowerCase().includes(query) ||
          employee.phoneNumber?.toLowerCase().includes(query) ||
          employee.address?.toLowerCase().includes(query)
        );
      });
    }, [employees, searchQuery]);

    const sortedEmployees = React.useMemo(() => {
      return [...filteredEmployees].sort(getComparator(order, orderBy));
    }, [filteredEmployees, order, orderBy, getComparator]);

    const handleSearchChange = React.useCallback((e) => {
      setSearchQuery(e.target.value);
    }, []);

    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardHeader>
          <CardTitle>Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <Box sx={{ mb: 3 }}>
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
                        {searchQuery
                          ? `No employees found matching "${searchQuery}"`
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

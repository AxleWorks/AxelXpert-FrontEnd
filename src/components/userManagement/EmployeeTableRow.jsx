import React from "react";
import {
  Box,
  Typography,
  TableCell,
  TableRow,
  Avatar as MuiAvatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Visibility, Edit, Delete, Block } from "@mui/icons-material";
import { Badge } from "../ui/badge";

const Avatar = React.memo(({ name, profileImageUrl }) => {
  const defaultImageUrl =
    "https://cdn-icons-png.flaticon.com/512/9684/9684441.png";

  return (
    <MuiAvatar
      src={profileImageUrl || defaultImageUrl}
      sx={{ bgcolor: "grey.100", color: "text.primary" }}
    >
      {!profileImageUrl && name
        ? name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
        : null}
    </MuiAvatar>
  );
});

Avatar.displayName = "Avatar";

const EmployeeTableRow = React.memo(
  ({ employee, onView, onEdit, onDelete, onBlock }) => {
    const handleView = React.useCallback(() => {
      onView(employee);
    }, [employee, onView]);

    const handleEdit = React.useCallback(() => {
      onEdit(employee);
    }, [employee, onEdit]);

    const handleDelete = React.useCallback(() => {
      onDelete(employee);
    }, [employee, onDelete]);

    const handleBlock = React.useCallback(() => {
      onBlock(employee);
    }, [employee, onBlock]);

    return (
      <TableRow
        sx={{
          cursor: "pointer",
          transition: "background-color 150ms ease",
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
      >
        <TableCell>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              name={employee.username}
              profileImageUrl={employee.profileImageUrl}
            />
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
                {employee.username}
              </Typography>
              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: "0.875rem",
                  mt: 0.25,
                }}
              >
                {employee.email}
              </Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell>
          <Typography sx={{ textTransform: "capitalize" }}>
            {employee.role}
          </Typography>
        </TableCell>
        <TableCell>{employee.branchName || "No Branch"}</TableCell>
        <TableCell>
          <Typography>{employee.phoneNumber || "N/A"}</Typography>
        </TableCell>
        <TableCell>
          <Badge
            sx={{
              borderRadius: 8,
              padding: "4px 10px",
              backgroundColor: employee.isBlocked
                ? "#ef4444"
                : employee.isActive
                ? "#10b981"
                : "#f59e0b",
              color: "white",
            }}
          >
            <Typography>
              {employee.isBlocked
                ? "Blocked"
                : employee.isActive
                ? "Active"
                : "Inactive"}
            </Typography>
          </Badge>
        </TableCell>

        <TableCell align="center">
          <Tooltip title="View">
            <IconButton onClick={handleView} style={{ color: "#4caf50" }}>
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton onClick={handleEdit} style={{ color: "#0b75d9" }}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={handleDelete} style={{ color: "#f44336" }}>
              <Delete />
            </IconButton>
          </Tooltip>
          <Tooltip title={employee.isBlocked ? "Unblock" : "Block"}>
            <IconButton
              onClick={handleBlock}
              style={{
                color: employee.isBlocked ? "#10b981" : "#ff9800",
              }}
            >
              <Block />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    );
  }
);

EmployeeTableRow.displayName = "EmployeeTableRow";

export default EmployeeTableRow;

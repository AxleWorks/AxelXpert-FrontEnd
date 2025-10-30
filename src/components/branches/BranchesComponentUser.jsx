import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card.jsx";
import { Button } from "../ui/button.jsx";
import { Badge } from "../ui/badge.jsx";
import { EditIcon, Trash2, Trash2Icon } from "lucide-react";
import { USERS_URL } from "../../config/apiEndpoints.jsx";
import { createAuthenticatedFetchOptions } from "../../utils/jwtUtils.js";

export default function BranchesComponent({
  branches,
  isManager,
  onAdd,
  onEdit,
  onDelete,
}) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [currentBranch, setCurrentBranch] = useState(null);
  const [managers, setManagers] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    if (isManager) {
      const fetchManagers = async () => {
        try {
          const response = await fetch(
            `${USERS_URL}/managers`,
            createAuthenticatedFetchOptions()
          );
          if (response.ok) {
            const data = await response.json();
            setManagers(data);
          }
        } catch (error) {
          console.error("Error fetching managers:", error);
        }
      };
      fetchManagers();
    }
  }, [isManager]);

  const handleEditClick = (branch) => {
    setCurrentBranch(branch);
    setEditDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setCurrentBranch(null);
  };

  const handleConfirm = async () => {
    if (confirmAction) {
      await confirmAction();
    }
    setConfirmDialogOpen(false);
    setConfirmAction(null);
  };

  const handleDeleteClick = (branchId) => {
    setConfirmAction(() => () => onDelete(branchId));
    setConfirmDialogOpen(true);
  };

  const handleAddSave = async () => {
    setConfirmAction(() => async () => {
      if (currentBranch) {
        await onAdd(currentBranch);
      }
      setAddDialogOpen(false);
      setCurrentBranch(null);
    });
    setConfirmDialogOpen(true);
  };

  const handleSave = async () => {
    setConfirmAction(() => async () => {
      if (currentBranch) {
        await onEdit(currentBranch);
      }
      setEditDialogOpen(false);
      setCurrentBranch(null);
    });
    setConfirmDialogOpen(true);
  };

  const handleAddClick = () => {
    setCurrentBranch({
      name: "",
      address: "",
      openHours: "",
      closeHours: "",
      managerId: "",
      phone: "",
      locationLink: "",
    });
    setAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
    setCurrentBranch(null);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Service Centers
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Find a service center near you
          </Typography>
        </Box>

        {isManager && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddClick}
            sx={{ borderRadius: 2 }}
          >
            Add New Branch
          </Button>
        )}
      </Box>

      {/* Branches Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {branches.map((branch) => (
          <Card key={branch.id}>
            <CardHeader
              title={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: "primary.light",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LocationOnIcon sx={{ color: "white", fontSize: 28 }} />
                  </Box>
                  <Badge>Open</Badge>
                </Box>
              }
              subheader={<CardTitle>{branch.name}</CardTitle>}
            />

            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Open At: {branch.openHours || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Close At: {branch.closeHours || "N/A"}
                </Typography>

                <Box
                  sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                >
                  <LocationOnIcon
                    sx={{
                      color: "text.secondary",
                      fontSize: 18,
                      mt: 0.5,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {branch.address}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <PersonIcon
                    sx={{
                      color: "text.secondary",
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Manager: {branch.managerName}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <PhoneIcon
                    sx={{
                      color: "text.secondary",
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {branch.phone}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <EmailIcon
                    sx={{
                      color: "text.secondary",
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {`${branch.email || " Not Provided"}`}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <LocationOnIcon
                    sx={{
                      color: "text.secondary",
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="body2"
                    color="primary"
                    component="a"
                    href={branch.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Location
                  </Typography>
                </Box>
              </Box>

              {isManager && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignContent: "center",
                    justifyContent: "center",
                    gap: 6,
                    pt: 2,
                    mt: 2,
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(branch)}
                  >
                    <EditIcon />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    color="error"
                    onClick={() => handleDeleteClick(branch.id)}
                  >
                    <Trash2Icon />
                    Delete
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

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
          <Button onClick={handleConfirm} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}
        fullWidth
        sx={{
          "& .MuiBackdrop-root": {
            backdropFilter: "blur(4px)",
          },
        }}
      >
        <DialogTitle>Add New Branch</DialogTitle>
        <DialogContent>
          <TextField
            label="Branch Name"
            fullWidth
            margin="normal"
            value={currentBranch?.name || ""}
            onChange={(e) =>
              setCurrentBranch({ ...currentBranch, name: e.target.value })
            }
          />
          <TextField
            label="Address"
            fullWidth
            margin="normal"
            value={currentBranch?.address || ""}
            onChange={(e) =>
              setCurrentBranch({ ...currentBranch, address: e.target.value })
            }
          />
          <TextField
            label="Open Hours"
            type="time"
            fullWidth
            margin="normal"
            value={currentBranch?.openHours || ""}
            onChange={(e) =>
              setCurrentBranch({ ...currentBranch, openHours: e.target.value })
            }
          />
          <TextField
            label="Close Hours"
            type="time"
            fullWidth
            margin="normal"
            value={currentBranch?.closeHours || ""}
            onChange={(e) =>
              setCurrentBranch({ ...currentBranch, closeHours: e.target.value })
            }
          />
          <TextField
            label="Manager"
            select
            fullWidth
            margin="normal"
            value={currentBranch?.managerId || ""}
            onChange={(e) =>
              setCurrentBranch({ ...currentBranch, managerId: e.target.value })
            }
          >
            {managers.map((manager) => (
              <MenuItem key={manager.id} value={manager.id}>
                {manager.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Phone"
            fullWidth
            margin="normal"
            value={currentBranch?.phone || ""}
            onChange={(e) =>
              setCurrentBranch({ ...currentBranch, phone: e.target.value })
            }
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={currentBranch?.email || ""}
            onChange={(e) =>
              setCurrentBranch({ ...currentBranch, email: e.target.value })
            }
          />
          <TextField
            label="Map Link"
            fullWidth
            margin="normal"
            value={currentBranch?.mapLink || ""}
            onChange={(e) =>
              setCurrentBranch({
                ...currentBranch,
                mapLink: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button onClick={handleAddSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleDialogClose}
        fullWidth
        sx={{
          "& .MuiBackdrop-root": {
            backdropFilter: "blur(4px)",
          },
        }}
      >
        <DialogTitle>Edit Branch</DialogTitle>
        <DialogContent>
          <TextField
            label="Branch Name"
            fullWidth
            margin="normal"
            value={currentBranch?.name || ""}
            onChange={(e) =>
              setCurrentBranch({ ...currentBranch, name: e.target.value })
            }
          />
          <TextField
            label="Address"
            fullWidth
            margin="normal"
            value={currentBranch?.address || ""}
            onChange={(e) =>
              setCurrentBranch({ ...currentBranch, address: e.target.value })
            }
          />
          <TextField
            label="Open Hours"
            type="time"
            fullWidth
            margin="normal"
            value={currentBranch?.openHours || ""}
            onChange={(e) =>
              setCurrentBranch({ ...currentBranch, openHours: e.target.value })
            }
          />
          <TextField
            label="Close Hours"
            type="time"
            fullWidth
            margin="normal"
            value={currentBranch?.closeHours || ""}
            onChange={(e) =>
              setCurrentBranch({ ...currentBranch, closeHours: e.target.value })
            }
          />
          <TextField
            label="Manager"
            select
            fullWidth
            margin="normal"
            value={currentBranch?.managerId || ""}
            onChange={(e) =>
              setCurrentBranch({ ...currentBranch, managerId: e.target.value })
            }
          >
            {managers.map((manager) => (
              <MenuItem key={manager.id} value={manager.id}>
                {manager.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Phone"
            fullWidth
            margin="normal"
            value={currentBranch?.phone || ""}
            onChange={(e) =>
              setCurrentBranch({ ...currentBranch, phone: e.target.value })
            }
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={currentBranch?.email || ""}
            onChange={(e) =>
              setCurrentBranch({ ...currentBranch, email: e.target.value })
            }
          />
          <TextField
            label="Map Link"
            fullWidth
            margin="normal"
            value={currentBranch?.mapLink || ""}
            onChange={(e) =>
              setCurrentBranch({
                ...currentBranch,
                mapLink: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

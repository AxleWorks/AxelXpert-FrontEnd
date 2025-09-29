import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Avatar,
  Typography,
  Box,
  Grid,
  Button,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";

const StatModal = ({ open, onClose, stat }) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="sm"
    fullWidth
    PaperProps={{
      sx: {
        borderRadius: 3,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      },
    }}
  >
    <DialogTitle
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        pb: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar sx={{ backgroundColor: stat?.color, width: 48, height: 48 }}>
          {stat?.icon}
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {stat?.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Detailed Analytics
          </Typography>
        </Box>
      </Box>
      <IconButton onClick={onClose} size="small">
        <Close />
      </IconButton>
    </DialogTitle>
    <Divider />
    <DialogContent sx={{ pt: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              variant="h2"
              sx={{ fontWeight: 800, color: stat?.color }}
            >
              {stat?.value}
            </Typography>
            <Typography variant="h6" sx={{ color: "#64748b", mt: 1 }}>
              Current {stat?.title}
            </Typography>
          </Box>
        </Grid>
        {stat?.details &&
          stat.details.map((detail, index) => (
            <Grid item xs={6} key={index}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  backgroundColor: "#f8fafc",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "#1e293b" }}
                >
                  {detail.value}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  {detail.label}
                </Typography>
              </Box>
            </Grid>
          ))}
      </Grid>
    </DialogContent>
    <DialogActions sx={{ p: 3, pt: 0 }}>
      <Button
        onClick={onClose}
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: stat?.color,
          py: 1.5,
          fontWeight: 600,
          textTransform: "none",
        }}
      >
        View Detailed Report
      </Button>
    </DialogActions>
  </Dialog>
);

export default StatModal;

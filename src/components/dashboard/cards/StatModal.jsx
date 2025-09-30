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
  useTheme,
} from "@mui/material";
import { Close } from "@mui/icons-material";

const StatModal = ({ open, onClose, stat }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: isDark 
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.6)"
            : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          backgroundColor: theme.palette.background.paper,
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
            <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
              {stat?.title}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Detailed Analytics
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: theme.palette.text.primary }}>
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
              <Typography variant="h6" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
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
                    backgroundColor: isDark ? theme.palette.background.default : "#f8fafc",
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: theme.palette.text.primary }}
                  >
                    {detail.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
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
            "&:hover": {
              backgroundColor: stat?.color,
              filter: "brightness(0.9)",
            },
          }}
        >
          View Detailed Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatModal;

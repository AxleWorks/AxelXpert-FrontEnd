import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Avatar,
  Button,
} from "@mui/material";
import { DirectionsCar, Add } from "@mui/icons-material";

const VehiclesPage = () => {
  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#1e293b",
              mb: 1,
              fontSize: { xs: "1.75rem", md: "2.125rem" },
            }}
          >
            Vehicles
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#64748b", fontSize: "1.1rem" }}
          >
            Manage all registered vehicles in your system
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            backgroundColor: "#3b82f6",
            py: 1.5,
            px: 3,
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
          }}
        >
          Add Vehicle
        </Button>
      </Box>

      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          p: 4,
          textAlign: "center",
          minHeight: 400,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Avatar
          sx={{
            backgroundColor: "#e0f2fe",
            width: 80,
            height: 80,
            mb: 3,
          }}
        >
          <DirectionsCar sx={{ fontSize: 40, color: "#0369a1" }} />
        </Avatar>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#1e293b",
            mb: 2,
          }}
        >
          Vehicles Management
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#64748b",
            mb: 3,
            maxWidth: 500,
          }}
        >
          This page will contain all vehicle management functionality including
          vehicle registration, maintenance history, and service tracking.
        </Typography>
        <Chip label="Coming Soon" color="primary" variant="outlined" />
      </Card>
    </Container>
  );
};

export default VehiclesPage;

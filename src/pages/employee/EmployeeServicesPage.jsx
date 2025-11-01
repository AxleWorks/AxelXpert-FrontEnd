import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Box,
  CircularProgress,
  Grid,
  Button,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { SERVICES_URL } from "../../config/apiEndpoints.jsx";
import { createAuthenticatedFetchOptions } from "../../utils/jwtUtils.js";
import UserServiceCard from "../../components/services/UserServiceCard";
import EmployeeLayout from "../../layouts/employee/EmployeeLayout.jsx";

const EmployeeServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(SERVICES_URL, createAuthenticatedFetchOptions())
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch services");
        return res.json();
      })
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filter services by search
  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(search.toLowerCase()) ||
      (service.description &&
        service.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <EmployeeLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Available Services
        </Typography>

        {/* Search Section */}
        <Paper sx={{ mb: 3, p: 1.5, borderRadius: 2, boxShadow: 0 }}>
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              fontSize: 16,
              outline: "none",
            }}
          />
        </Paper>

        {/* Services Grid */}
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={400}
          >
            <CircularProgress size={48} />
          </Box>
        ) : error ? (
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: "center",
              borderRadius: 3,
              border: 2,
              borderStyle: "dashed",
              borderColor: "error.main",
            }}
          >
            <Typography
              variant="h6"
              color="error"
              fontWeight={600}
              gutterBottom
            >
              Error Loading Services
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {error}
            </Typography>
          </Paper>
        ) : filteredServices.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: "center",
              borderRadius: 3,
              border: 2,
              borderStyle: "dashed",
              borderColor: "grey.300",
            }}
          >
            <Typography
              variant="h6"
              color="text.secondary"
              fontWeight={600}
              gutterBottom
            >
              {search ? "No services found" : "No services available"}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {search
                ? "Try adjusting your search terms"
                : "Check back later for available services"}
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredServices.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <UserServiceCard service={service} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </EmployeeLayout>
  );
};

export default EmployeeServicesPage;

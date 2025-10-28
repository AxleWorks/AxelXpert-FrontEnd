import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import UserLayout from "../../layouts/user/UserLayout";

const UserServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/services")
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
    <UserLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Available Services
        </Typography>
        {/* Search Section */}
        <Paper sx={{ mb: 2, p: 1.5, borderRadius: 2, boxShadow: 0 }}>
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
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={120}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Duration (min)</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>${service.price.toFixed(2)}</TableCell>
                      <TableCell>{service.durationMinutes}</TableCell>
                      <TableCell>{service.description || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </UserLayout>
  );
};

export default UserServicesPage;

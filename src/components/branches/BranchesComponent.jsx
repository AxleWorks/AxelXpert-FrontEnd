import React from "react";
import { Box, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export default function BranchesComponent({ branches }) {
  const defaultHours = "Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 3:00 PM";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {/* Header */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Service Centers
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find a service center near you
        </Typography>
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
                    mb: 2,
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
                    <LocationOnIcon
                      sx={{ color: "primary.main", fontSize: 28 }}
                    />
                  </Box>
                  <Badge>Open</Badge>
                </Box>
              }
              subheader={<CardTitle>{branch.name}</CardTitle>}
            />
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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

                <Box
                  sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                >
                  <AccessTimeIcon
                    sx={{
                      color: "text.secondary",
                      fontSize: 18,
                      mt: 0.5,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {defaultHours}
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
                    {`${branch.name.toLowerCase()}@axlexpert.com`}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 1,
                  pt: 2,
                  mt: 2,
                  borderTop: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  startIcon={<LocationOnIcon fontSize="small" />}
                >
                  View Map
                </Button>
                <Button size="sm" startIcon={<PhoneIcon fontSize="small" />}>
                  Contact
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

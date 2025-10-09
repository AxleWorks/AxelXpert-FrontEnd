import React, { useState, useEffect } from "react";
import { 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  Button, 
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress
} from "@mui/material";
import { 
  LocationOn, 
  AccessTime, 
  Person, 
  Phone, 
  Email, 
  Search,
  Map as MapIcon,
  DirectionsCar,
  Star,
  StarBorder,
  Close,
  WhatsApp,
  Call
} from "@mui/icons-material";
import UserLayout from "../../layouts/user/UserLayout";

const UserBranchesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [favorites, setFavorites] = useState([]);
  const [filterByFavorites, setFilterByFavorites] = useState(false);

  // Mock data for service centers
  const [branches, setBranches] = useState([
    {
      id: 1,
      name: "Downtown Service Center",
      location: "123 Main Street, Downtown, CA 90001",
      coordinates: { lat: 34.052235, lng: -118.243683 },
      hours: "Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 4:00 PM",
      manager: "Sarah Johnson",
      phone: "(555) 123-4567",
      whatsapp: "+15551234567",
      email: "downtown@axlexpert.com",
      status: "Open",
      services: ["Oil Change", "Brake Service", "Engine Repair", "Tire Rotation"],
      rating: 4.8,
      reviews: 245
    },
    {
      id: 2,
      name: "Westside Auto Care",
      location: "456 West Avenue, Westside, CA 90002",
      coordinates: { lat: 34.052235, lng: -118.343683 },
      hours: "Mon-Fri: 7:30 AM - 7:00 PM, Sat-Sun: 9:00 AM - 5:00 PM",
      manager: "Michael Chen",
      phone: "(555) 234-5678",
      whatsapp: "+15552345678",
      email: "westside@axlexpert.com",
      status: "Open",
      services: ["Diagnostics", "A/C Service", "Transmission", "Electrical"],
      rating: 4.5,
      reviews: 189
    },
    {
      id: 3,
      name: "North Branch Center",
      location: "789 North Road, Northside, CA 90003",
      coordinates: { lat: 34.152235, lng: -118.243683 },
      hours: "Mon-Sat: 8:00 AM - 6:00 PM, Sun: Closed",
      manager: "David Martinez",
      phone: "(555) 345-6789",
      whatsapp: "+15553456789",
      email: "north@axlexpert.com",
      status: "Open",
      services: ["Battery Service", "Suspension", "Wheel Alignment", "Oil Change"],
      rating: 4.7,
      reviews: 312
    },
    {
      id: 4,
      name: "South Service Hub",
      location: "321 South Boulevard, Southside, CA 90004",
      coordinates: { lat: 33.952235, lng: -118.243683 },
      hours: "Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 3:00 PM",
      manager: "Emily Thompson",
      phone: "(555) 456-7890",
      whatsapp: "+15554567890",
      email: "south@axlexpert.com",
      status: "Open",
      services: ["Diagnostics", "Brake Service", "Engine Repair", "Electrical"],
      rating: 4.6,
      reviews: 275
    },
    {
      id: 5,
      name: "Express Service Station",
      location: "555 Express Way, Central, CA 90005",
      coordinates: { lat: 34.052235, lng: -118.143683 },
      hours: "Mon-Sun: 24/7",
      manager: "Robert Wilson",
      phone: "(555) 567-8901",
      whatsapp: "+15555678901",
      email: "express@axlexpert.com",
      status: "Open",
      services: ["Quick Oil Change", "Battery Service", "Tire Rotation", "Fluid Check"],
      rating: 4.9,
      reviews: 425
    },
    {
      id: 6,
      name: "Premium Auto Center",
      location: "888 Luxury Lane, Uptown, CA 90006",
      coordinates: { lat: 34.072235, lng: -118.243683 },
      hours: "Mon-Fri: 9:00 AM - 7:00 PM, Sat: 10:00 AM - 5:00 PM",
      manager: "Jennifer Lee",
      phone: "(555) 678-9012",
      whatsapp: "+15556789012",
      email: "premium@axlexpert.com",
      status: "Open",
      services: ["Premium Oil Change", "Detailing", "Performance Tuning", "Luxury Vehicle Service"],
      rating: 4.8,
      reviews: 356
    }
  ]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('axelXpertFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('axelXpertFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Simulate loading branches from API
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const toggleFavorite = (branchId) => {
    if (favorites.includes(branchId)) {
      setFavorites(favorites.filter(id => id !== branchId));
      setSnackbar({ 
        open: true, 
        message: "Removed from favorites", 
        severity: "info" 
      });
    } else {
      setFavorites([...favorites, branchId]);
      setSnackbar({ 
        open: true, 
        message: "Added to favorites", 
        severity: "success" 
      });
    }
  };

  const openMapDialog = (branch) => {
    setSelectedBranch(branch);
    setMapDialogOpen(true);
  };

  const openContactDialog = (branch) => {
    setSelectedBranch(branch);
    setContactDialogOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredBranches = branches.filter((branch) => {
    const matchesSearch = (
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.services.some(service => 
        service.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    
    if (filterByFavorites) {
      return matchesSearch && favorites.includes(branch.id);
    }
    
    return matchesSearch;
  });  return (
    <UserLayout>
      <Box sx={{ bgcolor: '#0f1924', color: 'white', borderRadius: 2, p: 3, minHeight: 'calc(100vh - 100px)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 600, color: 'white' }}>
              Service Centers
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Find a service center near you
            </Typography>
          </Box>
          
          <Chip 
            icon={filterByFavorites ? <Star sx={{ color: '#f5b014' }} /> : <StarBorder sx={{ color: '#aaa' }} />}
            label={filterByFavorites ? "Showing Favorites" : "Show Favorites"}
            clickable
            sx={{ 
              fontWeight: 500, 
              height: 32, 
              bgcolor: filterByFavorites ? 'rgba(63, 139, 228, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: '1px solid',
              borderColor: filterByFavorites ? 'rgba(63, 139, 228, 0.5)' : 'rgba(255, 255, 255, 0.1)',
              color: filterByFavorites ? '#3f8be4' : '#aaa',
              '& .MuiChip-icon': { fontSize: 18 } 
            }}
            onClick={() => setFilterByFavorites(!filterByFavorites)}
          />
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search by name, location, manager, or services..."
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                </InputAdornment>
              ),
              sx: { 
                borderRadius: 1,
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3f8be4'
                },
                color: 'white'
              }
            }}
            sx={{
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)'
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'rgba(255, 255, 255, 0.5)',
                opacity: 1
              }
            }}
          />
        </Box>        {/* Service Center Cards Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
            <CircularProgress />
          </Box>
        ) : filteredBranches.length > 0 ? (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {filteredBranches.map((branch) => (
              <Grid item xs={12} md={6} lg={4} key={branch.id}>
                <Card 
                  elevation={0}
                  sx={{
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    height: 420,
                    position: 'relative',
                    transition: 'transform 0.2s',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    }
                  }}
                >
                  {/* Car Icon */}
                  <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
                    <DirectionsCar sx={{ color: '#3f8be4', fontSize: 28 }} />
                  </Box>
                  
                  {/* Status Chip */}
                  <Chip
                    label={branch.status}
                    color="success"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 52,
                      height: 24,
                      fontSize: '0.75rem',
                      fontWeight: 500
                    }}
                  />
                  
                  {/* Favorite Button */}
                  <IconButton
                    onClick={() => toggleFavorite(branch.id)}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12
                    }}
                  >
                    {favorites.includes(branch.id) ? (
                      <Star fontSize="small" sx={{ color: '#f5b014' }} />
                    ) : (
                      <StarBorder fontSize="small" />
                    )}
                  </IconButton>
                  
                  <CardContent sx={{ pt: 5, px: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Title & Rating */}
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {branch.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Star sx={{ fontSize: 16, color: '#f5b014' }} />
                        <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 600 }}>
                          {branch.rating}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                          ({branch.reviews} reviews)
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Info List */}
                    <Box sx={{ mb: 'auto', pt: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                        <LocationOn sx={{ fontSize: 18, mr: 1.5, color: 'text.secondary', mt: 0.25, flexShrink: 0 }} />
                        <Typography variant="body2" color="text.secondary">
                          {branch.location}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                        <AccessTime sx={{ fontSize: 18, mr: 1.5, color: 'text.secondary', mt: 0.25, flexShrink: 0 }} />
                        <Typography variant="body2" color="text.secondary">
                          {branch.hours}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                        <Person sx={{ fontSize: 18, mr: 1.5, color: 'text.secondary', mt: 0.25, flexShrink: 0 }} />
                        <Typography variant="body2" color="text.secondary">
                          Manager: {branch.manager}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                        <Phone sx={{ fontSize: 18, mr: 1.5, color: 'text.secondary', mt: 0.25, flexShrink: 0 }} />
                        <Typography variant="body2" color="text.secondary">
                          {branch.phone}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                        <Email sx={{ fontSize: 18, mr: 1.5, color: 'text.secondary', mt: 0.25, flexShrink: 0 }} />
                        <Typography variant="body2" color="text.secondary">
                          {branch.email}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Services */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Services:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                        {branch.services.map((service, index) => (
                          <Chip 
                            key={index} 
                            label={service} 
                            size="small" 
                            sx={{ 
                              borderRadius: 1, 
                              height: 24, 
                              fontSize: '0.75rem',
                              bgcolor: 'background.default'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Button
                        variant="outlined"
                        startIcon={<MapIcon />}
                        size="small"
                        sx={{ 
                          borderRadius: 1, 
                          flexGrow: 1, 
                          mr: 1, 
                          textTransform: 'none',
                          color: '#3f8be4',
                          borderColor: '#3f8be4'
                        }}
                        onClick={() => openMapDialog(branch)}
                      >
                        VIEW MAP
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ 
                          borderRadius: 1, 
                          flexGrow: 1, 
                          ml: 1, 
                          textTransform: 'none',
                          bgcolor: '#3f8be4'
                        }}
                        onClick={() => openContactDialog(branch)}
                      >
                        CONTACT
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, mb: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No service centers found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search criteria
            </Typography>
          </Paper>
        )}        {/* Branch Locations Map */}
        {filteredBranches.length > 0 && (
          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: 2, 
              mb: 3, 
              overflow: 'hidden', 
              bgcolor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'white' }}>
              Branch Locations Map
            </Typography>
            
            <Box 
              sx={{ 
                height: 400, 
                width: '100%', 
                bgcolor: 'rgba(0, 0, 0, 0.2)', 
                borderRadius: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              {/* This would be replaced with an actual map component */}
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0,
                  backgroundImage: 'url(https://maps.googleapis.com/maps/api/staticmap?center=Los+Angeles,CA&zoom=11&size=1000x400&maptype=roadmap&style=feature:all|element:labels|visibility:on&style=feature:all|element:labels.text.fill|color:0x000000&style=feature:all|element:labels.text.stroke|color:0x000000&style=feature:all|element:labels.icon|visibility:off&style=feature:administrative|element:geometry.fill|color:0x000000&style=feature:administrative|element:geometry.stroke|color:0x000000|lightness:17|weight:1.2&style=feature:administrative|element:labels|visibility:off&style=feature:administrative.country|element:labels|visibility:off&style=feature:administrative.province|element:labels|visibility:off&style=feature:administrative.locality|element:labels|visibility:on&style=feature:administrative.neighborhood|element:labels|visibility:off&style=feature:administrative.land_parcel|element:labels|visibility:off&style=feature:landscape|element:geometry|color:0x000000&style=feature:landscape|element:labels|visibility:off&style=feature:landscape.natural|element:labels|visibility:off&style=feature:landscape.man_made|element:labels|visibility:off&style=feature:poi|element:geometry|color:0x000000&style=feature:poi|element:labels|visibility:off&style=feature:road|element:geometry.fill|color:0x0F1924&style=feature:road|element:geometry.stroke|color:0x0F1924&style=feature:road|element:labels|visibility:on|lightness:100&style=feature:road.highway|element:geometry.fill|color:0x0F1924&style=feature:road.highway|element:geometry.stroke|color:0x0F1924&style=feature:road.highway|element:labels|visibility:off&style=feature:road.arterial|element:geometry|color:0x0F1924&style=feature:road.arterial|element:labels|visibility:off&style=feature:road.local|element:geometry|color:0x0F1924&style=feature:road.local|element:labels|visibility:off&style=feature:transit|element:geometry|color:0x000000&style=feature:transit|element:labels|visibility:off&style=feature:water|element:geometry|color:0x0F1924&style=feature:water|element:labels|visibility:off&key=YOUR_API_KEY)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.6
                }}
              />
              
              <LocationOn sx={{ fontSize: 60, color: '#3f8be4', mb: 2, zIndex: 1 }} />
              <Typography variant="body1" sx={{ fontWeight: 500, zIndex: 1, color: 'white' }}>
                Interactive Map Coming Soon
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, zIndex: 1, color: 'rgba(255, 255, 255, 0.6)' }}>
                Showing {filteredBranches.length} of {branches.length} service centers
              </Typography>
            </Box>
          </Paper>
        )}
          {/* Map Dialog */}
        <Dialog 
          open={mapDialogOpen} 
          onClose={() => setMapDialogOpen(false)}
          fullWidth
          maxWidth="md"
          PaperProps={{
            sx: {
              bgcolor: '#0f1924',
              color: 'white',
              borderRadius: 1
            }
          }}
        >
          <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ color: 'white' }}>
                {selectedBranch?.name} - Map Location
              </Typography>
              <IconButton onClick={() => setMapDialogOpen(false)} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ height: 500, width: '100%', position: 'relative' }}>
              {/* This would be replaced with an actual map component */}
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0,
                  backgroundImage: 'url(https://maps.googleapis.com/maps/api/staticmap?center=Los+Angeles,CA&zoom=14&size=1000x500&maptype=roadmap&style=feature:all|element:labels|visibility:on&style=feature:all|element:labels.text.fill|color:0x000000&style=feature:all|element:labels.text.stroke|color:0x000000&style=feature:all|element:labels.icon|visibility:off&style=feature:administrative|element:geometry.fill|color:0x000000&style=feature:administrative|element:geometry.stroke|color:0x000000|lightness:17|weight:1.2&style=feature:administrative|element:labels|visibility:off&style=feature:administrative.country|element:labels|visibility:off&style=feature:administrative.province|element:labels|visibility:off&style=feature:administrative.locality|element:labels|visibility:on&style=feature:administrative.neighborhood|element:labels|visibility:off&style=feature:administrative.land_parcel|element:labels|visibility:off&style=feature:landscape|element:geometry|color:0x000000&style=feature:landscape|element:labels|visibility:off&style=feature:landscape.natural|element:labels|visibility:off&style=feature:landscape.man_made|element:labels|visibility:off&style=feature:poi|element:geometry|color:0x000000&style=feature:poi|element:labels|visibility:off&style=feature:road|element:geometry.fill|color:0x0F1924&style=feature:road|element:geometry.stroke|color:0x0F1924&style=feature:road|element:labels|visibility:on|lightness:100&style=feature:road.highway|element:geometry.fill|color:0x0F1924&style=feature:road.highway|element:geometry.stroke|color:0x0F1924&style=feature:road.highway|element:labels|visibility:off&style=feature:road.arterial|element:geometry|color:0x0F1924&style=feature:road.arterial|element:labels|visibility:off&style=feature:road.local|element:geometry|color:0x0F1924&style=feature:road.local|element:labels|visibility:off&style=feature:transit|element:geometry|color:0x000000&style=feature:transit|element:labels|visibility:off&style=feature:water|element:geometry|color:0x0F1924&style=feature:water|element:labels|visibility:off&markers=color:blue|Los+Angeles,CA&key=YOUR_API_KEY)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              
              <Box 
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  bgcolor: 'rgba(15, 25, 36, 0.9)',
                  p: 2,
                  borderRadius: 1,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  maxWidth: 300
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'white' }}>
                  {selectedBranch?.name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                  {selectedBranch?.location}
                </Typography>
                <Button 
                  variant="contained" 
                  size="small"
                  startIcon={<DirectionsCar />}
                  sx={{ bgcolor: '#3f8be4', borderRadius: 1, textTransform: 'none' }}
                >
                  Get Directions
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
        
        {/* Contact Dialog */}
        <Dialog 
          open={contactDialogOpen} 
          onClose={() => setContactDialogOpen(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              bgcolor: '#0f1924',
              color: 'white',
              borderRadius: 1
            }
          }}
        >
          <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ color: 'white' }}>
                Contact {selectedBranch?.name}
              </Typography>
              <IconButton onClick={() => setContactDialogOpen(false)} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 3, mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'white' }}>
                Service Center Information
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {selectedBranch?.location}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                {selectedBranch?.hours}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'white' }}>
                Contact Methods
              </Typography>
              
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<Call />} 
                sx={{ 
                  mb: 2, 
                  justifyContent: 'flex-start', 
                  py: 1, 
                  borderRadius: 1,
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    bgcolor: 'rgba(255, 255, 255, 0.03)'
                  }
                }}
                href={`tel:${selectedBranch?.phone}`}
              >
                Call: {selectedBranch?.phone}
              </Button>
              
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<WhatsApp sx={{ color: '#25D366' }} />} 
                sx={{ 
                  mb: 2, 
                  justifyContent: 'flex-start', 
                  py: 1, 
                  borderRadius: 1,
                  borderColor: 'rgba(37, 211, 102, 0.5)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'rgba(37, 211, 102, 0.8)',
                    bgcolor: 'rgba(37, 211, 102, 0.05)'
                  }
                }}
                href={`https://wa.me/${selectedBranch?.whatsapp}`}
              >
                WhatsApp: {selectedBranch?.phone}
              </Button>
              
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<Email />} 
                sx={{ 
                  justifyContent: 'flex-start', 
                  py: 1, 
                  borderRadius: 1,
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    bgcolor: 'rgba(255, 255, 255, 0.03)'
                  }
                }}
                href={`mailto:${selectedBranch?.email}`}
              >
                Email: {selectedBranch?.email}
              </Button>
            </Box>
            
            <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'white' }}>
                Manager
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {selectedBranch?.manager}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Button 
              onClick={() => setContactDialogOpen(false)}
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': { color: 'white' }
              }}
            >
              Close
            </Button>
            <Button 
              variant="contained" 
              onClick={() => {
                setContactDialogOpen(false);
                openMapDialog(selectedBranch);
              }}
              sx={{ bgcolor: '#3f8be4', borderRadius: 1, textTransform: 'none' }}
            >
              View on Map
            </Button>
          </DialogActions>
        </Dialog>
          {/* Snackbar for notifications */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={4000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            sx={{ 
              width: '100%',
              bgcolor: snackbar.severity === 'success' ? 'rgba(46, 125, 50, 0.9)' : 'rgba(25, 118, 210, 0.9)',
              color: 'white',
              '& .MuiAlert-icon': {
                color: 'white'
              }
            }}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </UserLayout>
  );
};

export default UserBranchesPage;

import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  Typography, 
  Button,
  Box,
  Alert,
  CircularProgress
} from "@mui/material";
import dashboardService from "../../services/dashboardService";

const APITester = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});

  const testEndpoint = async (name, apiCall) => {
    setLoading(true);
    try {
      const result = await apiCall();
      setResults(prev => ({
        ...prev,
        [name]: { success: true, data: result, error: null }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [name]: { 
          success: false, 
          data: null, 
          error: {
            status: error.response?.status,
            message: error.message,
            data: error.response?.data
          }
        }
      }));
    }
    setLoading(false);
  };

  const testAllEndpoints = async () => {
    setResults({});
    
    // Test user endpoints (these work)
    await testEndpoint('User Stats', dashboardService.getUserStats);
    
    // Test employee endpoints (these work)  
    await testEndpoint('Employee Stats', dashboardService.getEmployeeStats);
    
    // Test manager endpoints (these fail)
    await testEndpoint('Manager Stats', dashboardService.getManagerStats);
    await testEndpoint('Revenue Data', () => dashboardService.getRevenueData(6));
    await testEndpoint('Branch Performance', dashboardService.getBranchPerformance);
  };

  return (
    <Card sx={{ mt: 2, mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          API Endpoint Tester
        </Typography>
        
        <Button 
          variant="contained" 
          onClick={testAllEndpoints}
          disabled={loading}
          sx={{ mb: 2 }}
        >
          {loading ? <CircularProgress size={20} /> : 'Test All Endpoints'}
        </Button>

        {Object.entries(results).map(([name, result]) => (
          <Box key={name} sx={{ mb: 2 }}>
            <Alert 
              severity={result.success ? 'success' : 'error'}
              sx={{ mb: 1 }}
            >
              <Typography variant="subtitle2">
                {name}: {result.success ? 'SUCCESS' : 'FAILED'}
              </Typography>
              {!result.success && (
                <Typography variant="caption" component="div">
                  Status: {result.error.status} | Message: {result.error.message}
                  {result.error.data && (
                    <div>Response: {JSON.stringify(result.error.data)}</div>
                  )}
                </Typography>
              )}
            </Alert>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default APITester;
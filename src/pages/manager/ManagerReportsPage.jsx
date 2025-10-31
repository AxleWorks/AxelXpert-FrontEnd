import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Box,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Calendar,
  DollarSign,
  Clock,
  TrendingUp,
  Download,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ManagerLayout from "../../layouts/manager/ManagerLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { KPICard } from "../../components/ui/KPICard";
import PDFReportGenerator from "../../components/reports/PDFReportGenerator";
import {
  BOOKINGS_URL,
  BRANCHES_URL,
  SERVICES_URL,
  USERS_URL,
  VEHICLES_URL,
  TASKS_URL,
} from "../../config/apiEndpoints";
import { getAuthHeader } from "../../utils/jwtUtils";

const COLORS = ["#1976d2", "#00bfa5", "#ff9800", "#9c27b0", "#f44336"];

const ManagerReportsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState({
    kpis: {
      totalAppointments: 0,
      totalRevenue: 0,
      avgCompletionTime: 0,
      branchEfficiency: 0,
    },
    appointmentTrends: [],
    revenueByBranch: [],
    serviceCategoryData: [],
    performanceMetrics: {},
  });
  const [branches, setBranches] = useState([]);
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    branch: "all",
    serviceType: "all",
  });

  useEffect(() => {
    fetchReportData();
  }, [filters]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching data from endpoints...");

      // Get authentication header
      const authHeader = getAuthHeader();

      // Fetch data from multiple endpoints with authentication
      const [bookingsRes, branchesRes, servicesRes, usersRes, vehiclesRes] =
        await Promise.all([
          fetch(`${BOOKINGS_URL}`, {
            headers: authHeader ? { Authorization: authHeader } : {},
          }),
          fetch(`${BRANCHES_URL}/all`, {
            headers: authHeader ? { Authorization: authHeader } : {},
          }),
          fetch(`${SERVICES_URL}`, {
            headers: authHeader ? { Authorization: authHeader } : {},
          }),
          fetch(`${USERS_URL}/all`, {
            headers: authHeader ? { Authorization: authHeader } : {},
          }),
          fetch(`${VEHICLES_URL}`, {
            headers: authHeader ? { Authorization: authHeader } : {},
          }),
        ]);

      const [bookings, branches, services, users, vehicles] = await Promise.all(
        [
          bookingsRes.ok ? bookingsRes.json() : [],
          branchesRes.ok ? branchesRes.json() : [],
          servicesRes.ok ? servicesRes.json() : [],
          usersRes.ok ? usersRes.json() : [],
          vehiclesRes.ok ? vehiclesRes.json() : [],
        ]
      );

      console.log("Fetched data:", {
        bookings: bookings.length,
        branches: branches.length,
        services: services.length,
        users: users.length,
        vehicles: vehicles.length,
      });

      console.log("Sample booking:", bookings[0]);
      console.log("Sample branch:", branches[0]);
      console.log("Sample service:", services[0]);

      setBranches(branches);
      setServices(services);
      setAppointments(bookings); // Store raw appointments data for PDF

      // Process data for reports
      const processedData = processReportData(
        bookings,
        branches,
        services,
        users,
        vehicles
      );
      setReportData(processedData);

      console.log("Final processed data:", processedData);
    } catch (err) {
      console.error("Error fetching report data:", err);
      setError(`Error fetching data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const processReportData = (bookings, branches, services, users, vehicles) => {
    console.log("Processing data with actual endpoints...");

    // Ensure we have arrays
    const safeBookings = Array.isArray(bookings) ? bookings : [];
    const safeBranches = Array.isArray(branches) ? branches : [];
    const safeServices = Array.isArray(services) ? services : [];
    const safeUsers = Array.isArray(users) ? users : [];
    const safeVehicles = Array.isArray(vehicles) ? vehicles : [];

    // Filter bookings by date range and filters
    const filteredBookings = safeBookings.filter((booking) => {
      if (!booking) return false;

      // Parse booking date - be more flexible with date parsing
      const bookingDate = new Date(
        booking.startAt || booking.createdAt || booking.updatedAt || new Date()
      );

      // Make sure we have valid dates
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);

      // If booking date is invalid, include it
      const dateInRange =
        isNaN(bookingDate.getTime()) ||
        (bookingDate >= startDate && bookingDate <= endDate);

      // Branch filtering
      const branchMatch =
        filters.branch === "all" ||
        booking.branchId?.toString() === filters.branch ||
        booking.branchName
          ?.toLowerCase()
          .includes(filters.branch.toLowerCase());

      // Service type filtering
      const serviceMatch =
        filters.serviceType === "all" ||
        booking.serviceId?.toString() === filters.serviceType ||
        booking.serviceName
          ?.toLowerCase()
          .includes(filters.serviceType.toLowerCase());

      const result = dateInRange && branchMatch && serviceMatch;
      if (!result) {
        console.log("Filtered out booking:", {
          booking: booking.id,
          dateInRange,
          branchMatch,
          serviceMatch,
          bookingDate: bookingDate.toISOString(),
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });
      }
      return result;
    });

    console.log(
      `Filtered ${filteredBookings.length} bookings from ${safeBookings.length} total`
    );

    // If no bookings match filters, use all bookings for chart display
    const bookingsForCharts =
      filteredBookings.length > 0 ? filteredBookings : safeBookings;

    // Calculate KPIs from real data
    const totalAppointments = filteredBookings.length;

    // Calculate total revenue from totalPrice field
    const totalRevenue = filteredBookings.reduce((sum, booking) => {
      return sum + (parseFloat(booking.totalPrice) || 0);
    }, 0);

    // Calculate average completion time from service duration
    const completedBookings = filteredBookings.filter(
      (booking) =>
        booking.status === "COMPLETED" || booking.status === "FINISHED"
    );

    // Get average duration from services for completed bookings
    const avgCompletionTime =
      completedBookings.length > 0
        ? completedBookings.reduce((sum, booking) => {
            const service = safeServices.find(
              (s) => s.id === booking.serviceId
            );
            const durationHours = service?.durationMinutes
              ? service.durationMinutes / 60
              : 1;
            return sum + durationHours;
          }, 0) / completedBookings.length
        : 0;

    // Calculate branch efficiency (completed vs total bookings)
    const branchEfficiency =
      totalAppointments > 0
        ? Math.round((completedBookings.length / totalAppointments) * 100)
        : 0;

    // Generate appointment trends from actual booking dates
    const appointmentTrends = generateMonthlyTrendsFromData(bookingsForCharts);

    // Revenue by branch using actual data
    const revenueByBranch = safeBranches
      .map((branch) => {
        const branchBookings = bookingsForCharts.filter(
          (booking) => booking.branchId === branch.id
        );

        const revenue = branchBookings.reduce((sum, booking) => {
          return sum + (parseFloat(booking.totalPrice) || 0);
        }, 0);

        return {
          branch: branch.name,
          revenue: Math.round(revenue),
        };
      })
      .filter((item) => item.revenue >= 0); // Changed from > 0 to >= 0 to show branches with 0 revenue

    // Service category breakdown using actual service data
    const serviceCategoryData = safeServices
      .map((service) => {
        const serviceBookings = bookingsForCharts.filter(
          (booking) => booking.serviceId === service.id
        );

        return {
          name: service.name,
          value: serviceBookings.length,
        };
      })
      .filter((item) => item.value >= 0); // Changed from > 0 to >= 0 to show all services

    // Calculate performance metrics from real data
    const avgRevenuePerJob =
      totalAppointments > 0 ? Math.round(totalRevenue / totalAppointments) : 0;

    // Calculate repeat customers
    const customerBookings = {};
    filteredBookings.forEach((booking) => {
      const customerId = booking.customerId;
      if (customerId) {
        customerBookings[customerId] = (customerBookings[customerId] || 0) + 1;
      }
    });

    const repeatCustomers = Object.values(customerBookings).filter(
      (count) => count > 1
    ).length;
    const totalCustomers = Object.keys(customerBookings).length;
    const repeatCustomerPercentage =
      totalCustomers > 0
        ? Math.round((repeatCustomers / totalCustomers) * 100)
        : 0;

    // Calculate on-time completion based on start/end times
    const onTimeBookings = completedBookings.filter((booking) => {
      const service = safeServices.find((s) => s.id === booking.serviceId);
      if (!service || !booking.startAt || !booking.endAt) return true; // Assume on-time if no data

      const startTime = new Date(booking.startAt);
      const endTime = new Date(booking.endAt);
      const actualDuration = (endTime - startTime) / (1000 * 60); // minutes
      const expectedDuration = service.durationMinutes || 60;

      return actualDuration <= expectedDuration * 1.1; // 10% tolerance
    });

    const onTimeCompletion =
      completedBookings.length > 0
        ? Math.round((onTimeBookings.length / completedBookings.length) * 100)
        : 0;

    // Calculate booking conversion (completed vs cancelled)
    const cancelledBookings = filteredBookings.filter(
      (booking) => booking.status === "CANCELLED"
    );
    const bookingConversion =
      totalAppointments > 0
        ? Math.round(
            ((totalAppointments - cancelledBookings.length) /
              totalAppointments) *
              100
          )
        : 0;

    console.log("Processed metrics:", {
      totalAppointments,
      totalRevenue,
      avgCompletionTime: avgCompletionTime.toFixed(1),
      branchEfficiency,
      repeatCustomerPercentage,
      onTimeCompletion,
      bookingConversion,
    });

    console.log("Chart data:", {
      appointmentTrends: appointmentTrends.length,
      revenueByBranch: revenueByBranch.length,
      serviceCategoryData: serviceCategoryData.length,
    });

    // Ensure we always have some data for charts, even if empty
    const finalAppointmentTrends =
      appointmentTrends.length > 0
        ? appointmentTrends
        : [
            { month: "Jan", appointments: 0 },
            { month: "Feb", appointments: 0 },
            { month: "Mar", appointments: 0 },
            { month: "Apr", appointments: 0 },
            { month: "May", appointments: 0 },
            { month: "Jun", appointments: 0 },
          ];

    const finalRevenueByBranch =
      revenueByBranch.length > 0
        ? revenueByBranch
        : [{ branch: "No Data", revenue: 0 }];

    const finalServiceCategoryData =
      serviceCategoryData.length > 0
        ? serviceCategoryData
        : [{ name: "No Services", value: 1 }];

    return {
      kpis: {
        totalAppointments,
        totalRevenue: Math.round(totalRevenue),
        avgCompletionTime: parseFloat(avgCompletionTime.toFixed(1)),
        branchEfficiency,
      },
      appointmentTrends: finalAppointmentTrends,
      revenueByBranch: finalRevenueByBranch,
      serviceCategoryData: finalServiceCategoryData,
      performanceMetrics: {
        customerSatisfaction: 0, // Would need separate feedback/rating endpoint
        employeeUtilization: Math.min(100, Math.max(0, branchEfficiency + 10)), // Based on efficiency
        repeatCustomers: repeatCustomerPercentage,
        avgRevenuePerJob,
        onTimeCompletion,
        bookingConversion,
      },
    };
  };

  const generateMonthlyTrendsFromData = (bookings) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentYear = new Date().getFullYear();
    const monthCounts = {};

    // Initialize all months with 0
    months.forEach((month, index) => {
      monthCounts[index] = 0;
    });

    // Count bookings by month
    bookings.forEach((booking) => {
      const bookingDate = new Date(
        booking.startAt || booking.createdAt || booking.updatedAt
      );
      if (bookingDate.getFullYear() === currentYear) {
        const monthIndex = bookingDate.getMonth();
        monthCounts[monthIndex]++;
      }
    });

    // Return data for the last 6 months
    const currentMonth = new Date().getMonth();
    const trendsData = [];

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      trendsData.push({
        month: months[monthIndex],
        appointments: monthCounts[monthIndex] || 0,
      });
    }

    return trendsData;
  };

  const handleDownloadStart = () => {
    setDownloadingPDF(true);
  };

  const handleDownloadComplete = () => {
    setDownloadingPDF(false);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <ManagerLayout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      <Box sx={{ p: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              Reports & Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Comprehensive business insights and performance metrics
            </Typography>
          </Box>
          <PDFReportGenerator
            reportData={reportData}
            filters={filters}
            appointments={appointments}
            onDownloadStart={handleDownloadStart}
            onDownloadComplete={handleDownloadComplete}
          />
        </Box>

        {error && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error} - Showing demo data for illustration
          </Alert>
        )}

        {downloadingPDF && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CircularProgress size={20} />
              Generating PDF report... Please wait.
            </Box>
          </Alert>
        )}

        {/* Filters */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
                gap: 3,
              }}
            >
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Branch</Label>
                <Input
                  select
                  value={filters.branch}
                  onChange={(e) => handleFilterChange("branch", e.target.value)}
                  SelectProps={{ native: true }}
                >
                  <option value="all">All Branches</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </Input>
              </div>
              <div>
                <Label>Service Type</Label>
                <Input
                  select
                  value={filters.serviceType}
                  onChange={(e) =>
                    handleFilterChange("serviceType", e.target.value)
                  }
                  SelectProps={{ native: true }}
                >
                  <option value="all">All Services</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </Input>
              </div>
            </Box>
          </CardContent>
        </Card>

        {/* KPI Summary */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
            mb: 4,
          }}
        >
          <KPICard
            title="Total Appointments"
            value={reportData.kpis.totalAppointments.toLocaleString()}
            icon={Calendar}
            color="bg-primary"
            trend={`${reportData.kpis.totalAppointments} total bookings`}
            trendUp={reportData.kpis.totalAppointments > 0}
          />
          <KPICard
            title="Total Revenue"
            value={`$${reportData.kpis.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="bg-green"
            trend={`Avg $${reportData.performanceMetrics.avgRevenuePerJob} per job`}
            trendUp={reportData.kpis.totalRevenue > 0}
          />
          <KPICard
            title="Avg Completion Time"
            value={`${reportData.kpis.avgCompletionTime} hrs`}
            icon={Clock}
            color="bg-secondary"
            trend={`Based on ${reportData.serviceCategoryData.length} services`}
            trendUp={reportData.kpis.avgCompletionTime > 0}
          />
          <KPICard
            title="Branch Efficiency"
            value={`${reportData.kpis.branchEfficiency}%`}
            icon={TrendingUp}
            color="bg-accent"
            trend={`${reportData.revenueByBranch.length} active branches`}
            trendUp={reportData.kpis.branchEfficiency > 50}
          />
        </Box>

        {/* Charts Section */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "repeat(2, 1fr)" },
            gap: 3,
            mb: 4,
          }}
        >
          {/* Appointment Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Appointment Trends</CardTitle>
            </CardHeader>
            <CardContent>
              {reportData.appointmentTrends &&
              reportData.appointmentTrends.length > 0 ? (
                <Box sx={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart data={reportData.appointmentTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="appointments"
                        stroke="#1976d2"
                        strokeWidth={2}
                        name="Appointments"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Box
                  sx={{
                    height: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography color="text.secondary">
                    No appointment data available for the selected period
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Service Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Service Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {reportData.serviceCategoryData &&
              reportData.serviceCategoryData.length > 0 ? (
                <Box sx={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={reportData.serviceCategoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {reportData.serviceCategoryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Box
                  sx={{
                    height: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography color="text.secondary">
                    No service data available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Revenue by Branch */}
        <Card sx={{ mb: 4 }}>
          <CardHeader>
            <CardTitle>Revenue by Branch</CardTitle>
          </CardHeader>
          <CardContent>
            <Box sx={{ width: "100%", height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={reportData.revenueByBranch}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="branch" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#00bfa5" name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
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
              <Paper
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Customer Satisfaction
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {reportData.performanceMetrics.customerSatisfaction > 0
                    ? `${reportData.performanceMetrics.customerSatisfaction} / 5.0`
                    : "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Requires feedback data
                </Typography>
              </Paper>

              <Paper
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Employee Utilization
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {reportData.performanceMetrics.employeeUtilization}%
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      reportData.performanceMetrics.employeeUtilization > 70
                        ? "success.main"
                        : "warning.main",
                  }}
                >
                  Based on efficiency
                </Typography>
              </Paper>

              <Paper
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Repeat Customers
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {reportData.performanceMetrics.repeatCustomers}%
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      reportData.performanceMetrics.repeatCustomers > 50
                        ? "success.main"
                        : "warning.main",
                  }}
                >
                  From actual bookings
                </Typography>
              </Paper>

              <Paper
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Average Revenue per Job
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  ${reportData.performanceMetrics.avgRevenuePerJob}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      reportData.performanceMetrics.avgRevenuePerJob > 0
                        ? "success.main"
                        : "text.secondary",
                  }}
                >
                  Calculated from bookings
                </Typography>
              </Paper>

              <Paper
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  On-Time Completion
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {reportData.performanceMetrics.onTimeCompletion}%
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      reportData.performanceMetrics.onTimeCompletion > 80
                        ? "success.main"
                        : "warning.main",
                  }}
                >
                  Based on service duration
                </Typography>
              </Paper>

              <Paper
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Booking Conversion
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {reportData.performanceMetrics.bookingConversion}%
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      reportData.performanceMetrics.bookingConversion > 70
                        ? "success.main"
                        : "error.main",
                  }}
                >
                  Non-cancelled bookings
                </Typography>
              </Paper>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </ManagerLayout>
  );
};

export default ManagerReportsPage;

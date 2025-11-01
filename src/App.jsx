import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./components/ui/toast";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Auth Components
import SignIn from "./components/auth/SignIn";
import Signup from "./components/auth/Signup";
import ForgetPassword from "./pages/ForgetPassword";

// User Pages
import UserDashboardPage from "./pages/user/UserDashboardPage";
import UserSettingsPage from "./pages/user/UserSettingsPage";
import UserServicesPage from "./pages/user/UserServicesPage";
import UserVehiclesPage from "./pages/user/UserVehiclesPage";
import UserBookingCalendarPage from "./pages/user/UserBookingCalendarPage";
import UserBranchesPage from "./pages/user/UserBranchesPage";
import UserProgressTrackingPage from "./pages/user/UserProgressTrackingPage";

// Employee Pages
import EmployeeDashboardPage from "./pages/employee/EmployeeDashboardPage";
import EmployeeServicesPage from "./pages/employee/EmployeeServicesPage";
import EmployeeSettingsPage from "./pages/employee/EmployeeSettingsPage";
import EmployeeTasksPage from "./pages/employee/EmployeeTasksPage";
import EmployeeHistoryPage from "./pages/employee/EmployeeHistoryPage";

// Manager Pages
import ManagerDashboardPage from "./pages/manager/ManagerDashboardPage";
import ManagerBookingCalendarPage from "./pages/manager/ManagerBookingCalendarPage";
import ManagerProgressTrackingPage from "./pages/manager/ManagerProgressTrackingPage";
import ManagerUserManagementPage from "./pages/manager/ManagerUserManagementPage";
import ManagerReportsPage from "./pages/manager/ManagerReportsPage";
import ManagerSettingsPage from "./pages/manager/ManagerSettingsPage";
import ManagerServicesPage from "./pages/manager/ManagerServicesPage";
import ManagerBranchesPage from "./pages/manager/ManagerBranchesPage";

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
          <Routes>
            {/* Auth routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forget-password" element={<ForgetPassword />} />

            {/* User Routes */}
            <Route
              path="/user/dashboard"
              element={
                <ProtectedRoute requiredRole="user">
                  <UserDashboardPage />
                </ProtectedRoute>
              }
            />
            {/* user tasks/history removed */}
            <Route
              path="/user/vehicles"
              element={
                <ProtectedRoute requiredRole="user">
                  <UserVehiclesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/booking-calendar"
              element={
                <ProtectedRoute requiredRole="user">
                  <UserBookingCalendarPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/branches"
              element={
                <ProtectedRoute requiredRole="user">
                  <UserBranchesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/progress-tracking"
              element={
                <ProtectedRoute requiredRole="user">
                  <UserProgressTrackingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/settings"
              element={
                <ProtectedRoute requiredRole="user">
                  <UserSettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/services"
              element={
                <ProtectedRoute requiredRole="user">
                  <UserServicesPage />
                </ProtectedRoute>
              }
            />

            {/* Employee Routes */}
            <Route
              path="/employee/dashboard"
              element={
                <ProtectedRoute requiredRole="employee">
                  <EmployeeDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/tasks"
              element={
                <ProtectedRoute requiredRole="employee">
                  <EmployeeTasksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/history"
              element={
                <ProtectedRoute requiredRole="employee">
                  <EmployeeHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/services"
              element={
                <ProtectedRoute requiredRole="employee">
                  <EmployeeServicesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/settings"
              element={
                <ProtectedRoute requiredRole="employee">
                  <EmployeeSettingsPage />
                </ProtectedRoute>
              }
            />

            {/* Manager Routes */}
            <Route
              path="/manager/dashboard"
              element={
                <ProtectedRoute requiredRole="manager">
                  <ManagerDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/booking-calendar"
              element={
                <ProtectedRoute requiredRole="manager">
                  <ManagerBookingCalendarPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/progress-tracking"
              element={
                <ProtectedRoute requiredRole="manager">
                  <ManagerProgressTrackingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/user-management"
              element={
                <ProtectedRoute requiredRole="manager">
                  <ManagerUserManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/settings"
              element={
                <ProtectedRoute requiredRole="manager">
                  <ManagerSettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/services"
              element={
                <ProtectedRoute requiredRole="manager">
                  <ManagerServicesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/branches"
              element={
                <ProtectedRoute requiredRole="manager">
                  <ManagerBranchesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/reports"
              element={
                <ProtectedRoute requiredRole="manager">
                  <ManagerReportsPage />
                </ProtectedRoute>
              }
            />

            {/* Default route redirects to signin */}
            <Route path="/" element={<Navigate to="/signin" replace />} />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
        </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

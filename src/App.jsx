import React, { lazy, Suspense } from "react";
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

// Auth Components (keep these eager-loaded since they're small and critical)
import SignIn from "./components/auth/SignIn";
import Signup from "./components/auth/Signup";
import ForgetPassword from "./pages/Authentication/ForgetPassword";

// Lazy-load all pages
const UserDashboardPage = lazy(() => import("./pages/user/UserDashboardPage"));
const UserSettingsPage = lazy(() => import("./pages/user/UserSettingsPage"));
const UserServicesPage = lazy(() => import("./pages/user/UserServicesPage"));
const UserVehiclesPage = lazy(() => import("./pages/user/UserVehiclesPage"));
const UserBookingCalendarPage = lazy(() => import("./pages/user/UserBookingCalendarPage"));
const UserBranchesPage = lazy(() => import("./pages/user/UserBranchesPage"));
const UserProgressTrackingPage = lazy(() => import("./pages/user/UserProgressTrackingPage"));

const EmployeeDashboardPage = lazy(() => import("./pages/employee/EmployeeDashboardPage"));
const EmployeeServicesPage = lazy(() => import("./pages/employee/EmployeeServicesPage"));
const EmployeeSettingsPage = lazy(() => import("./pages/employee/EmployeeSettingsPage"));
const EmployeeTasksPage = lazy(() => import("./pages/employee/EmployeeTasksPage"));
const EmployeeHistoryPage = lazy(() => import("./pages/employee/EmployeeHistoryPage"));

const ManagerDashboardPage = lazy(() => import("./pages/manager/ManagerDashboardPage"));
const ManagerBookingCalendarPage = lazy(() => import("./pages/manager/ManagerBookingCalendarPage"));
const ManagerProgressTrackingPage = lazy(() => import("./pages/manager/ManagerProgressTrackingPage"));
const ManagerUserManagementPage = lazy(() => import("./pages/manager/ManagerUserManagementPage"));
const ManagerReportsPage = lazy(() => import("./pages/manager/ManagerReportsPage"));
const ManagerSettingsPage = lazy(() => import("./pages/manager/ManagerSettingsPage"));
const ManagerServicesPage = lazy(() => import("./pages/manager/ManagerServicesPage"));
const ManagerBranchesPage = lazy(() => import("./pages/manager/ManagerBranchesPage"));

// Loading fallback
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    Loading...
  </div>
);

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Suspense fallback={<LoadingFallback />}>
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
            </Suspense>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

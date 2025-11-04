import { authenticatedAxios as axios } from "../utils/axiosConfig";
import { API_PREFIX } from "../config/apiEndpoints";

const DASHBOARD_API = `${API_PREFIX}/dashboard`;

export const dashboardService = {
  // User Dashboard APIs
  getUserStats: async () => {
    console.log("Calling getUserStats API:", `${DASHBOARD_API}/user/stats`);
    const response = await axios.get(`${DASHBOARD_API}/user/stats`);
    console.log("getUserStats response:", response.data);
    return response.data;
  },

  getUserVehicles: async () => {
    const response = await axios.get(`${DASHBOARD_API}/user/vehicles`);
    return response.data;
  },

  getUserAppointments: async () => {
    const response = await axios.get(`${DASHBOARD_API}/user/appointments`);
    return response.data;
  },

  getUserServiceHistory: async (months = 6) => {
    const response = await axios.get(`${DASHBOARD_API}/user/service-history`, {
      params: { months },
    });
    return response.data;
  },

  getUserRecentTasks: async () => {
    const response = await axios.get(`${DASHBOARD_API}/user/recent-tasks`);
    return response.data;
  },

  // Manager Dashboard APIs
  getManagerStats: async () => {
    console.log(
      "Calling getManagerStats API:",
      `${DASHBOARD_API}/manager/stats`
    );
    const response = await axios.get(`${DASHBOARD_API}/manager/stats`);
    console.log("getManagerStats response:", response.data);
    return response.data;
  },

  getRevenueData: async (months = 6) => {
    const response = await axios.get(`${DASHBOARD_API}/manager/revenue`, {
      params: { months },
    });
    return response.data;
  },

  getBranchPerformance: async () => {
    const response = await axios.get(`${DASHBOARD_API}/manager/branches`);
    return response.data;
  },

  getServiceDistribution: async () => {
    const response = await axios.get(
      `${DASHBOARD_API}/manager/service-distribution`
    );
    return response.data;
  },

  getRecentBookings: async (limit = 10) => {
    const response = await axios.get(
      `${DASHBOARD_API}/manager/recent-bookings`,
      {
        params: { limit },
      }
    );
    return response.data;
  },

  // Employee Dashboard APIs
  getEmployeeStats: async () => {
    console.log(
      "Calling getEmployeeStats API:",
      `${DASHBOARD_API}/employee/stats`
    );
    const response = await axios.get(`${DASHBOARD_API}/employee/stats`);
    console.log("getEmployeeStats response:", response.data);
    return response.data;
  },

  getEmployeeTasks: async () => {
    const response = await axios.get(`${DASHBOARD_API}/employee/tasks`);
    return response.data;
  },

  getEmployeeProductivity: async () => {
    const response = await axios.get(`${DASHBOARD_API}/employee/productivity`);
    return response.data;
  },

  getEmployeeServiceTypes: async () => {
    const response = await axios.get(`${DASHBOARD_API}/employee/service-types`);
    return response.data;
  },

  getEmployeeActivity: async () => {
    const response = await axios.get(
      `${DASHBOARD_API}/employee/recent-activity`
    );
    return response.data;
  },

  // Admin Dashboard APIs (All Branches)
  getAdminStats: async () => {
    console.log("Calling getAdminStats API:", `${DASHBOARD_API}/admin/stats`);
    const response = await axios.get(`${DASHBOARD_API}/admin/stats`);
    console.log("getAdminStats response:", response.data);
    return response.data;
  },

  getAdminRevenueData: async (months = 6) => {
    const response = await axios.get(`${DASHBOARD_API}/admin/revenue`, {
      params: { months },
    });
    return response.data;
  },

  getAdminBranchPerformance: async () => {
    const response = await axios.get(`${DASHBOARD_API}/admin/branches`);
    return response.data;
  },

  getAdminServiceDistribution: async () => {
    const response = await axios.get(
      `${DASHBOARD_API}/admin/service-distribution`
    );
    return response.data;
  },

  getAdminRecentBookings: async (limit = 10) => {
    const response = await axios.get(`${DASHBOARD_API}/admin/recent-bookings`, {
      params: { limit },
    });
    return response.data;
  },
};

export default dashboardService;

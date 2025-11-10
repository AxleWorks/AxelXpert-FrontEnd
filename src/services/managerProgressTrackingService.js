import axios from "axios";
import { API_BASE, API_PREFIX } from "../config/apiEndpoints.jsx";

const API_BASE_URL = `${API_BASE}${API_PREFIX}`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to every request automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Get progress tracking data for a specific manager
 *
 * @param {number} managerId - The ID of the manager
 * @returns {Promise<Array>} - Array of progress tracking tasks for all services in manager's branch
 *
 * Response format:
 * [
 *   {
 *     id: 1,
 *     bookingId: 123,
 *     customerName: "John Doe",
 *     vehicle: "Toyota Camry 2020",
 *     assignedEmployeeName: "Tech Mike",
 *     durationMinutes: 120,
 *     title: "Oil Change Service",
 *     description: "Complete oil change...",
 *     status: "IN_PROGRESS",
 *     technicianNotes: [
 *       {
 *         content: "Started service",
 *         addedAt: "2025-11-06T09:00:00"
 *       }
 *     ],
 *     progressPhotos: ["url1", "url2"],
 *     subTasks: [...],
 *     startTime: "2025-11-06T09:00:00",
 *     completedTime: null,
 *     updatedAt: "2025-11-06T10:30:00"
 *   }
 * ]
 */
export const getManagerProgressTrackingTasks = async (managerId) => {
  try {
    const response = await apiClient.get(
      `/tasks/manager/${managerId}/progress-tracking`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching progress tracking tasks:", error);

    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch tasks");
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw new Error("Error setting up request: " + error.message);
    }
  }
};

export default getManagerProgressTrackingTasks;

import axios from 'axios';
import { API_BASE, API_PREFIX } from "../config/apiEndpoints.jsx";

const API_BASE_URL = `${API_BASE}${API_PREFIX}`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add JWT token to every request automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

/**
 * Get progress tracking data for a specific customer
 * 
 * @param {number} customerId - The ID of the customer
 * @returns {Promise<Array>} - Array of progress tracking tasks
 * 
 * Response format:
 * [
 *   {
 *     id: 101,
 *     customerName: "Shehan Maleesha",
 *     vehicle: "Toyota Aqua - 2019",
 *     durationMinutes: 120,
 *     title: "Full Vehicle Inspection & Service",
 *     description: "Perform 120-minute full service...",
 *     status: "IN_PROGRESS",
 *     technicianNotes: [
 *       {
 *         content: "Brake pads showing wear...",
 *         addedAt: "2025-10-26T09:15:00"
 *       }
 *     ],
 *     progressPhotos: ["url1", "url2"],
 *     subTasks: [...],
 *     startTime: "2025-10-26T09:00:00",
 *     completedTime: null,
 *     updatedAt: "2025-10-26T09:01:30"
 *   }
 * ]
 */
export const getUserProgressTrackingTasks = async (customerId) => {
  try {
    const response = await apiClient.get(
      `/tasks/customer/${customerId}/progress-tracking`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching progress tracking tasks:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch tasks');
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error('Error setting up request: ' + error.message);
    }
  }
};

export default getUserProgressTrackingTasks;
// SubTask API Service
// Helper functions for SubTask API calls

import { authenticatedAxios } from "../utils/axiosConfig.js";
import { SERVICES_URL } from "../config/apiEndpoints.jsx";

/**
 * SubTask API Service
 * Handles all API calls related to service subtasks
 */

export const subTaskService = {
  /**
   * Get all subtasks for a specific service
   * @param {number} serviceId - The service ID
   * @returns {Promise<Array>} Array of subtasks
   */
  getSubTasks: async (serviceId) => {
    try {
      const response = await authenticatedAxios.get(
        `${SERVICES_URL}/${serviceId}/subtasks`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching subtasks:", error);
      throw error;
    }
  },

  /**
   * Create a new subtask for a service
   * @param {number} serviceId - The service ID
   * @param {Object} subTaskData - The subtask data
   * @param {string} subTaskData.title - Subtask title (required)
   * @param {string} subTaskData.description - Subtask description (optional)
   * @param {number} subTaskData.orderIndex - Order index (required)
   * @param {boolean} subTaskData.isMandatory - Is mandatory flag (required)
   * @returns {Promise<Object>} Created subtask
   */
  createSubTask: async (serviceId, subTaskData) => {
    try {
      const response = await authenticatedAxios.post(
        `${SERVICES_URL}/${serviceId}/subtasks`,
        subTaskData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating subtask:", error);
      throw error;
    }
  },

  /**
   * Update an existing subtask
   * @param {number} subTaskId - The subtask ID
   * @param {Object} updateData - The fields to update
   * @param {string} [updateData.title] - Subtask title
   * @param {string} [updateData.description] - Subtask description
   * @param {number} [updateData.orderIndex] - Order index
   * @param {boolean} [updateData.isMandatory] - Is mandatory flag
   * @returns {Promise<Object>} Updated subtask
   */
  updateSubTask: async (subTaskId, updateData) => {
    try {
      const response = await authenticatedAxios.patch(
        `${SERVICES_URL}/subtasks/${subTaskId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating subtask:", error);
      throw error;
    }
  },

  /**
   * Delete a subtask
   * @param {number} subTaskId - The subtask ID
   * @returns {Promise<void>}
   */
  deleteSubTask: async (subTaskId) => {
    try {
      await authenticatedAxios.delete(`${SERVICES_URL}/subtasks/${subTaskId}`);
    } catch (error) {
      console.error("Error deleting subtask:", error);
      throw error;
    }
  },
};

export default subTaskService;

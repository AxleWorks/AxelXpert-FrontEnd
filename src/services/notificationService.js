import { authenticatedAxios } from "../utils/axiosConfig.js";

export const notificationService = {
  registerToken: async (token) => {
    try {
      const response = await authenticatedAxios.post("/api/notifications/token/register", {
        token
      });
      return response.data;
    } catch (error) {
      console.error("Error registering FCM token:", error);
      throw error;
    }
  },

  getNotifications: async (userid) => {
    try {
      const response = await authenticatedAxios.get(`/api/notifications/user/${userid}`);
      return response.data; 
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  markAsRead: async (notificationId) => {
    try {
      const response = await authenticatedAxios.patch(
        `api/notifications/${notificationId}`,
        { isRead: true }
      );
      return response.data;
    } catch (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error);
      throw error;
    }
  },

  deleteNotification: async (notificationId) => {
    try {
      const response = await authenticatedAxios.delete(
        `api/notifications/${notificationId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting notification ${notificationId}:`, error);
      throw error;
    }
  },

};

export default notificationService;

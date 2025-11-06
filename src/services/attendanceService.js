import { authenticatedAxios as axios } from '../utils/axiosConfig';

// Base API URL for attendance endpoints
const ATTENDANCE_API = '/api/attendance';

/**
 * Attendance Service
 * Handles all attendance-related API calls
 */
export const attendanceService = {
  // Create new attendance record
  createAttendance: async (attendanceData) => {
    try {
      const response = await axios.post(ATTENDANCE_API, attendanceData);
      return response.data;
    } catch (error) {
      console.error('Error creating attendance:', error);
      throw error;
    }
  },

  // Update existing attendance record
  updateAttendance: async (id, updateData) => {
    try {
      const response = await axios.put(`${ATTENDANCE_API}/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }
  },

  // Get attendance by ID
  getAttendanceById: async (id) => {
    try {
      const response = await axios.get(`${ATTENDANCE_API}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance by ID:', error);
      throw error;
    }
  },

  // Get attendance records for a specific branch and date
  getAttendanceByBranchAndDate: async (branchId, date) => {
    try {
      const response = await axios.get(`${ATTENDANCE_API}/branch/${branchId}/date/${date}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance by branch and date:', error);
      throw error;
    }
  },

  // Get attendance records for a branch within a date range
  getAttendanceByBranchAndDateRange: async (branchId, startDate, endDate) => {
    try {
      const response = await axios.get(`${ATTENDANCE_API}/branch/${branchId}`, {
        params: {
          startDate,
          endDate
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance by branch and date range:', error);
      throw error;
    }
  },

  // Get attendance for a specific user and date
  getAttendanceByUserAndDate: async (userId, date) => {
    try {
      const response = await axios.get(`${ATTENDANCE_API}/user/${userId}/date/${date}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance by user and date:', error);
      throw error;
    }
  },

  // Get calendar attendance data
  getAttendanceCalendarData: async (branchId, startDate, endDate) => {
    try {
      const params = {
        startDate,
        endDate
      };
      
      if (branchId) {
        params.branchId = branchId;
      }

      const response = await axios.get(`${ATTENDANCE_API}/calendar`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      throw error;
    }
  },

  // Delete attendance record
  deleteAttendance: async (id) => {
    try {
      await axios.delete(`${ATTENDANCE_API}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting attendance:', error);
      throw error;
    }
  },

  // Utility function to format date for API
  formatDateForAPI: (date) => {
    if (!date) return null;
    
    if (typeof date === 'string') {
      return date;
    }
    
    if (date instanceof Date) {
      return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    }
    
    return null;
  },

  // Utility function to format time for API
  formatTimeForAPI: (time) => {
    if (!time) return null;
    
    if (typeof time === 'string') {
      return time;
    }
    
    if (time instanceof Date) {
      return time.toTimeString().split(' ')[0]; // HH:MM:SS format
    }
    
    return null;
  }
};

export default attendanceService;
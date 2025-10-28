// API service for booking operations
const API_BASE_URL = "http://localhost:8080/api/bookings";

/**
 * Create a new booking
 * @param {Object} bookingData - Booking data matching CreateBookingRequest DTO
 * @returns {Promise<Object>} Created booking data
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create booking");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

/**
 * Get all bookings
 * @param {number} count - Optional limit for number of bookings
 * @returns {Promise<Array>} List of bookings
 */
export const getAllBookings = async (count = null) => {
  try {
    const url = count ? `${API_BASE_URL}/all?count=${count}` : `${API_BASE_URL}/all`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch bookings");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

/**
 * Get bookings for a specific customer
 * @param {number} customerId - Customer ID
 * @returns {Promise<Array>} List of customer's bookings
 */
export const getCustomerBookings = async (customerId) => {
  try {
    const allBookings = await getAllBookings();
    // Filter bookings for this customer
    return allBookings.filter(booking => booking.customerId === customerId);
  } catch (error) {
    console.error("Error fetching customer bookings:", error);
    throw error;
  }
};

/**
 * Assign an employee to a booking
 * @param {number} bookingId - Booking ID
 * @param {number} employeeId - Employee ID
 * @returns {Promise<Object>} Updated booking data
 */
export const assignEmployee = async (bookingId, employeeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${bookingId}/assign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ employeeId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to assign employee");
    }

    return await response.json();
  } catch (error) {
    console.error("Error assigning employee:", error);
    throw error;
  }
};

/**
 * Reject a booking
 * @param {number} bookingId - Booking ID
 * @param {string} reason - Rejection reason
 * @param {string} notes - Additional notes
 * @returns {Promise<Object>} Updated booking data
 */
export const rejectBooking = async (bookingId, reason, notes = "") => {
  try {
    const response = await fetch(`${API_BASE_URL}/${bookingId}/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason, notes }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to reject booking");
    }

    return await response.json();
  } catch (error) {
    console.error("Error rejecting booking:", error);
    throw error;
  }
};

/**
 * Delete a booking (only allowed for Pending status)
 * @param {number} bookingId - Booking ID
 * @returns {Promise<void>}
 */
export const deleteBooking = async (bookingId) => {
  try {
    console.log(`Attempting to delete booking with ID: ${bookingId}`);
    
    const response = await fetch(`${API_BASE_URL}/${bookingId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(`Delete response status: ${response.status}`);

    if (!response.ok) {
      let errorMessage = "Failed to delete booking";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // Response might not be JSON
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    // Successfully deleted - response might be empty (204 No Content) or JSON
    console.log("Booking deleted successfully");
    return;
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};

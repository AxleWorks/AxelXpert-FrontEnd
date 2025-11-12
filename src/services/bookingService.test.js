import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createBooking,
  getAllBookings,
  deleteBooking,
  assignEmployee,
  rejectBooking,
  getCustomerBookings,
} from './bookingService';
import * as jwtUtils from '../utils/jwtUtils';

// Mock the JWT utils
vi.mock('../utils/jwtUtils', () => ({
  createAuthenticatedFetchOptions: vi.fn((options = {}) => ({
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer mock-token',
      ...options.headers,
    },
  })),
}));

describe('Booking Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('createBooking', () => {
    it('should create a booking successfully', async () => {
      const mockBooking = {
        id: 1,
        userId: 123,
        serviceId: 456,
        vehicleId: 789,
        dateTime: '2025-11-15T10:00:00',
        status: 'PENDING',
      };

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockBooking),
      };

      global.fetch.mockResolvedValue(mockResponse);

      const bookingData = {
        userId: 123,
        serviceId: 456,
        vehicleId: 789,
        dateTime: '2025-11-15T10:00:00',
      };

      const result = await createBooking(bookingData);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockBooking);
      expect(result.status).toBe('PENDING');
    });

    it('should throw error when booking creation fails', async () => {
      const mockError = {
        ok: false,
        json: vi.fn().mockResolvedValue({ message: 'Invalid booking data' }),
      };

      global.fetch.mockResolvedValue(mockError);

      const bookingData = {
        userId: 123,
        serviceId: 456,
      };

      await expect(createBooking(bookingData)).rejects.toThrow(
        'Invalid booking data'
      );
    });

    it('should handle network errors', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));

      const bookingData = {
        userId: 123,
        serviceId: 456,
      };

      await expect(createBooking(bookingData)).rejects.toThrow('Network error');
    });
  });

  describe('getAllBookings', () => {
    it('should fetch all bookings without limit', async () => {
      const mockBookings = [
        { id: 1, userId: 123, status: 'PENDING' },
        { id: 2, userId: 124, status: 'CONFIRMED' },
      ];

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockBookings),
      };

      global.fetch.mockResolvedValue(mockResponse);

      const result = await getAllBookings();

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockBookings);
      expect(result.length).toBe(2);
    });

    it('should fetch bookings with count limit', async () => {
      const mockBookings = [{ id: 1, userId: 123, status: 'PENDING' }];

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockBookings),
      };

      global.fetch.mockResolvedValue(mockResponse);

      const result = await getAllBookings(1);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('count=1'),
        expect.any(Object)
      );
      expect(result.length).toBe(1);
    });

    it('should throw error when fetching fails', async () => {
      const mockError = {
        ok: false,
      };

      global.fetch.mockResolvedValue(mockError);

      await expect(getAllBookings()).rejects.toThrow('Failed to fetch bookings');
    });
  });

  describe('getCustomerBookings', () => {
    it('should fetch bookings for a specific customer', async () => {
      const mockBookings = [
        { id: 1, customerId: 123, status: 'PENDING' },
        { id: 2, customerId: 456, status: 'CONFIRMED' },
        { id: 3, customerId: 123, status: 'COMPLETED' },
      ];

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockBookings),
      };

      global.fetch.mockResolvedValue(mockResponse);

      const result = await getCustomerBookings(123);

      expect(result.length).toBe(2);
      expect(result.every(booking => booking.customerId === 123)).toBe(true);
    });
  });

  describe('assignEmployee', () => {
    it('should assign an employee to a booking', async () => {
      const mockAssignedBooking = {
        id: 1,
        employeeId: 789,
        status: 'ASSIGNED',
      };

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockAssignedBooking),
      };

      global.fetch.mockResolvedValue(mockResponse);

      const result = await assignEmployee(1, 789);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/1/assign'),
        expect.objectContaining({
          method: 'POST',
        })
      );
      expect(result.employeeId).toBe(789);
    });

    it('should handle assignment errors', async () => {
      const mockError = {
        ok: false,
        json: vi.fn().mockResolvedValue({ message: 'Employee not available' }),
      };

      global.fetch.mockResolvedValue(mockError);

      await expect(assignEmployee(1, 789)).rejects.toThrow('Employee not available');
    });
  });

  describe('rejectBooking', () => {
    it('should reject a booking with reason', async () => {
      const mockRejectedBooking = {
        id: 1,
        status: 'REJECTED',
        rejectionReason: 'Vehicle not suitable',
      };

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockRejectedBooking),
      };

      global.fetch.mockResolvedValue(mockResponse);

      const result = await rejectBooking(1, 'Vehicle not suitable', 'Contact customer');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/1/reject'),
        expect.objectContaining({
          method: 'POST',
        })
      );
      expect(result.status).toBe('REJECTED');
    });
  });

  describe('deleteBooking', () => {
    it('should delete a booking successfully', async () => {
      const mockResponse = {
        ok: true,
        status: 204,
      };

      global.fetch.mockResolvedValue(mockResponse);

      // deleteBooking returns void (undefined) on success
      const result = await deleteBooking(1);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
      expect(result).toBeUndefined(); // Returns nothing on success
    });

    it('should handle deletion errors', async () => {
      const mockError = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: vi.fn().mockResolvedValue({ message: 'Cannot delete non-pending booking' }),
      };

      global.fetch.mockResolvedValue(mockError);

      await expect(deleteBooking(1)).rejects.toThrow('Cannot delete non-pending booking');
    });
  });
});

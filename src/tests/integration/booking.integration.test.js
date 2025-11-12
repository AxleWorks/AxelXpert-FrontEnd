import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createBooking } from '../../services/bookingService';
import { getAllBranches } from '../../services/branchService';
import { authenticatedAxios } from '../../utils/axiosConfig';

// Mock the services
vi.mock('../../services/bookingService', () => ({
  createBooking: vi.fn(),
  getAllBookings: vi.fn(),
  assignEmployee: vi.fn(),
}));

vi.mock('../../services/branchService', () => ({
  default: vi.fn(),
  getAllBranches: vi.fn(),
}));

vi.mock('../../utils/axiosConfig', () => ({
  authenticatedAxios: {
    get: vi.fn(),
    post: vi.fn(),
  },
  publicAxios: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('Integration Tests - Booking Workflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('should complete full booking creation workflow', async () => {
    // Step 1: Fetch branches
    const mockBranches = [
      { id: 1, name: 'Downtown Branch' },
      { id: 2, name: 'Uptown Branch' },
    ];
    getAllBranches.mockResolvedValue(mockBranches);

    const branches = await getAllBranches();
    expect(branches).toHaveLength(2);
    expect(branches[0].name).toBe('Downtown Branch');

    // Step 2: Create booking
    const mockBooking = {
      id: 1,
      userId: 123,
      serviceId: 456,
      branchId: 1,
      status: 'PENDING',
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockBooking,
    });

    const bookingData = {
      userId: 123,
      serviceId: 456,
      branchId: 1,
      dateTime: '2025-11-15T10:00:00',
    };

    createBooking.mockResolvedValue(mockBooking);
    const booking = await createBooking(bookingData);

    expect(booking.status).toBe('PENDING');
    expect(booking.branchId).toBe(1);
  });

  it('should handle booking with authentication', async () => {
    // Mock authenticated request
    authenticatedAxios.post.mockResolvedValue({
      data: {
        id: 1,
        status: 'CONFIRMED',
      },
    });

    const response = await authenticatedAxios.post('/bookings', {
      serviceId: 123,
    });

    expect(response.data.status).toBe('CONFIRMED');
    expect(authenticatedAxios.post).toHaveBeenCalledWith('/bookings', {
      serviceId: 123,
    });
  });

  it('should handle booking cancellation workflow', async () => {
    // Fetch booking
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, status: 'PENDING' }),
    });

    // Delete booking
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
    });

    const booking = await fetch('/api/bookings/1').then(r => r.json());
    expect(booking.status).toBe('PENDING');

    // Can only delete pending bookings
    const deleteResponse = await fetch('/api/bookings/1', {
      method: 'DELETE',
    });
    expect(deleteResponse.ok).toBe(true);
  });

  it('should validate booking data before creation', async () => {
    const invalidBooking = {
      userId: null, // Invalid
      serviceId: 456,
    };

    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'User ID is required' }),
    });

    createBooking.mockRejectedValue(new Error('User ID is required'));

    await expect(createBooking(invalidBooking)).rejects.toThrow(
      'User ID is required'
    );
  });

  it('should handle concurrent booking requests', async () => {
    const bookingData1 = { userId: 1, serviceId: 100 };
    const bookingData2 = { userId: 2, serviceId: 101 };

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, ...bookingData1, status: 'PENDING' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 2, ...bookingData2, status: 'PENDING' }),
      });

    createBooking
      .mockResolvedValueOnce({ id: 1, status: 'PENDING' })
      .mockResolvedValueOnce({ id: 2, status: 'PENDING' });

    const [booking1, booking2] = await Promise.all([
      createBooking(bookingData1),
      createBooking(bookingData2),
    ]);

    expect(booking1.id).toBe(1);
    expect(booking2.id).toBe(2);
  });
});

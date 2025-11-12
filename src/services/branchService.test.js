import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';
import getAllBranches from './branchService';

// Mock axios
vi.mock('axios');

describe('Branch Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
  });

  describe('getAllBranches', () => {
    it('should fetch branches successfully with token', async () => {
      const mockBranches = [
        {
          id: 1,
          name: 'Downtown Branch',
          address: '123 Main St',
          phone: '555-0100',
        },
        {
          id: 2,
          name: 'Uptown Branch',
          address: '456 Park Ave',
          phone: '555-0200',
        },
      ];

      global.localStorage.getItem.mockReturnValue('mock-access-token');
      axios.get.mockResolvedValue({ data: mockBranches });

      const result = await getAllBranches();

      expect(axios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer mock-access-token',
          },
        })
      );
      expect(result).toEqual(mockBranches);
      expect(result.length).toBe(2);
    });

    it('should fetch branches without token (public access)', async () => {
      const mockBranches = [
        { id: 1, name: 'Public Branch', address: '789 Oak St' },
      ];

      global.localStorage.getItem.mockReturnValue(null);
      axios.get.mockResolvedValue({ data: mockBranches });

      const result = await getAllBranches();

      expect(axios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            Authorization: undefined,
          },
        })
      );
      expect(result).toEqual(mockBranches);
    });

    it('should handle API errors gracefully', async () => {
      global.localStorage.getItem.mockReturnValue('mock-token');
      axios.get.mockRejectedValue(new Error('Network Error'));

      await expect(getAllBranches()).rejects.toThrow('Network Error');
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    it('should handle empty branch list', async () => {
      global.localStorage.getItem.mockReturnValue('mock-token');
      axios.get.mockResolvedValue({ data: [] });

      const result = await getAllBranches();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should include Authorization header format correctly', async () => {
      const testToken = 'test-jwt-token-123';
      global.localStorage.getItem.mockReturnValue(testToken);
      axios.get.mockResolvedValue({ data: [] });

      await getAllBranches();

      expect(axios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            Authorization: `Bearer ${testToken}`,
          },
        })
      );
    });
  });
});

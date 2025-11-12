import { describe, it, expect, beforeEach, vi } from 'vitest';
import { uploadImageToCloudinary } from './cloudinaryUtils';

describe('Cloudinary Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    global.FormData = class FormData {
      constructor() {
        this.data = {};
      }
      append(key, value) {
        this.data[key] = value;
      }
    };
  });

  describe('uploadImageToCloudinary', () => {
    it('should upload a valid image successfully', async () => {
      const mockFile = new File(['image content'], 'test.jpg', {
        type: 'image/jpeg',
      });
      Object.defineProperty(mockFile, 'size', { value: 1024 * 1024 }); // 1MB

      const mockResponse = {
        secure_url: 'https://res.cloudinary.com/test/image/upload/test.jpg',
        public_id: 'test_image_123',
        width: 800,
        height: 600,
        format: 'jpg',
        resource_type: 'image',
        bytes: 1048576,
        created_at: '2025-11-12T10:00:00Z',
        version: 1699789200,
        signature: 'abc123',
        folder: 'profile_photos',
        original_filename: 'test',
      };

      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await uploadImageToCloudinary(mockFile);

      expect(result.success).toBe(true);
      expect(result.data.url).toBe(mockResponse.secure_url);
      expect(result.data.publicId).toBe(mockResponse.public_id);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should reject files that are too large', async () => {
      const mockFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg', {
        type: 'image/jpeg',
      });
      Object.defineProperty(mockFile, 'size', { value: 11 * 1024 * 1024 }); // 11MB

      const result = await uploadImageToCloudinary(mockFile);

      expect(result.success).toBe(false);
      expect(result.error).toContain('File size too large');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should reject invalid file types', async () => {
      const mockFile = new File(['content'], 'test.pdf', {
        type: 'application/pdf',
      });
      Object.defineProperty(mockFile, 'size', { value: 1024 });

      const result = await uploadImageToCloudinary(mockFile);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid file type');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should reject when no file is provided', async () => {
      const result = await uploadImageToCloudinary(null);

      expect(result.success).toBe(false);
      expect(result.error).toContain('No file provided');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should handle upload failures', async () => {
      const mockFile = new File(['content'], 'test.jpg', {
        type: 'image/jpeg',
      });
      Object.defineProperty(mockFile, 'size', { value: 1024 });

      global.fetch.mockResolvedValue({
        ok: false,
        json: async () => ({
          error: { message: 'Upload failed: Invalid credentials' },
        }),
      });

      const result = await uploadImageToCloudinary(mockFile);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Upload failed');
    });

    it('should accept all valid image formats', async () => {
      const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

      for (const format of validFormats) {
        const mockFile = new File(['content'], `test.${format.split('/')[1]}`, {
          type: format,
        });
        Object.defineProperty(mockFile, 'size', { value: 1024 });

        global.fetch.mockResolvedValue({
          ok: true,
          json: async () => ({
            secure_url: 'https://cloudinary.com/test.jpg',
            public_id: 'test',
            width: 100,
            height: 100,
            format: format.split('/')[1],
            resource_type: 'image',
            bytes: 1024,
            created_at: '2025-11-12',
          }),
        });

        const result = await uploadImageToCloudinary(mockFile);
        expect(result.success).toBe(true);
      }
    });

    it('should include folder option when provided', async () => {
      const mockFile = new File(['content'], 'test.jpg', {
        type: 'image/jpeg',
      });
      Object.defineProperty(mockFile, 'size', { value: 1024 });

      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          secure_url: 'https://cloudinary.com/test.jpg',
          public_id: 'custom_folder/test',
          folder: 'custom_folder',
          width: 100,
          height: 100,
          format: 'jpg',
          resource_type: 'image',
          bytes: 1024,
          created_at: '2025-11-12',
        }),
      });

      const result = await uploadImageToCloudinary(mockFile, {
        folder: 'custom_folder',
      });

      expect(result.success).toBe(true);
      expect(result.data.folder).toBe('custom_folder');
    });

    it('should handle network errors', async () => {
      const mockFile = new File(['content'], 'test.jpg', {
        type: 'image/jpeg',
      });
      Object.defineProperty(mockFile, 'size', { value: 1024 });

      global.fetch.mockRejectedValue(new Error('Network error'));

      const result = await uploadImageToCloudinary(mockFile);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network error');
    });
  });
});

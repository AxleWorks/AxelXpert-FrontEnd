// Cloudinary upload utility with full CRUD operations
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY ;
const CLOUDINARY_API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET;

/**
 * Upload image to Cloudinary
 * @param {File} file - The image file to upload
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Upload result with secure_url
 */
export const uploadImageToCloudinary = async (file, options = {}) => {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 10MB.');
    }

    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'profile_photos'); // Upload preset handles transformations
    
    // Folder organization (allowed for unsigned uploads)
    if (options.folder) {
      formData.append('folder', options.folder);
    }

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const result = await response.json();
    
    return {
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        resourceType: result.resource_type,
        bytes: result.bytes,
        createdAt: result.created_at,
        version: result.version,
        signature: result.signature,
        folder: result.folder,
        originalFilename: result.original_filename
      }
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message || 'Upload failed'
    };
  }
};

/**
 * Delete image from Cloudinary using Admin API
 * @param {string} publicId - The public ID of the image to delete
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteImageFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      throw new Error('Public ID is required for deletion');
    }

    // Generate timestamp
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // Create signature for authenticated request
    const signature = await generateSignature({
      public_id: publicId,
      timestamp: timestamp
    });

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('signature', signature);
    formData.append('api_key', CLOUDINARY_API_KEY);
    formData.append('timestamp', timestamp.toString());

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Deletion failed');
    }

    const result = await response.json();
    
    return {
      success: result.result === 'ok',
      data: result,
      message: result.result === 'ok' ? 'Image deleted successfully' : 'Image not found or already deleted'
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: error.message || 'Deletion failed'
    };
  }
};

/**
 * Generate Cloudinary signature for authenticated requests
 * @param {Object} params - Parameters to sign
 * @returns {Promise<string>} - Generated signature
 */
const generateSignature = async (params) => {
  // Sort parameters
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');

  const stringToSign = `${sortedParams}${CLOUDINARY_API_SECRET}`;
  
  // Generate SHA-1 hash
  const encoder = new TextEncoder();
  const data = encoder.encode(stringToSign);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
};

/**
 * Generate optimized Cloudinary URL with transformations
 * @param {string} publicId - The public ID of the image
 * @param {Object} transformations - Transformation parameters
 * @returns {string} - Transformed image URL
 */
export const generateCloudinaryUrl = (publicId, transformations = {}) => {
  if (!publicId) return '';
  
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  
  // Default transformations for profile pictures
  const defaultTransforms = {
    width: 400,
    height: 400,
    crop: 'fill',
    gravity: 'face',
    quality: 'auto',
    format: 'auto'
  };
  
  const transforms = { ...defaultTransforms, ...transformations };
  
  // Build transformation string
  const transformString = Object.entries(transforms)
    .map(([key, value]) => {
      const shortKey = getShortKey(key);
      return `${shortKey}_${value}`;
    })
    .join(',');
  
  return `${baseUrl}/${transformString}/${publicId}`;
};

/**
 * Get multiple variations of an image
 * @param {string} publicId - The public ID of the image
 * @returns {Object} - Object with different image sizes
 */
export const getImageVariations = (publicId) => {
  if (!publicId) return {};
  
  return {
    thumbnail: generateCloudinaryUrl(publicId, { width: 100, height: 100 }),
    small: generateCloudinaryUrl(publicId, { width: 200, height: 200 }),
    medium: generateCloudinaryUrl(publicId, { width: 400, height: 400 }),
    large: generateCloudinaryUrl(publicId, { width: 800, height: 800 }),
    original: generateCloudinaryUrl(publicId, { quality: 'auto', format: 'auto' })
  };
};

// Helper function to convert transformation keys to Cloudinary short format
const getShortKey = (key) => {
  const keyMap = {
    width: 'w',
    height: 'h',
    crop: 'c',
    gravity: 'g',
    quality: 'q',
    format: 'f',
    radius: 'r',
    effect: 'e',
    overlay: 'l',
    underlay: 'u',
    angle: 'a',
    opacity: 'o',
    border: 'bo',
    color: 'co',
    dpr: 'dpr',
    flags: 'fl'
  };
  
  return keyMap[key] || key;
};

/**
 * Validate image file before upload
 * @param {File} file - File to validate
 * @returns {Promise<Array>} - Array of validation errors (empty if valid)
 */
export const validateImageFile = async (file) => {
  const errors = [];
  
  if (!file) {
    errors.push('No file selected');
    return errors;
  }
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
  }
  
  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    errors.push('File size too large. Maximum size is 10MB.');
  }
  
  // Check minimum dimensions
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      if (img.width < 50 || img.height < 50) {
        errors.push('Image too small. Minimum size is 50x50 pixels.');
      }
      resolve(errors);
    };
    img.onerror = () => {
      errors.push('Invalid image file.');
      resolve(errors);
    };
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string} - Public ID
 */
export const extractPublicIdFromUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return '';
  
  try {
    // Extract public ID from URL
    const parts = url.split('/');
    const uploadIndex = parts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) return '';
    
    // Skip transformation parameters and get the public ID
    let publicIdParts = parts.slice(uploadIndex + 1);
    
    // Remove version if present (starts with 'v' followed by numbers)
    if (publicIdParts[0] && publicIdParts[0].match(/^v\d+$/)) {
      publicIdParts = publicIdParts.slice(1);
    }
    
    // Join remaining parts and remove file extension
    const publicId = publicIdParts.join('/');
    return publicId.replace(/\.[^/.]+$/, ''); // Remove file extension
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return '';
  }
};

export default {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
  generateCloudinaryUrl,
  getImageVariations,
  validateImageFile,
  extractPublicIdFromUrl
};
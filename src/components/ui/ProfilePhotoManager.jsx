import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, Loader2, Edit3, Trash2, RotateCw } from 'lucide-react';
import { 
  Box, 
  Avatar, 
  IconButton, 
  Button, 
  CircularProgress, 
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Backdrop
} from '@mui/material';
import { toast } from '../ui/toast';
import { API_BASE } from '../../config/apiEndpoints';
import { 
  uploadImageToCloudinary, 
  deleteImageFromCloudinary, 
  extractPublicIdFromUrl,
  validateImageFile,
  generateCloudinaryUrl 
} from '../../utils/cloudinaryUtils';

const ProfilePhotoManager = ({ 
  currentImageUrl, 
  userId, 
  onImageUpdate, 
  size = 120,
  editable = true 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Validate file
      const validationErrors = await validateImageFile(file);
      if (validationErrors.length > 0) {
        toast.error('Invalid file', {
          description: validationErrors.join(' ')
        });
        return;
      }

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      setSelectedFile(file);

    } catch (error) {
      console.error('File validation error:', error);
      toast.error('File validation failed', {
        description: 'Please try again with a different image.'
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !userId) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 20;
        });
      }, 200);

      // Upload to Cloudinary first
      const uploadResult = await uploadImageToCloudinary(selectedFile, {
        folder: `profile_photos/user_${userId}`
      });

      clearInterval(progressInterval);
      setUploadProgress(95);

      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }

      // Save the Cloudinary URL to backend
      const response = await fetch(`${API_BASE}/api/users/${userId}/profile-image`, {
        method: 'PUT',
        headers: {
          Authorization:
              "Bearer " +
              JSON.parse(localStorage.getItem("authUser") || "{}").JWTToken,
                "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileImageUrl: uploadResult.data.url,
          cloudinaryPublicId: uploadResult.data.publicId
        })
      });

      setUploadProgress(100);

      if (!response.ok) {
        // If backend save fails, try to delete the uploaded image from Cloudinary
        await deleteImageFromCloudinary(uploadResult.data.publicId);
        throw new Error('Failed to save profile image to database');
      }

      const updatedUser = await response.json();
      
      // Call parent callback
      if (onImageUpdate) {
        onImageUpdate(uploadResult.data.url, updatedUser);
      }

      // Update localStorage if needed
      const authUser = localStorage.getItem('authUser');
      if (authUser) {
        const parsedUser = JSON.parse(authUser);
        if (parsedUser.id === userId || parsedUser.id === parseInt(userId)) {
          localStorage.setItem('authUser', JSON.stringify({
            ...parsedUser,
            profileImageUrl: uploadResult.data.url,
            cloudinaryPublicId: uploadResult.data.publicId
          }));
        }
      }

      toast.success('Profile photo updated!', {
        description: 'Your profile photo has been successfully updated.'
      });

      handleCloseDialog();

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed', {
        description: error.message || 'Please try again later.'
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeletePhoto = async () => {
    if (!currentImageUrl || !userId) return;

    setIsDeleting(true);
    
    try {
      // Extract public ID from current image URL
      const publicId = extractPublicIdFromUrl(currentImageUrl);
      
      // Delete from backend first
      const response = await fetch(`${API_BASE}/api/users/${userId}/profile-image`, {
        method: 'DELETE',
        Authorization:
              "Bearer " +
              JSON.parse(localStorage.getItem("authUser") || "{}").JWTToken,
                "Content-Type": "application/json",
      });

      if (!response.ok) {
        throw new Error('Failed to delete profile image from database');
      }

      // Delete from Cloudinary if we have a public ID
      if (publicId) {
        const deleteResult = await deleteImageFromCloudinary(publicId);
        if (!deleteResult.success) {
          console.warn('Failed to delete image from Cloudinary:', deleteResult.error);
          // Don't throw error here as the main deletion (from backend) succeeded
        }
      }

      const updatedUser = await response.json();
      
      // Call parent callback
      if (onImageUpdate) {
        onImageUpdate(null, updatedUser);
      }

      // Update localStorage
      const authUser = localStorage.getItem('authUser');
      if (authUser) {
        const parsedUser = JSON.parse(authUser);
        if (parsedUser.id === userId || parsedUser.id === parseInt(userId)) {
          const updated = { ...parsedUser };
          delete updated.profileImageUrl;
          delete updated.cloudinaryPublicId;
          localStorage.setItem('authUser', JSON.stringify(updated));
        }
      }

      toast.success('Profile photo deleted!', {
        description: 'Your profile photo has been successfully removed.'
      });

      setMenuAnchorEl(null);

    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Delete failed', {
        description: error.message || 'Please try again later.'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleCloseDialog = () => {
    setShowPreviewDialog(false);
    setPreviewImage(null);
    setSelectedFile(null);
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
  };

  const triggerFileInput = () => {
    if (editable) {
      setShowPreviewDialog(true);
    }
  };

  const handleDialogFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Get user name from localStorage for initials
  const getUserName = () => {
    try {
      const authUser = localStorage.getItem('authUser');
      if (authUser) {
        const user = JSON.parse(authUser);
        return user.username || user.name || 'User';
      }
    } catch (error) {
      console.error('Error getting user name:', error);
    }
    return 'User';
  };

  return (
    <>
      <Box 
        sx={{ 
          position: 'relative', 
          display: 'inline-block',
        }}
      >
        <Avatar
          src={currentImageUrl}
          sx={{
            width: size,
            height: size,
            fontSize: size * 0.35,
            fontWeight: 600,
            border: 3,
            borderColor: 'primary.main',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: editable ? 'pointer' : 'default',
            '&:hover': editable ? {
              transform: 'scale(1.08)',
              boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
              borderColor: 'primary.dark'
            } : {},
            // Gradient border for better visual appeal
            background: !currentImageUrl ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent'
          }}
          onClick={editable ? triggerFileInput : undefined}
        >
          {!currentImageUrl && (
            <Typography sx={{ 
              fontSize: size * 0.35,
              fontWeight: 700,
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              {getInitials(getUserName())}
            </Typography>
          )}
        </Avatar>

        {editable && (
          <>
            {/* Enhanced action button */}
            {!currentImageUrl ? (
              <Tooltip title="Upload photo" placement="top">
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 4,
                    right: 4,
                    backgroundColor: 'primary.main',
                    color: 'white',
                    width: 44,
                    height: 44,
                    border: 3,
                    borderColor: 'background.paper',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                      transform: 'scale(1.1)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerFileInput();
                  }}
                >
                  <Camera size={20} />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Photo options" placement="top">
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 4,
                    right: 4,
                    backgroundColor: 'primary.main',
                    color: 'white',
                    width: 44,
                    height: 44,
                    border: 3,
                    borderColor: 'background.paper',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                      transform: 'scale(1.1)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
                    },
                    '&:disabled': {
                      backgroundColor: 'grey.400'
                    }
                  }}
                  onClick={handleMenuOpen}
                  disabled={isDeleting}
                >
                  {isDeleting ? <CircularProgress size={20} color="inherit" /> : <Edit3 size={20} />}
                </IconButton>
              </Tooltip>
            )}
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </Box>

      {/* Enhanced Context Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid',
            borderColor: 'divider',
            minWidth: 180
          }
        }}
      >
        <MenuItem 
          onClick={() => { handleMenuClose(); triggerFileInput(); }}
          sx={{ 
            py: 1.5,
            px: 2,
            gap: 1.5,
            '&:hover': {
              backgroundColor: 'primary.light',
              color: 'primary.contrastText'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 'auto' }}>
            <Upload size={18} />
          </ListItemIcon>
          <ListItemText 
            primary="Change Photo"
            primaryTypographyProps={{
              fontSize: '0.95rem',
              fontWeight: 500
            }}
          />
        </MenuItem>
        
        <MenuItem 
          onClick={() => { handleMenuClose(); handleDeletePhoto(); }} 
          sx={{ 
            py: 1.5,
            px: 2,
            gap: 1.5,
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'error.light',
              color: 'error.contrastText'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 'auto' }}>
            <Trash2 size={18} color="currentColor" />
          </ListItemIcon>
          <ListItemText 
            primary="Delete Photo"
            primaryTypographyProps={{
              fontSize: '0.95rem',
              fontWeight: 500
            }}
          />
        </MenuItem>
      </Menu>

      {/* Enhanced Preview Dialog */}
      <Dialog 
        open={showPreviewDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth={false}
        BackdropComponent={Backdrop}
        BackdropProps={{
          sx: {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            maxWidth: 500
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          textAlign: 'center',
          justifyContent: 'center'
        }}>
          <Upload size={20} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {previewImage ? 'Update Profile Photo' : 'Upload Profile Photo'}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ px: 3, py: 3 }}>
          {!previewImage ? (
            /* Guidelines State */
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                Choose a high-quality photo for your profile. The image will be automatically optimized and cropped.
              </Typography>

              {/* Information Section */}
              <Box sx={{ 
                backgroundColor: 'background.paper',
                borderRadius: 2,
                p: 2,
                mb: 3,
                border: '1px solid',
                borderColor: 'divider',
                textAlign: 'left',
              }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
                  Photo Guidelines
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                  • <strong>Supported formats:</strong> JPG, PNG, GIF, WebP
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                  • <strong>Maximum size:</strong> 10MB per image
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                  • <strong>Recommended resolution:</strong> 400×400 pixels or larger
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 0, lineHeight: 1.6 }}>
                  • Images will be automatically optimized and cropped for best quality
                </Typography>
              </Box>

              <Button
                onClick={handleDialogFileSelect}
                variant="contained"
                size="large"
                startIcon={<Camera size={20} />}
                sx={{ minWidth: 200 }}
              >
                Choose Photo
              </Button>
            </Box>
          ) : (
            /* Preview State */
            <Box sx={{ textAlign: 'center' }}>
              <Avatar
                src={previewImage}
                sx={{
                  width: 200,
                  height: 200,
                  mx: 'auto',
                  mb: 3,
                  border: 3,
                  borderColor: 'primary.main',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                }}
              />
              
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                Preview Your New Profile Photo
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                This will be your new profile photo. The image will be automatically optimized 
                and cropped to 400x400 pixels with smart face detection for the best composition.
              </Typography>

              {/* Upload Progress */}
              {isUploading && (
                <Box sx={{ mt: 4 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={uploadProgress} 
                    sx={{ 
                      mb: 2,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3
                      }
                    }}
                  />
                  <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
                    {uploadProgress < 90 ? 'Uploading to Cloudinary...' : 'Saving to database...'} {Math.round(uploadProgress)}%
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>

        {previewImage && (
          <DialogActions sx={{ 
            px: 3, 
            pb: 3,
            pt: 2,
            gap: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            justifyContent: 'center'
          }}>
            <Button 
              onClick={handleCloseDialog} 
              disabled={isUploading}
              variant="outlined"
              size="large"
              sx={{ minWidth: 120 }}
            >
              Cancel
            </Button>
            
            <Button 
              onClick={handleUpload} 
              disabled={isUploading}
              variant="contained"
              size="large"
              startIcon={isUploading ? <CircularProgress size={18} color="inherit" /> : <Check size={18} />}
              sx={{ minWidth: 160 }}
            >
              {isUploading ? 'Uploading...' : 'Update Photo'}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
}

export default ProfilePhotoManager;
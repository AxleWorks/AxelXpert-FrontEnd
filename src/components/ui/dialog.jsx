import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { X, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { Button } from './button';

export const ConfirmationDialog = ({
  open = false,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning", // warning, danger, info, success
  loading = false,
  maxWidth = "sm"
}) => {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <XCircle className="text-red-500" size={48} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={48} />;
      case 'success':
        return <CheckCircle className="text-green-500" size={48} />;
      case 'info':
      default:
        return <Info className="text-blue-500" size={48} />;
    }
  };

  const getConfirmButtonColor = () => {
    switch (type) {
      case 'danger':
        return 'error';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      case 'info':
      default:
        return 'primary';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }
      }}
    >
      <Box sx={{ position: 'relative', p: 2 }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'grey.500'
          }}
          size="small"
        >
          <X size={20} />
        </IconButton>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mt: 2 }}>
          <Box sx={{ mb: 2 }}>
            {getIcon()}
          </Box>

          <DialogTitle sx={{ p: 0, mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          </DialogTitle>

          <DialogContent sx={{ p: 0, mb: 3 }}>
            <DialogContentText sx={{ color: 'text.secondary', fontSize: '0.95rem' }}>
              {message}
            </DialogContentText>
          </DialogContent>

          <DialogActions sx={{ p: 0, gap: 1, width: '100%', justifyContent: 'center' }}>
            <Button
              onClick={onClose}
              variant="outlined"
              disabled={loading}
              sx={{ minWidth: 100 }}
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              color={getConfirmButtonColor()}
              disabled={loading}
              sx={{ minWidth: 100 }}
            >
              {loading ? 'Processing...' : confirmText}
            </Button>
          </DialogActions>
        </Box>
      </Box>
    </Dialog>
  );
};

export const AlertDialog = ({
  open = false,
  onClose,
  title = "Alert",
  message = "This is an alert message.",
  buttonText = "OK",
  type = "info", // warning, danger, info, success
  maxWidth = "sm"
}) => {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <XCircle className="text-red-500" size={48} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={48} />;
      case 'success':
        return <CheckCircle className="text-green-500" size={48} />;
      case 'info':
      default:
        return <Info className="text-blue-500" size={48} />;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'danger':
        return 'error';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      case 'info':
      default:
        return 'primary';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }
      }}
    >
      <Box sx={{ position: 'relative', p: 2 }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'grey.500'
          }}
          size="small"
        >
          <X size={20} />
        </IconButton>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mt: 2 }}>
          <Box sx={{ mb: 2 }}>
            {getIcon()}
          </Box>

          <DialogTitle sx={{ p: 0, mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          </DialogTitle>

          <DialogContent sx={{ p: 0, mb: 3 }}>
            <DialogContentText sx={{ color: 'text.secondary', fontSize: '0.95rem' }}>
              {message}
            </DialogContentText>
          </DialogContent>

          <DialogActions sx={{ p: 0, width: '100%', justifyContent: 'center' }}>
            <Button
              onClick={onClose}
              color={getButtonColor()}
              sx={{ minWidth: 100 }}
            >
              {buttonText}
            </Button>
          </DialogActions>
        </Box>
      </Box>
    </Dialog>
  );
};

export default { ConfirmationDialog, AlertDialog };
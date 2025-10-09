import React from 'react';
import { Snackbar, Alert } from '@mui/material';

let snackbarRef = null;

export const toast = {
  success: (message, options = {}) => {
    if (snackbarRef) {
      snackbarRef.showToast('success', message, options);
    }
  },
  error: (message, options = {}) => {
    if (snackbarRef) {
      snackbarRef.showToast('error', message, options);
    }
  },
  warning: (message, options = {}) => {
    if (snackbarRef) {
      snackbarRef.showToast('warning', message, options);
    }
  },
  info: (message, options = {}) => {
    if (snackbarRef) {
      snackbarRef.showToast('info', message, options);
    }
  }
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = React.useState([]);

  const showToast = (severity, message, options = {}) => {
    const id = Date.now();
    const newToast = {
      id,
      severity,
      message,
      description: options.description,
      autoHideDuration: options.duration || 6000
    };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      removeToast(id);
    }, newToast.autoHideDuration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  React.useEffect(() => {
    snackbarRef = { showToast };
    return () => {
      snackbarRef = null;
    };
  }, []);

  return (
    <>
      {children}
      {toasts.map((toast) => (
        <Snackbar
          key={toast.id}
          open={true}
          autoHideDuration={toast.autoHideDuration}
          onClose={() => removeToast(toast.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ mt: 8 }}
        >
          <Alert 
            onClose={() => removeToast(toast.id)} 
            severity={toast.severity}
            sx={{ width: '100%' }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{toast.message}</div>
              {toast.description && (
                <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                  {toast.description}
                </div>
              )}
            </div>
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};
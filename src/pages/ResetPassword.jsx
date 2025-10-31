import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import { publicAxios } from '../utils/axiosConfig';
import { AUTH_URL } from '../config/apiEndpoints';
import AuthLayout from '../components/auth/AuthLayout';
import AuthFormContainer from '../components/auth/AuthFormContainer';
import AuthBranding from '../components/auth/AuthBranding';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setMessage({
        type: 'error',
        text: 'Invalid or missing reset token. Please request a new password reset link.'
      });
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Passwords do not match'
      });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({
        type: 'error',
        text: 'Password must be at least 6 characters long'
      });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await publicAxios.post(`${AUTH_URL}/reset-password`, {
        token: token,
        newPassword: newPassword
      });

      setMessage({
        type: 'success',
        text: response.data.message || 'Password reset successful!'
      });

      // Redirect to sign in after 2 seconds
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to reset password. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!token && message.type === 'error') {
    const leftContent = <AuthBranding subtitle="Reset Your Password" />;
    const rightContent = (
      <AuthFormContainer title="Reset Password">
        <Box
          sx={{
            mb: 2,
            p: 2,
            borderRadius: 1,
            backgroundColor: '#fef2f2',
            color: '#991b1b',
            border: '1px solid #fecaca',
          }}
        >
          <Typography variant="body2">{message.text}</Typography>
        </Box>
        <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
          <Button
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Request New Reset Link
          </Button>
        </Link>
      </AuthFormContainer>
    );

    return (
      <AuthLayout
        leftContent={leftContent}
        rightContent={rightContent}
        backgroundImage="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop"
      />
    );
  }

  const leftContent = <AuthBranding subtitle="Reset Your Password" />;

  const rightContent = (
    <AuthFormContainer title="Reset Password">
      <Typography variant="body2" sx={{ mb: 3, color: '#64748b' }}>
        Enter your new password below.
      </Typography>

      {message.text && (
        <Box
          sx={{
            mb: 2,
            p: 2,
            borderRadius: 1,
            backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
            color: message.type === 'success' ? '#166534' : '#991b1b',
            border: message.type === 'success' ? '1px solid #bbf7d0' : '1px solid #fecaca',
          }}
        >
          <Typography variant="body2">{message.text}</Typography>
        </Box>
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
        <Typography variant="body2" sx={{ mb: 1, color: '#64748b' }}>
          New Password
        </Typography>
        <Input
          id="newPassword"
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          disabled={loading}
          minLength={6}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '16px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '1rem',
          }}
        />

        <Typography variant="body2" sx={{ mb: 1, color: '#64748b' }}>
          Confirm Password
        </Typography>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={loading}
          minLength={6}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '16px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '1rem',
          }}
        />

        <Button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#94a3b8' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
          }}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Remember your password?{' '}
          <Link to="/signin" style={{ color: '#3b82f6', textDecoration: 'none' }}>
            Back to Sign In
          </Link>
        </Typography>
      </Box>
    </AuthFormContainer>
  );

  return (
    <AuthLayout
      leftContent={leftContent}
      rightContent={rightContent}
      backgroundImage="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop"
    />
  );
};

export default ResetPassword;
import React, { useState, useEffect } from 'react';
import { User, Lock, Save, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from '../ui/toast';
import { Box, Typography, CircularProgress, IconButton } from '@mui/material';
import { API_BASE } from '../../config/apiEndpoints';

const SettingsComponent = ({ role = 'user' }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    address: '',
    branchName: '',
    role: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Get logged-in user data from localStorage
  const getLoggedInUser = () => {
    try {
      const authUser = localStorage.getItem('authUser');
      return authUser ? JSON.parse(authUser) : null;
    } catch (error) {
      console.error('Error parsing authUser from localStorage:', error);
      return null;
    }
  };

  // Fetch user details from API
  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(`${API_BASE}/api/users/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      const userData = await response.json();
      setUserDetails(userData);
      setFormData({
        username: userData.username || '',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
        address: userData.address || '',
        branchName: userData.branchName || '',
        role: userData.role || ''
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to load user details', {
        description: 'Please try refreshing the page'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loggedInUser = getLoggedInUser();
    if (loggedInUser && loggedInUser.id) {
      fetchUserDetails(loggedInUser.id);
    } else {
      setLoading(false);
      toast.error('No user session found', {
        description: 'Please log in again'
      });
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSaveProfile = async () => {
    if (!userDetails) return;

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/api/users/${userDetails.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          // Don't update role and branchName as they might be restricted
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      setUserDetails(updatedUser);
      
      // Update localStorage if username or email changed
      const authUser = getLoggedInUser();
      if (authUser) {
        const updatedAuthUser = {
          ...authUser,
          username: updatedUser.username,
          email: updatedUser.email
        };
        localStorage.setItem('authUser', JSON.stringify(updatedAuthUser));
      }

      toast.success('Profile updated!', {
        description: 'Your profile has been updated successfully.'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile', {
        description: 'Please try again later'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!userDetails) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match', {
        description: 'Please make sure both password fields match'
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password too short', {
        description: 'Password must be at least 6 characters long'
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/api/users/${userDetails.id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const text = await response.text();
      if (!response.ok) {
        throw new Error(text || 'Failed to change password');
      }

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      toast.success('Password changed!', {
        description: text || 'Your password has been changed successfully.'
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password', {
        description: error.message || 'Please check your current password and try again'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!userDetails) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (!confirmed) return;

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/api/users/${userDetails.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      // Clear localStorage and redirect to login
      localStorage.removeItem('authUser');
      toast.success('Account deleted', {
        description: 'Your account has been successfully deleted.'
      });
      
      // Redirect to login page after a delay
      setTimeout(() => {
        window.location.href = '/signin';
      }, 2000);
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account', {
        description: 'Please try again later'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!userDetails) {
    return (
      <Box textAlign="center" p={4}>
        <Typography variant="h6" color="error">
          Unable to load user details
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Please try refreshing the page or logging in again.
        </Typography>
      </Box>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account settings and preferences
        </Typography>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input 
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input 
                    value={formData.role}
                    disabled={true}
                    sx={{ '& .MuiInputBase-input.Mui-disabled': { color: 'text.secondary' } }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Contact Number</Label>
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>

              {(role === 'manager' || role === 'employee') && formData.branchName && (
                <div className="space-y-2">
                  <Label>Branch</Label>
                  <Input 
                    value={formData.branchName} 
                    disabled={true}
                    sx={{ '& .MuiInputBase-input.Mui-disabled': { color: 'text.secondary' } }}
                  />
                </div>
              )}

              <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
                <Button 
                  onClick={handleSaveProfile} 
                  disabled={saving}
                  sx={{ minWidth: 140 }}
                >
                  {saving ? <CircularProgress size={20} sx={{ mr: 1 }} /> : <Save size={16} style={{ marginRight: 8 }} />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Account Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Account Status</Label>
                  <Input 
                    value={userDetails.isActive ? 'Active' : 'Inactive'}
                    disabled={true}
                    sx={{ 
                      '& .MuiInputBase-input.Mui-disabled': { 
                        color: userDetails.isActive ? 'success.main' : 'error.main'
                      } 
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Account ID</Label>
                  <Input 
                    value={userDetails.id}
                    disabled={true}
                    sx={{ '& .MuiInputBase-input.Mui-disabled': { color: 'text.secondary' } }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Created Date</Label>
                  <Input 
                    value={new Date(userDetails.createdAt).toLocaleDateString()}
                    disabled={true}
                    sx={{ '& .MuiInputBase-input.Mui-disabled': { color: 'text.secondary' } }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Updated</Label>
                  <Input 
                    value={new Date(userDetails.updatedAt).toLocaleDateString()}
                    disabled={true}
                    sx={{ '& .MuiInputBase-input.Mui-disabled': { color: 'text.secondary' } }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Box sx={{ position: 'relative' }}>
                  <Input 
                    type={showPasswords.current ? "text" : "password"}
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    sx={{ pr: 6 }}
                  />
                  <IconButton
                    sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}
                    onClick={() => togglePasswordVisibility('current')}
                    size="small"
                  >
                    {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                  </IconButton>
                </Box>
              </div>

              <div className="space-y-2">
                <Label>New Password</Label>
                <Box sx={{ position: 'relative' }}>
                  <Input 
                    type={showPasswords.new ? "text" : "password"}
                    placeholder="Enter new password"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    sx={{ pr: 6 }}
                  />
                  <IconButton
                    sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}
                    onClick={() => togglePasswordVisibility('new')}
                    size="small"
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </IconButton>
                </Box>
              </div>

              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Box sx={{ position: 'relative' }}>
                  <Input 
                    type={showPasswords.confirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    sx={{ pr: 6 }}
                  />
                  <IconButton
                    sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}
                    onClick={() => togglePasswordVisibility('confirm')}
                    size="small"
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </IconButton>
                </Box>
              </div>

              <Button 
                onClick={handleChangePassword} 
                disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                sx={{ minWidth: 160 }}
              >
                {saving ? <CircularProgress size={20} sx={{ mr: 1 }} /> : <Lock size={16} style={{ marginRight: 8 }} />}
                {saving ? 'Changing...' : 'Change Password'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Typography variant="body2" color="text.secondary">
                Add an extra layer of security to your account by enabling two-factor authentication.
              </Typography>
              <Button variant="outlined" disabled>
                Enable 2FA (Coming Soon)
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ borderColor: 'error.main' }}>
            <CardHeader>
              <CardTitle sx={{ color: 'error.main' }}>Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Typography variant="body2" color="text.secondary">
                Once you delete your account, there is no going back. Please be certain.
              </Typography>
              <Button 
                variant="outlined" 
                color="error"
                onClick={handleDeleteAccount}
                disabled={saving}
                sx={{ minWidth: 140 }}
              >
                {saving ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
                {saving ? 'Deleting...' : 'Delete Account'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsComponent;
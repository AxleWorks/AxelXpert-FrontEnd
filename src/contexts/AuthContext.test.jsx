import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';

// Mock Firebase
vi.mock('../config/firebaseConfig', () => ({
  default: {},
  messaging: {},
}));

// Mock useFirebaseNotifications hook
vi.mock('../hooks/useFirebaseNotifications', () => ({
  default: () => null,
}));

// Mock JWT utils
vi.mock('../utils/jwtUtils', () => ({
  getCurrentUser: vi.fn(() => null),
  isAuthenticated: vi.fn(() => false),
  storeAccessToken: vi.fn(),
  clearStoredToken: vi.fn(),
}));

const TestComponent = () => {
  const { user, loading } = useAuth();
  return (
    <div>
      <span data-testid="user-status">{user ? user.email : 'No user'}</span>
      <span data-testid="loading-status">{loading ? 'Loading' : 'Ready'}</span>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides initial authentication state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('user-status')).toHaveTextContent('No user');
  });

  it('provides loading state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('loading-status')).toHaveTextContent('Ready');
  });
});
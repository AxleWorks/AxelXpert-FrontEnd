import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Mock the useAuth hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to }) => {
      mockNavigate(to);
      return <div>Redirecting to {to}</div>;
    },
  };
});

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../../contexts/AuthContext';

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when user is authenticated with correct role', () => {
    useAuth.mockReturnValue({
      user: { role: 'user' },
      loading: false,
    });

    render(
      <BrowserRouter>
        <ProtectedRoute requiredRole="user">
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to signin when user is not authenticated', () => {
    useAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    render(
      <BrowserRouter>
        <ProtectedRoute requiredRole="user">
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText(/Redirecting to \/signin/i)).toBeInTheDocument();
  });

  it('shows loading state when authentication is in progress', () => {
    useAuth.mockReturnValue({
      user: null,
      loading: true,
    });

    render(
      <BrowserRouter>
        <ProtectedRoute requiredRole="user">
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    // Should not show protected content while loading
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects when user has wrong role', () => {
    useAuth.mockReturnValue({
      user: { role: 'employee' },
      loading: false,
    });

    render(
      <BrowserRouter>
        <ProtectedRoute requiredRole="admin">
          <div>Admin Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });
});

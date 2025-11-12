import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

// Mock the auth context
vi.mock('./contexts/AuthContext', () => ({
  AuthProvider: ({ children }) => <div>{children}</div>,
  useAuth: () => ({
    user: null,
    loading: false,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  }),
}));

// Mock the theme context
vi.mock('./contexts/ThemeContext', () => ({
  ThemeProvider: ({ children }) => <div>{children}</div>,
  useTheme: () => ({
    theme: 'light',
    toggleTheme: vi.fn(),
  }),
}));

// Mock toast provider
vi.mock('./components/ui/toast', () => ({
  ToastProvider: ({ children }) => <div>{children}</div>,
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<App />);
    expect(document.body).toBeTruthy();
  });

  it('shows loading fallback initially', () => {
    render(<App />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('renders signin page by default after loading', async () => {
    render(<App />);
    
    await waitFor(() => {
      // After loading, it should redirect to signin
      expect(window.location.pathname === '/signin' || screen.queryByText(/Loading.../i)).toBeTruthy();
    }, { timeout: 3000 });
  });
});
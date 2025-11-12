import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import SignIn from './SignIn';

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    setAuthUser: vi.fn(),
  }),
}));

vi.mock('../../utils/axiosConfig', () => ({
  publicAxios: {
    get: vi.fn(() => Promise.resolve({ data: {} })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
  },
}));

describe('SignIn Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders SignIn component with form fields', () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('handles user input correctly', async () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    await waitFor(() => {
      expect(emailInput.value).toBe('test@example.com');
      expect(passwordInput.value).toBe('password123');
    });
  });

  it('has a link to signup page', () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    const signupLink = screen.getByText(/don't have an account/i);
    expect(signupLink).toBeInTheDocument();
  });
});
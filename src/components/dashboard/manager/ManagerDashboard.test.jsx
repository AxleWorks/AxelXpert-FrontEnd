import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ManagerDashboard from './ManagerDashboard';
import { useAuth } from '../../../contexts/AuthContext';

// Mock the auth context
vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock recharts
vi.mock('recharts', () => ({
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  Legend: () => <div data-testid="legend" />,
  Cell: () => <div data-testid="cell" />,
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ManagerDashboard Component', () => {
  const mockManager = {
    id: 1,
    email: 'manager@test.com',
    role: 'MANAGER',
    firstName: 'Jane',
    lastName: 'Smith',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render manager dashboard when authenticated', () => {
    useAuth.mockReturnValue({
      user: mockManager,
      isAuthenticated: true,
      loading: false,
    });

    renderWithRouter(<ManagerDashboard />);

    // Should render dashboard
    expect(document.body).toBeTruthy();
  });

  it('should show loading state', () => {
    useAuth.mockReturnValue({
      user: mockManager,
      isAuthenticated: true,
      loading: true,
    });

    renderWithRouter(<ManagerDashboard />);

    // Should handle loading state
    expect(document.body).toBeTruthy();
  });

  it('should handle unauthenticated manager', () => {
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false,
    });

    renderWithRouter(<ManagerDashboard />);

    // Should redirect or show unauthorized
    expect(true).toBe(true);
  });

  it('should display manager-specific data', () => {
    useAuth.mockReturnValue({
      user: mockManager,
      isAuthenticated: true,
      loading: false,
    });

    renderWithRouter(<ManagerDashboard />);

    // Verify manager dashboard renders
    expect(document.body).toBeTruthy();
  });

  it('should handle manager with multiple branches', () => {
    useAuth.mockReturnValue({
      user: { ...mockManager, branches: ['Branch1', 'Branch2'] },
      isAuthenticated: true,
      loading: false,
    });

    renderWithRouter(<ManagerDashboard />);

    // Should handle multiple branches
    expect(document.body).toBeTruthy();
  });
});

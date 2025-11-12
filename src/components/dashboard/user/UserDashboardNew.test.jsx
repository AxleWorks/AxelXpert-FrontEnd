import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserDashboard from './UserDashboardNew';
import dashboardService from '../../../services/dashboardService';

// Mock the dashboard service
vi.mock('../../../services/dashboardService', () => ({
  default: {
    getUserDashboardData: vi.fn(),
  },
}));

// Mock recharts to avoid rendering issues in tests
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
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  Cell: () => <div data-testid="cell" />,
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('UserDashboard Component', () => {
  const mockDashboardData = {
    stats: {
      totalBookings: 12,
      activeServices: 3,
      completedServices: 9,
      upcomingAppointments: 2,
    },
    recentActivity: [
      {
        id: 1,
        type: 'booking',
        message: 'Oil change service completed',
        date: '2025-11-10',
      },
      {
        id: 2,
        type: 'appointment',
        message: 'Upcoming tire rotation',
        date: '2025-11-15',
      },
    ],
    vehicles: [
      {
        id: 1,
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        licensePlate: 'ABC123',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dashboard with loading state initially', () => {
    dashboardService.getUserDashboardData.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    renderWithRouter(<UserDashboard />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should display dashboard data after loading', async () => {
    dashboardService.getUserDashboardData.mockResolvedValue(mockDashboardData);

    renderWithRouter(<UserDashboard />);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Check if stat cards are rendered (looking for numbers)
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    dashboardService.getUserDashboardData.mockRejectedValue(
      new Error('Failed to load dashboard')
    );

    renderWithRouter(<UserDashboard />);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Should show error state or empty state
    expect(dashboardService.getUserDashboardData).toHaveBeenCalledTimes(1);
    
    consoleErrorSpy.mockRestore();
  });

  it('should call dashboard service on mount', async () => {
    dashboardService.getUserDashboardData.mockResolvedValue(mockDashboardData);

    renderWithRouter(<UserDashboard />);

    await waitFor(() => {
      expect(dashboardService.getUserDashboardData).toHaveBeenCalledTimes(1);
    });
  });

  it('should render recent activity when data is available', async () => {
    dashboardService.getUserDashboardData.mockResolvedValue(mockDashboardData);

    renderWithRouter(<UserDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Oil change service completed/i)).toBeInTheDocument();
    });
  });
});

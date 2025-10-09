# AxleXpert Frontend - Role-Based Authentication System

## Overview

This React application implements a comprehensive role-based authentication system with three distinct user roles: User, Employee, and Manager. Each role has its own dedicated dashboard and navigation structure.

## User Roles & Credentials

### Test Login Credentials

Use these credentials to access different dashboards:

| Role     | Username   | Password   | Dashboard Access   |
| -------- | ---------- | ---------- | ------------------ |
| User     | `user`     | `password` | User Dashboard     |
| Employee | `employee` | `password` | Employee Dashboard |
| Manager  | `manager`  | `password` | Manager Dashboard  |

## Role-Specific Features

### User Dashboard

**Navigation Menu:**

- Dashboard (Overview of tasks and services)
- Tasks (Personal task management)
- History (Service history)
- Settings (User preferences)
- Services (Available services)

**Features:**

- View active tasks and completed services
- Track pending requests and service history
- Schedule upcoming services
- Manage personal settings

### Employee Dashboard

**Navigation Menu:**

- Dashboard (Work overview and daily tasks)
- Vehicles (Assigned vehicle management)
- Services (Service management tools)
- Booking Calendar (Schedule management)
- Settings (Employee preferences)
- Branches (Branch information)
- Progress Tracking (Service progress updates)

**Features:**

- View assigned vehicles and service tasks
- Track service progress with completion percentages
- Manage daily work schedule
- Update service status and progress

### Manager Dashboard

**Navigation Menu:**

- Dashboard (Management overview and analytics)
- Booking Calendar (System-wide booking management)
- Progress Tracking (Monitor all service progress)
- User Management (Manage users and roles)
- Settings (System settings)
- Services (Service configuration)
- Branches (Branch management)
- Reports (Business analytics and reports)

**Features:**

- Overview of all business metrics and KPIs
- Manage bookings across all branches
- Monitor user activity and performance
- Generate business reports and analytics
- Manage system-wide settings and configurations

## Project Structure

```
src/
├── contexts/
│   └── AuthContext.jsx           # Authentication context and provider
├── components/
│   ├── auth/
│   │   ├── ProtectedRoute.jsx    # Route protection component
│   │   ├── SignIn.jsx            # Updated login form
│   │   └── ...                   # Other auth components
│   └── dashboard/
│       ├── user/
│       │   └── UserDashboard.jsx
│       ├── employee/
│       │   └── EmployeeDashboard.jsx
│       └── manager/
│           └── ManagerDashboard.jsx
├── layouts/
│   ├── user/
│   │   ├── UserLayout.jsx        # User layout wrapper
│   │   └── UserSidebar.jsx       # User navigation sidebar
│   ├── employee/
│   │   ├── EmployeeLayout.jsx    # Employee layout wrapper
│   │   └── EmployeeSidebar.jsx   # Employee navigation sidebar
│   └── manager/
│       ├── ManagerLayout.jsx     # Manager layout wrapper
│       └── ManagerSidebar.jsx    # Manager navigation sidebar
└── pages/
    ├── user/                     # User-specific pages
    ├── employee/                 # Employee-specific pages
    └── manager/                  # Manager-specific pages
```

## Authentication Flow

1. **Login**: Users enter username and password on the login page
2. **Verification**: System verifies credentials against predefined users
3. **Role Assignment**: User object includes role information
4. **Route Protection**: `ProtectedRoute` component ensures users can only access authorized pages
5. **Dashboard Redirect**: Users are automatically redirected to their role-specific dashboard
6. **Session Management**: Authentication state is persisted in localStorage

## Getting Started

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Access the application:**

   - Open http://localhost:5173 in your browser
   - You'll be redirected to the login page

3. **Test different roles:**
   - Use the provided credentials to test each role
   - Each role will have different navigation options and dashboard content

## Key Features

### Security

- Protected routes prevent unauthorized access
- Role-based navigation and content
- Automatic redirection based on user role
- Session persistence across browser refreshes

### User Experience

- Role-specific branding and colors
- Intuitive navigation structure
- Responsive design for mobile and desktop
- Clear visual indicators for user roles

### Developer Features

- Clean separation of concerns
- Reusable authentication context
- Modular layout components
- Easy to extend with new roles

## Visual Design

Each role has distinct visual theming:

- **User Dashboard**: Green accent colors, focus on personal tasks
- **Employee Dashboard**: Orange/yellow accent colors, work-oriented interface
- **Manager Dashboard**: Purple/pink accent colors, comprehensive management tools

## Future Enhancements

- Integration with backend authentication API
- Advanced permission system
- Multi-factor authentication
- Role hierarchy and delegation
- Audit logging and activity tracking

## Development Notes

- Built with React 18+ and Material-UI
- Uses React Router for navigation
- Context API for state management
- localStorage for session persistence
- Responsive design principles

# AxelXpert Frontend

A modern, role-based vehicle service management system built with React, Vite, and Material-UI. This application serves as the frontend interface for AxelXpert, providing comprehensive vehicle service booking, management, and tracking capabilities for customers, employees, and managers.

## 🚗 Overview

AxelXpert is a comprehensive automotive service management platform that streamlines the entire vehicle servicing process. The system supports three distinct user roles with tailored interfaces and functionalities:

- **Customers**: Book services, track vehicle maintenance, manage their vehicle fleet
- **Employees**: Manage assigned tasks, view service history, track progress
- **Managers**: Oversee operations, manage bookings, generate reports, handle user management

## ✨ Key Features

### 🔐 Authentication & Authorization

- JWT-based secure authentication
- Role-based access control (Customer, Employee, Manager)
- Protected routes with automatic redirection
- Password recovery functionality

### 👥 Multi-Role Dashboard System

- **Customer Dashboard**: Personal vehicle management, booking history, service tracking
- **Employee Dashboard**: Task management, service history, progress tracking
- **Manager Dashboard**: Complete oversight, analytics, user management, reporting

### 📅 Advanced Booking System

- Interactive calendar-based booking interface
- Real-time availability checking
- Service type selection with pricing
- Vehicle selection from user's fleet
- Branch selection and management
- Booking status tracking (Pending, Approved, Completed, Cancelled)

### 🚙 Vehicle Management

- Comprehensive vehicle registration
- Support for multiple vehicle types (Car, Truck, SUV, Van, Bike, Bus)
- Service history tracking
- Maintenance scheduling
- Vehicle information management (make, model, year, fuel type, etc.)

### 🏢 Multi-Branch Support

- Branch selection during booking
- Branch-specific service management
- Location-based service availability

### 📊 Reporting & Analytics

- PDF report generation
- Service analytics and insights
- Performance tracking
- Business intelligence dashboards

### 💬 Communication Features

- Integrated chatbot for customer support
- Real-time notifications
- Progress tracking updates

### 🎨 Modern UI/UX

- Material Design principles
- Responsive design for all devices
- Dark/Light theme support
- Intuitive navigation
- Professional branding

## 🛠 Technology Stack

### Frontend Framework

- **React 19** - Latest React with modern features
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing

### UI & Styling

- **Material-UI (MUI)** - Comprehensive component library
- **Emotion** - CSS-in-JS styling
- **Lucide React** - Modern icon library
- **Custom theming** - Consistent design system

### State Management & Data

- **React Context API** - Global state management
- **Axios** - HTTP client for API communication
- **JWT Utils** - Token management and authentication

### Development Tools

- **ESLint** - Code linting and quality
- **Vite Dev Server** - Hot module replacement
- **Modern JavaScript** - ES6+ features

### Additional Features

- **Recharts** - Data visualization and charts
- **html2pdf.js** - Client-side PDF generation
- **Cloudinary** - Image upload and management

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── calendar/        # Booking calendar system
│   ├── dashboard/       # Role-specific dashboards
│   ├── ui/              # Common UI components
│   ├── vehicles/        # Vehicle management
│   └── userManagement/  # User administration
├── contexts/            # React Context providers
├── hooks/               # Custom React hooks
├── layouts/             # Layout components by role
│   ├── employee/        # Employee layout & sidebar
│   ├── manager/         # Manager layout & sidebar
│   └── user/            # Customer layout & sidebar
├── pages/               # Route components
│   ├── employee/        # Employee-specific pages
│   ├── manager/         # Manager-specific pages
│   └── user/            # Customer-specific pages
├── services/            # API service functions
├── utils/               # Utility functions
└── config/              # Configuration files
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend API server running (default: http://localhost:8080)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/AxleWorks/AxelXpert-FrontEnd.git
   cd AxelXpert-FrontEnd
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   - Update API endpoints in `src/config/apiEndpoints.jsx`
   - Configure Cloudinary settings (see `CLOUDINARY_SETUP_COMPLETE.md`)

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open your browser to `http://localhost:5173`
   - Sign in with appropriate role credentials

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production-ready application
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🎯 User Roles & Permissions

### 🧑‍💼 Customer Role

**Routes**: `/user/*`

- **Dashboard**: View service overview, quick actions, recent activity
- **Vehicles**: Manage personal vehicle fleet
- **Booking Calendar**: Schedule new services, view appointments
- **Branches**: View available service locations
- **Progress Tracking**: Monitor service status
- **Settings**: Manage account preferences
- **Services**: Browse available service types

### 👨‍🔧 Employee Role

**Routes**: `/employee/*`

- **Dashboard**: View assigned tasks and workload
- **Tasks**: Manage daily work assignments
- **History**: Access service completion records
- **Services**: View service catalog and procedures
- **Settings**: Personal account management

### 👨‍💼 Manager Role

**Routes**: `/manager/*`

- **Dashboard**: Complete business overview and analytics
- **Booking Calendar**: Manage all customer appointments
- **Progress Tracking**: Monitor all service operations
- **User Management**: Handle staff and customer accounts
- **Reports**: Generate business intelligence reports
- **Settings**: System-wide configuration
- **Services**: Manage service offerings and pricing
- **Branches**: Oversee multiple service locations

## 🔧 API Integration

The frontend integrates with a Spring Boot backend through RESTful APIs:

### Base Configuration

```javascript
API_BASE = "http://localhost:8080";
API_PREFIX = "/api";
```

### Key Endpoints

- **Authentication**: `/api/auth/*`
- **Bookings**: `/api/bookings/*`
- **Vehicles**: `/api/vehicles/*`
- **Users**: `/api/users/*`
- **Services**: `/api/services/*`
- **Branches**: `/api/branches/*`

### Authentication

- JWT token-based authentication
- Automatic token refresh
- Secure API request handling

## 🎨 Styling & Theming

### Material-UI Theme

- Consistent color palette
- Typography scale
- Component customization
- Responsive breakpoints

### Design System

- Professional automotive branding
- Consistent spacing and layouts
- Accessible color contrasts
- Modern card-based interfaces

## 📱 Responsive Design

- **Mobile-first approach**
- **Tablet optimization**
- **Desktop enhancement**
- **Cross-browser compatibility**

## 🔒 Security Features

- JWT token validation
- Role-based route protection
- Secure API communication
- Input validation and sanitization
- XSS protection
- CSRF protection

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Deployment Options

- **Vercel** (configured with `vercel.json`)
- **Netlify**
- **AWS S3 + CloudFront**
- **Traditional web servers**

### Environment Variables

Configure for production:

- API base URLs
- Authentication endpoints
- Third-party service keys

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow ESLint configuration
- Maintain consistent code style
- Write meaningful commit messages
- Test thoroughly before submitting
- Update documentation as needed

## 📞 Support & Documentation

### Additional Resources

- **Cloudinary Setup**: See `CLOUDINARY_SETUP_COMPLETE.md`
- **API Documentation**: Contact backend team
- **Design System**: Material-UI documentation
- **Deployment Guide**: Platform-specific documentation

### Getting Help

- Check existing GitHub issues
- Create new issues with detailed descriptions
- Contact the development team
- Review API documentation

## 📄 License

This project is part of the AxelXpert system developed by AxleWorks. All rights reserved.

## 🏆 Acknowledgments

- Material-UI team for the excellent component library
- React team for the powerful framework
- Vite team for the fast build tool
- All contributors and beta testers

---

**Built with ❤️ by the AxleWorks Team**

For more information about the AxelXpert ecosystem, visit our main repository or contact the development team.

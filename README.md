# AxelXpert - Vehicle Service Management System

A comprehensive vehicle service management platform built with React and Vite, featuring role-based authentication, real-time booking management, and advanced attendance tracking.

## 🚀 Features

### Core System
- **Role-based Authentication**: User, Employee, Manager access levels
- **Dashboard Analytics**: Real-time KPIs and performance metrics
- **Vehicle Management**: Complete vehicle tracking and service history
- **Booking System**: Interactive calendar-based appointment scheduling
- **Service Tracking**: Progress monitoring and status updates
- **Branch Management**: Multi-location support

### 🆕 **Advanced Attendance Management System**
A world-class employee attendance management solution with the following features:

#### 📅 **Calendar View**
- Interactive monthly calendar with color-coded attendance indicators
- Visual attendance rates (Green: 90%+, Yellow: 70-89%, Red: <70%)
- Quick date selection and navigation
- Hover tooltips with attendance summaries

#### 👥 **Employee Details Management**
- Comprehensive daily attendance tracking
- Multiple status types: Present, Late, Absent, On Leave, Half Day, Warning
- Real-time time tracking (check-in/out, working hours, overtime)
- Break time monitoring and management
- Inline editing with intuitive dialog interface

#### 📊 **Statistics & Analytics**
- Performance metrics dashboard with visual progress bars
- Employee ranking systems (top performers, frequent latecomers)
- Time range analysis (week, month, quarter, year)
- Department-wise insights and comparisons
- Automated trend analysis

#### ⚙️ **Employee Management Panel**
- Complete employee directory with profile photos
- Quick action buttons for QR code generation, biometric setup
- ID badge management and custom schedule configuration
- Advanced settings: remote check-in, overtime tracking, punctuality enforcement
- Contact information management

#### 🚀 **Advanced Automation Features**
- Intelligent problem detection algorithms
- Automated warning system with configurable thresholds
- Geo-fencing for location-based attendance verification
- Smart notification system for managers and HR
- Policy enforcement and compliance tracking

#### 📈 **Comprehensive Reporting**
- Multiple report formats: Summary, Detailed, Department, Individual
- Export capabilities: PDF, Excel, Email, Print
- Custom date range selection and filtering
- Performance analytics with productivity scoring
- Visual data representation with charts and graphs

## 🛠️ Technical Stack

- **Frontend**: React 19.1.1, Material-UI 7.3.2
- **Build Tool**: Vite 7.1.7
- **Routing**: React Router DOM 7.9.3
- **Charts**: Recharts 3.3.0
- **Icons**: Lucide React, Material-UI Icons
- **HTTP Client**: Axios 1.12.2
- **PDF Generation**: html2pdf.js 0.12.1

## 📁 Project Structure

```
src/
├── components/
│   ├── attendance/          # 🆕 Attendance management components
│   │   ├── AttendanceCalendar.jsx
│   │   ├── EmployeeAttendanceDetails.jsx
│   │   ├── AttendanceStatistics.jsx
│   │   ├── EmployeeManagementPanel.jsx
│   │   ├── AttendanceAdvancedFeatures.jsx
│   │   └── AttendanceReports.jsx
│   ├── auth/               # Authentication components
│   ├── dashboard/          # Dashboard widgets and charts
│   ├── calendar/           # Booking calendar components
│   └── ui/                 # Reusable UI components
├── pages/
│   ├── manager/            # Manager-specific pages
│   │   └── ManagerAttendancePage.jsx  # 🆕 Main attendance interface
│   ├── employee/           # Employee-specific pages
│   └── user/               # User-specific pages
├── layouts/                # Layout components for different roles
├── contexts/               # React context providers
└── services/               # API service functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20.19+ or 22.12+
- npm or yarn package manager

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

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production
```bash
npm run build
npm run preview
```

## 👤 User Roles & Access

### Manager Access
- **Full system access** including attendance management
- **Employee oversight** and performance analytics
- **Advanced reporting** and export capabilities
- **System configuration** and automation settings

### Employee Access
- **Personal dashboard** with task management
- **Service tracking** and progress updates
- **Basic attendance** view (own records)

### User/Customer Access
- **Vehicle management** and service booking
- **Appointment scheduling** and tracking
- **Service history** and reports

## 🎯 Quick Start Guide for Attendance System

### For Managers:
1. **Login** as Manager
2. **Navigate** to Manager Panel → **Attendance**
3. **Explore tabs**:
   - 📅 **Calendar**: Visual attendance overview
   - 👥 **Employee Details**: Daily management
   - 📊 **Statistics**: Performance insights
   - ⚙️ **Employee Mgmt**: Profile management
   - 🚀 **Advanced**: Automation features
   - 📈 **Reports**: Comprehensive analytics

### Key Actions:
- **Add Employee**: Click ➕ floating button
- **Edit Attendance**: Click ✏️ in employee details
- **Generate Reports**: Configure and export in Reports tab
- **Set Automation**: Configure in Advanced Features tab

## 📚 Documentation

- **[Attendance System Documentation](./ATTENDANCE_SYSTEM_DOCUMENTATION.md)** - Complete feature overview
- **[Quick Setup Guide](./ATTENDANCE_QUICK_GUIDE.md)** - Step-by-step usage instructions
- **[Profile Photo Setup](./PROFILE_PHOTO_COMPLETE_GUIDE.md)** - Image management guide
- **[Role-based Auth](./ROLE_BASED_AUTH_README.md)** - Authentication system guide

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Key Features Highlights

### ✅ Completed Features
- ✅ **Advanced Attendance System** (NEW)
- ✅ Role-based authentication and authorization
- ✅ Interactive booking calendar
- ✅ Vehicle management system
- ✅ Real-time dashboard analytics
- ✅ Multi-branch support
- ✅ Profile photo management
- ✅ Responsive design for all devices

### 🚀 Recent Updates
- **October 2024**: Launched comprehensive attendance management system
- Advanced automation features and smart analytics
- Mobile-responsive design improvements
- Enhanced reporting capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- 📧 Email: support@axelxpert.com
- 📖 Documentation: Check the guides in this repository
- 🐛 Issues: Open an issue on GitHub

---

**Built with ❤️ by the AxelXpert Team**
**Last Updated**: October 2024 | **Version**: 2.0.0

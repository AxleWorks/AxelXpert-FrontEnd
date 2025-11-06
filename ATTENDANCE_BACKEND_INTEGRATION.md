# Attendance System Backend Integration Guide

## Overview
This document outlines the complete implementation of the attendance management system that integrates with the Spring Boot backend using JWT authentication.

## Backend API Endpoints

### Attendance Controller (`/api/attendance`)

#### 1. Create Attendance Record
- **POST** `/api/attendance`
- **Request Body**: `AttendanceCreateDTO`
```json
{
  "userId": 1,
  "branchId": 1,
  "date": "2025-11-06",
  "arrivalTime": "08:00:00",
  "leaveTime": "17:00:00",
  "status": "PRESENT",
  "notes": "Regular attendance"
}
```

#### 2. Update Attendance Record
- **PUT** `/api/attendance/{id}`
- **Request Body**: `AttendanceUpdateDTO`
```json
{
  "arrivalTime": "08:15:00",
  "leaveTime": "17:30:00",
  "status": "LATE_ARRIVAL",
  "notes": "Traffic delay"
}
```

#### 3. Get Attendance by Branch and Date
- **GET** `/api/attendance/branch/{branchId}/date/{date}`
- **Example**: `/api/attendance/branch/1/date/2025-11-06`

#### 4. Get Calendar Data
- **GET** `/api/attendance/calendar?branchId={branchId}&startDate={startDate}&endDate={endDate}`
- **Example**: `/api/attendance/calendar?branchId=1&startDate=2025-11-01&endDate=2025-11-30`

#### 5. Get Attendance by User and Date
- **GET** `/api/attendance/user/{userId}/date/{date}`

#### 6. Get Attendance by Date Range
- **GET** `/api/attendance/branch/{branchId}?startDate={startDate}&endDate={endDate}`

#### 7. Delete Attendance Record
- **DELETE** `/api/attendance/{id}`

## Backend DTOs

### AttendanceStatus Enum
```java
public enum AttendanceStatus {
    PRESENT,
    ABSENT,
    SHORT_LEAVE,
    LATE_ARRIVAL,
    EARLY_DEPARTURE
}
```

### AttendanceDTO Response
```json
{
  "id": 1,
  "userId": 1,
  "username": "John Doe",
  "userEmail": "john.doe@example.com",
  "branchId": 1,
  "branchName": "Kiribathgoda",
  "date": "2025-11-06",
  "arrivalTime": "08:00:00",
  "leaveTime": "17:00:00",
  "status": "PRESENT",
  "notes": "Regular attendance"
}
```

### AttendanceCalendarDTO Response
```json
{
  "date": "2025-11-06",
  "branchId": 1,
  "branchName": "Kiribathgoda",
  "totalEmployees": 15,
  "presentCount": 12,
  "absentCount": 1,
  "shortLeaveCount": 1,
  "lateArrivalCount": 1,
  "earlyDepartureCount": 0
}
```

## Frontend Implementation

### Services

#### 1. Attendance Service (`attendanceService.js`)
- Uses authenticated axios instance with JWT tokens
- Handles all attendance-related API calls
- Includes utility functions for date/time formatting

#### 2. Branch Service (`branchService.js`)
- Manages branch-related operations
- Used for loading branch dropdown options

### Components

#### 1. ManagerAttendancePage (`ManagerAttendancePage.jsx`)
**Key Features:**
- Branch selection dropdown
- Date selection and navigation
- Tab-based interface (Calendar/Employee Details)
- Real-time data loading with loading states
- Error handling with user-friendly messages
- Success notifications for updates

**API Integration:**
- `loadInitialData()`: Loads branches on component mount
- `loadCalendarData()`: Loads calendar attendance data when branch changes
- `loadAttendanceDetails()`: Loads employee attendance for selected date
- `handleUpdateAttendance()`: Updates attendance records

#### 2. AttendanceCalendar (`AttendanceCalendar.jsx`)
**Key Features:**
- Monthly calendar view
- Color-coded attendance indicators
- Click-to-select dates
- Attendance statistics display
- Month navigation

**Data Processing:**
- Processes `AttendanceCalendarDTO` data
- Maps backend status enums to frontend colors
- Calculates attendance rates

#### 3. EmployeeAttendanceDetails (`EmployeeAttendanceDetails.jsx`)
**Key Features:**
- Employee list with attendance status
- Quick statistics cards
- Inline editing of attendance records
- Status badges and time displays
- Working hours and overtime calculations

**Status Mapping:**
```javascript
const statusMap = {
  'PRESENT': 'present',
  'ABSENT': 'absent',
  'LATE_ARRIVAL': 'late',
  'SHORT_LEAVE': 'leave',
  'EARLY_DEPARTURE': 'halfDay'
};
```

### Authentication

#### JWT Token Integration
- Uses `authenticatedAxios` from `axiosConfig.js`
- Automatically includes Bearer token in headers
- Handles 401 errors by redirecting to login
- Token retrieved from `jwtUtils.js`

#### Request Interceptor
```javascript
instance.interceptors.request.use(
  (config) => {
    const authHeader = getAuthHeader();
    if (authHeader) {
      config.headers.Authorization = authHeader;
    }
    return config;
  }
);
```

## Setup Instructions

### 1. Environment Configuration
Ensure your `apiEndpoints.jsx` has the correct base URL:
```javascript
export const API_BASE = 'http://localhost:8080';
```

### 2. JWT Token Storage
Ensure JWT tokens are properly stored after login in `localStorage`:
```javascript
localStorage.setItem('token', jwtToken);
```

### 3. Backend CORS Configuration
Ensure your Spring Boot backend allows CORS:
```java
@CrossOrigin(origins = "*")
```

### 4. Database Setup
Ensure your database has the following tables:
- `users` (with branch associations)
- `branches`
- `attendance` (with proper foreign keys)

## Error Handling

### Frontend Error Types
1. **Authentication Errors (401)**: Automatically redirects to login
2. **Network Errors**: Displays user-friendly error messages
3. **Validation Errors**: Shows specific field validation messages
4. **Server Errors (500)**: Generic error message with retry option

### Backend Error Responses
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

## Data Flow

### 1. Loading Attendance Data
```
User selects branch → API call to get calendar data → Display calendar with attendance indicators
User selects date → API call to get employee attendance → Display employee list with details
```

### 2. Updating Attendance
```
User clicks edit → Modal opens with current data → User makes changes → API call to update → Refresh data → Show success message
```

### 3. Status Mapping
Frontend statuses are mapped to backend enums:
- `present` → `PRESENT`
- `late` → `LATE_ARRIVAL`
- `absent` → `ABSENT`
- `leave` → `SHORT_LEAVE`
- `halfDay` → `EARLY_DEPARTURE`

## Testing

### API Testing
Use tools like Postman to test endpoints with Bearer tokens:
```
Authorization: Bearer your-jwt-token-here
```

### Frontend Testing
1. Verify branch dropdown loads correctly
2. Test calendar navigation and date selection
3. Test attendance record updates
4. Verify error handling for network issues
5. Test authentication token expiration

## Performance Considerations

### 1. Data Caching
- Calendar data is cached until branch changes
- Employee data is cached until date changes
- Branch data is loaded once on component mount

### 2. Loading States
- Shows loading spinners during API calls
- Disables buttons during updates
- Provides visual feedback for all operations

### 3. Error Recovery
- Automatic retry for failed requests
- Clear error messages for user action
- Graceful degradation when services are unavailable

## Security

### 1. JWT Authentication
- All API calls include JWT tokens
- Tokens are validated on the backend
- Automatic logout on token expiration

### 2. Input Validation
- Frontend validation for time formats
- Backend validation using Spring annotations
- SQL injection prevention through JPA

### 3. CORS Configuration
- Configured for specific origins in production
- Wildcard (`*`) only for development

## Troubleshooting

### Common Issues

#### 1. 403 Forbidden Errors
- **Cause**: Missing or invalid JWT token
- **Solution**: Ensure user is logged in and token is valid

#### 2. MUI Select Warning
- **Cause**: Selected value not in options array
- **Solution**: Initialize selectedBranch as empty string until branches load

#### 3. Date Format Issues
- **Cause**: Inconsistent date formats between frontend and backend
- **Solution**: Use `formatDateForAPI()` utility function

#### 4. Calendar Not Loading
- **Cause**: Branch not selected or API endpoint issues
- **Solution**: Check network tab and verify branch selection

### Debug Steps
1. Check browser console for errors
2. Verify network requests in DevTools
3. Check JWT token in localStorage
4. Verify backend server is running
5. Check database connections

## Future Enhancements

### 1. Real-time Updates
- WebSocket integration for live attendance updates
- Push notifications for attendance alerts

### 2. Advanced Reporting
- Export functionality (PDF, Excel)
- Custom date range reports
- Attendance analytics and trends

### 3. Mobile Support
- Responsive design improvements
- Mobile app integration
- Geofencing for location-based attendance

### 4. Bulk Operations
- Bulk attendance updates
- Import/export employee attendance
- Template-based attendance management

## Conclusion

The attendance system is now fully integrated with the backend API and includes proper authentication, error handling, and user experience features. All mock data has been removed and the system relies entirely on real API endpoints with JWT authentication.

# Authentication Implementation Guide

This project now includes a comprehensive authentication system that integrates with the Laravel Passport backend API. Here's how everything works together:

## 🏗️ Architecture Overview

### Authentication Flow
1. **Login/Register** → Laravel API returns JWT tokens
2. **Token Storage** → Stored in localStorage with user data
3. **Automatic Headers** → Axios interceptors add Bearer tokens
4. **Route Protection** → React components check auth status
5. **Auto Logout** → 401 responses trigger logout and redirect

### Key Components

#### 1. Authentication Service (`lib/auth.js`)
- Handles all API calls to Laravel backend
- Manages token storage and retrieval
- Provides authentication methods (login, register, logout, etc.)

#### 2. Auth Context (`contexts/AuthContext.js`)
- React Context for global authentication state
- Provides hooks for components to access auth data
- Manages loading states and user data

#### 3. Axios Configuration (`lib/axios.js`)
- Configured axios instance with interceptors
- Automatically adds Bearer tokens to requests
- Handles 401 responses by clearing auth and redirecting

#### 4. Protected Routes (`components/ProtectedRoute.jsx`)
- Wrapper component for protecting pages
- Checks authentication status
- Supports role-based access control

#### 5. Redux Integration
- Updated Redux store to work with new auth system
- Auth slices maintain compatibility
- API slice includes proper token handling

## 🚀 Quick Start

### 1. Environment Setup
Make sure your `.env.local` has the correct API URL:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

### 2. Start the Backend
Ensure your Laravel backend is running on `http://localhost:8000`

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Application
```bash
npm run dev
```

## 📋 Usage Examples

### Using Authentication in Components

#### With Auth Hook
```jsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, loading, login, logout, isAuthenticated } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>Please login</div>
      )}
    </div>
  );
}
```

#### Protected Routes
```jsx
import ProtectedRoute from '@/components/ProtectedRoute';

function AdminPage() {
  return (
    <ProtectedRoute requiredRole={1}>
      <div>Admin content here</div>
    </ProtectedRoute>
  );
}
```

#### Making Authenticated API Calls
```jsx
import api from '@/lib/axios';

// The axios instance automatically includes auth headers
async function fetchUserData() {
  try {
    const response = await api.get('/user/profile');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
  }
}
```

### Authentication Methods

#### Login
```jsx
const { login } = useAuth();

const handleLogin = async () => {
  const result = await login('user@example.com', 'password');
  if (result.success) {
    console.log('Login successful');
  } else {
    console.error('Login failed:', result.error);
  }
};
```

#### Register
```jsx
const { register } = useAuth();

const handleRegister = async () => {
  const userData = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    password_confirmation: 'password123',
    role_id: 3,
    branch_id: 1
  };
  
  const result = await register(userData);
  if (result.success) {
    console.log('Registration successful');
  } else {
    console.error('Registration failed:', result.error);
  }
};
```

#### Logout
```jsx
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  // User will be redirected to login page
};
```

## 🔐 Security Features

### Token Management
- JWT tokens stored in localStorage
- Automatic token expiration handling
- Refresh token support (when backend implements it)

### Request Security
- All API requests include Bearer tokens
- HTTPS enforcement in production
- Proper CORS handling

### Route Protection
- Automatic redirect to login for unauthenticated users
- Role-based access control
- Loading states during auth checks

## 🛠️ Available API Endpoints

The authentication system integrates with these Laravel backend endpoints:

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration  
- `GET /api/v1/auth/user` - Get authenticated user
- `POST /api/v1/auth/logout` - Logout current device
- `POST /api/v1/auth/logout-all` - Logout all devices
- `POST /api/v1/auth/refresh` - Refresh token (not yet implemented)

## 🎯 Role-Based Access

The system supports role-based access control:

- **Role 1**: Admin - Full access to all features
- **Role 2**: Beautician - Access to appointment and service management
- **Role 3**: Customer - Access to booking and profile features

Example usage:
```jsx
<ProtectedRoute requiredRole={1}>
  <AdminPanel />
</ProtectedRoute>
```

## 🔧 Configuration

### API Base URL
Configure in `.env.local`:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

### Token Storage
Currently using localStorage. For enhanced security, consider:
- HTTP-only cookies
- Secure session storage
- Token encryption

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure Laravel backend has proper CORS configuration
   - Check API URL in environment variables

2. **401 Unauthorized**
   - Verify token format: `Bearer <token>`
   - Check if token has expired
   - Ensure backend is running

3. **Registration Validation Errors**
   - Check all required fields are provided
   - Verify role_id and branch_id exist in database
   - Ensure password confirmation matches

### Debug Information
The dashboard page includes authentication debug information to help troubleshoot issues.

## 📚 Next Steps

1. **Implement Token Refresh**: When backend supports it
2. **Add Password Reset**: Forgot password functionality
3. **Enhanced Security**: HTTP-only cookies, CSP headers
4. **User Profile Management**: Update user information
5. **Session Management**: Show active sessions, logout other devices

## 🤝 Contributing

When working with authentication:
1. Always test with different user roles
2. Verify token expiration handling
3. Test protected routes
4. Ensure proper error handling
5. Check responsive design on mobile

---

This authentication system provides a solid foundation for secure user management in your salon application. The modular design makes it easy to extend and customize based on your specific requirements.

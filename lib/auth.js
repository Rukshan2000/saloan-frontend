// Authentication service for Laravel Passport API integration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

class AuthService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/auth`;
    this.token = null;
    
    // Initialize token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token');
    }
  }

  // Login user
  async login(email, password) {
    try {
      const response = await fetch(`${this.baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        this.token = data.data.access_token;
        
        // Store tokens and user data
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', this.token);
          localStorage.setItem('refresh_token', data.data.refresh_token);
          localStorage.setItem('user', JSON.stringify(data.data.user));
          localStorage.setItem('token_expires_in', data.data.expires_in);
        }
        
        return { 
          success: true, 
          user: data.data.user,
          token: this.token,
          refreshToken: data.data.refresh_token,
          expiresIn: data.data.expires_in
        };
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await fetch(`${this.baseURL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        this.token = data.data.access_token;
        
        // Store tokens and user data
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', this.token);
          localStorage.setItem('refresh_token', data.data.refresh_token);
          localStorage.setItem('user', JSON.stringify(data.data.user));
          localStorage.setItem('token_expires_in', data.data.expires_in);
        }
        
        return { 
          success: true, 
          user: data.data.user,
          token: this.token,
          refreshToken: data.data.refresh_token,
          expiresIn: data.data.expires_in
        };
      } else {
        return { 
          success: false, 
          error: data.message || 'Registration failed',
          errors: data.errors || {}
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get authenticated user
  async getUser() {
    try {
      const response = await fetch(`${this.baseURL}/user`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(data.data.user));
        }
        return { success: true, user: data.data.user };
      } else {
        throw new Error(data.message || 'Failed to get user');
      }
    } catch (error) {
      console.error('Get user error:', error);
      return { success: false, error: error.message };
    }
  }

  // Logout user
  async logout() {
    try {
      if (this.token) {
        await fetch(`${this.baseURL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      this.clearLocalStorage();
    }
  }

  // Logout from all devices
  async logoutAll() {
    try {
      if (this.token) {
        await fetch(`${this.baseURL}/logout-all`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout all error:', error);
    } finally {
      // Always clear local storage
      this.clearLocalStorage();
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token;
  }

  // Get current user from localStorage
  getCurrentUser() {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  // Get current token
  getToken() {
    return this.token;
  }

  // Clear local storage
  clearLocalStorage() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('token_expires_in');
    }
    this.token = null;
  }

  // Make authenticated API requests
  async authenticatedRequest(url, options = {}) {
    const defaultOptions = {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };

    const response = await fetch(url, mergedOptions);

    if (response.status === 401) {
      // Token expired, clear storage and redirect to login
      this.clearLocalStorage();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    }

    return response;
  }

  // Refresh token (currently not implemented in backend)
  async refreshToken() {
    // Note: As per the guide, refresh functionality is currently not available
    // Users should re-login when tokens expire
    throw new Error('Refresh token functionality is currently not available. Please login again.');
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;

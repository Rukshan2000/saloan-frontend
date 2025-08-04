import { createContext, useContext, useState, useEffect } from 'react';
import authService from '@/lib/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Check if user is already logged in
      const savedToken = authService.getToken();
      const savedUser = authService.getCurrentUser();

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);
        
        // Verify token is still valid by fetching user data
        const userResult = await authService.getUser();
        if (userResult.success) {
          setUser(userResult.user);
        } else {
          // Token is invalid, clear auth
          await logout();
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      await logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await authService.login(email, password);
      
      if (result.success) {
        setToken(result.token);
        setUser(result.user);
        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const result = await authService.register(userData);
      
      if (result.success) {
        setToken(result.token);
        setUser(result.user);
        return { success: true, user: result.user };
      } else {
        return { 
          success: false, 
          error: result.error,
          errors: result.errors 
        };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  const logoutAll = async () => {
    try {
      await authService.logoutAll();
    } catch (error) {
      console.error('Logout all error:', error);
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    logoutAll,
    updateUser,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

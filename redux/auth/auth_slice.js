import { createSlice } from '@reduxjs/toolkit';

// Initialize state from localStorage if available
const getInitialState = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (token && user) {
      try {
        return {
          user: JSON.parse(user),
          accessToken: token,
          refreshToken: refreshToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        };
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear corrupted data
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
      }
    }
  }
  
  return {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    userLoggedIn: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { 
  loginStart, 
  userLoggedIn, 
  loginFailure, 
  logout, 
  updateUser, 
  clearError 
} = authSlice.actions;

export default authSlice.reducer;

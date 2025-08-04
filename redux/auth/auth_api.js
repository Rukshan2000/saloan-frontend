import { apiSlice } from "../api/api_slice";
import { userLoggedIn, logout } from "./auth_slice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "auth/login",
        method: "POST",
        body: { email, password },
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          const { data } = result.data;
          
          if (data && data.access_token) {
            // Store tokens in localStorage
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token_expires_in', data.expires_in);
            
            // Update Redux store
            dispatch(
              userLoggedIn({
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                user: data.user,
              })
            );
          }
        } catch (error) {
          console.error("Login error:", error);
        }
      }
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "auth/register",
        method: "POST",
        body: userData,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          const { data } = result.data;
          
          if (data && data.access_token) {
            // Store tokens in localStorage
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token_expires_in', data.expires_in);
            
            // Update Redux store
            dispatch(
              userLoggedIn({
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                user: data.user,
              })
            );
          }
        } catch (error) {
          console.error("Registration error:", error);
        }
      }
    }),
    getUser: builder.query({
      query: () => ({
        url: "auth/user",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          // Clear auth data regardless of API response
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          localStorage.removeItem('token_expires_in');
          dispatch(logout());
        }
      }
    }),
    logoutAll: builder.mutation({
      query: () => ({
        url: "auth/logout-all",
        method: "POST",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Logout all error:", error);
        } finally {
          // Clear auth data regardless of API response
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          localStorage.removeItem('token_expires_in');
          dispatch(logout());
        }
      }
    }),
    refreshToken: builder.mutation({
      query: (refreshToken) => ({
        url: "auth/refresh",
        method: "POST",
        body: { refresh_token: refreshToken },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserQuery,
  useLogoutMutation,
  useLogoutAllMutation,
  useRefreshTokenMutation,
} = authApi;

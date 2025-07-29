import { apiSlice } from "../api/api_slice";
import { userLoggedIn } from "./auth_slice";

// Stubs for userLoggedOut and userRegistration if needed in the future
export const userLoggedOut = () => ({ type: 'auth/userLoggedOut' });
export const userRegistration = () => ({ type: 'auth/userRegistration' });

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, password, rememberMe }) => ({
        url: "v1/login",
        method: "POST",
        body: { email, password, rememberMe },
        credentials: "include",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.access_token,
              refreshToken: result.data.refresh_token,
              user: result.data.user,
            })
          );
          if (arg.rememberMe) {
            localStorage.setItem("email", arg.email);
            localStorage.setItem("password", arg.password);
          } else {
            localStorage.removeItem("email");
            localStorage.removeItem("password");
          }
        } catch (error) {
          console.log("error");
        }
      },
    }),
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: "user/changepassword",
        method: "PUT",
        body: passwordData,
      }),
    }),
  }),
});
export const { useLoginMutation, useChangePasswordMutation } = authApi;

// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
// import { userLoggedIn } from '../auth/auth_slice';

// const baseQuery = fetchBaseQuery({
//   baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
//   credentials: "include",
//   prepareHeaders: (headers, { getState }) => {
//     const accessToken = getState().auth.accessToken
//     if (accessToken) {
//       headers.set("authorization", `Bearer ${accessToken}`)
//     }
//     return headers
//   },
// })

// const baseQueryWithReauth = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions)

//   // If we get a 401 error, try refreshing the token
//   if (result?.error?.status === 401) {
//     console.log(result.error.status)
//     const state = api.getState()
//     const accessToken = state.auth.accessToken
//     const refreshToken = state.auth.refreshToken
//     if (refreshToken) {
//       console.log(refreshToken)
//       try {
//         const refreshResult = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/refresh-token`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               authorization: `Bearer ${refreshToken}`,
//               resettoken: accessToken,
//             },
//           }
//         )
//         if (refreshResult.ok) {
//           const refreshData = await refreshResult.json()
//           const { user, access_token, refresh_token } = refreshData
//           api.dispatch(
//             userLoggedIn({
//               accessToken: access_token,
//               refreshToken: refresh_token,
//               user: user,
//             })
//           )
//           result = await baseQuery(args, api, extraOptions)
//         } else if (refreshResult.status === 403) {
//           api.dispatch(logout())
//         } else {
//           api.dispatch(logout())
//         }
//       } catch (error) {
//         console.error("Error during token refresh:", error)
//         api.dispatch(logout())
//       }
//     } else {
//       api.dispatch(logout())
//     }
//   }
//   return result
// }

// export const apiSlice = createApi({
//   baseQuery: baseQueryWithReauth,
//   tagTypes: ["Roles", "Users", "widget"],
//   endpoints: (builder) => ({}),
// })


import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'}`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    // Add authentication token to headers
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('accept', 'application/json');
    headers.set('content-type', 'application/json');
    return headers;
  },
})

// Base query with automatic logout on 401
const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  
  if (result?.error?.status === 401) {
    // Clear auth data and redirect to login
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('token_expires_in');
      window.location.href = '/login';
    }
  }
  
  return result;
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Roles", "Users", "widget", "Invoices", "InvoiceStats", "Appointments", "Services", "Branches"],
  endpoints: (builder) => ({}),
})
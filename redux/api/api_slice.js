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
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
  credentials: "include",
  prepareHeaders: (headers) => {
    // No authentication headers added
    return headers
  },
})

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Roles", "Users", "widget"],
  endpoints: (builder) => ({}),
})
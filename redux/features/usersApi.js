import { apiSlice } from "../api/api_slice"

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({ url: "v1/users", method: "GET" }),
      providesTags: ["Users"],
    }),
    createUser: builder.mutation({
      query: (data) => ({ url: "v1/users", method: "POST", body: data }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/users/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Users"],
    }),
    patchUser: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/users/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `v1/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["Users"],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  usePatchUserMutation,
  useDeleteUserMutation,
} = usersApi

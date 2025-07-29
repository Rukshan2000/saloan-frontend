import { apiSlice } from "../api/api_slice"

export const rolesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: () => ({ url: "v1/roles", method: "GET" }),
      providesTags: ["Roles"],
    }),
    createRole: builder.mutation({
      query: (data) => ({ url: "v1/roles", method: "POST", body: data }),
      invalidatesTags: ["Roles"],
    }),
    updateRole: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/roles/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Roles"],
    }),
    patchRole: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/roles/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["Roles"],
    }),
    deleteRole: builder.mutation({
      query: (id) => ({ url: `v1/roles/${id}`, method: "DELETE" }),
      invalidatesTags: ["Roles"],
    }),
  }),
})

export const {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  usePatchRoleMutation,
  useDeleteRoleMutation,
} = rolesApi

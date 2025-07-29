import { apiSlice } from "../api/api_slice"

export const branchesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBranches: builder.query({
      query: () => ({ url: "v1/branches", method: "GET" }),
      providesTags: ["Branches"],
    }),
    createBranch: builder.mutation({
      query: (data) => ({ url: "v1/branches", method: "POST", body: data }),
      invalidatesTags: ["Branches"],
    }),
    updateBranch: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/branches/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Branches"],
    }),
    patchBranch: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/branches/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["Branches"],
    }),
    deleteBranch: builder.mutation({
      query: (id) => ({ url: `v1/branches/${id}`, method: "DELETE" }),
      invalidatesTags: ["Branches"],
    }),
  }),
})

export const {
  useGetBranchesQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  usePatchBranchMutation,
  useDeleteBranchMutation,
} = branchesApi

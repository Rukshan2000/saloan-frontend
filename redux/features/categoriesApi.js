import { apiSlice } from "../api/api_slice"

export const categoriesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({ url: "v1/categories", method: "GET" }),
      providesTags: ["Categories"],
    }),
    createCategory: builder.mutation({
      query: (data) => ({ url: "v1/categories", method: "POST", body: data }),
      invalidatesTags: ["Categories"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/categories/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Categories"],
    }),
    patchCategory: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/categories/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["Categories"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({ url: `v1/categories/${id}`, method: "DELETE" }),
      invalidatesTags: ["Categories"],
    }),
  }),
})

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  usePatchCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi

import { apiSlice } from "../api/api_slice"

export const servicesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => ({ url: "v1/services", method: "GET" }),
      providesTags: ["Services"],
    }),
    createService: builder.mutation({
      query: (data) => ({ url: "v1/services", method: "POST", body: data }),
      invalidatesTags: ["Services"],
    }),
    updateService: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/services/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Services"],
    }),
    patchService: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/services/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["Services"],
    }),
    deleteService: builder.mutation({
      query: (id) => ({ url: `v1/services/${id}`, method: "DELETE" }),
      invalidatesTags: ["Services"],
    }),
  }),
})

export const {
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  usePatchServiceMutation,
  useDeleteServiceMutation,
} = servicesApi

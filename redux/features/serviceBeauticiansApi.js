import { apiSlice } from "../api/api_slice"

export const serviceBeauticiansApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServiceBeauticians: builder.query({
      query: () => ({ url: "v1/service-beauticians", method: "GET" }),
      providesTags: ["ServiceBeauticians"],
    }),
    createServiceBeautician: builder.mutation({
      query: (data) => ({ url: "v1/service-beauticians", method: "POST", body: data }),
      invalidatesTags: ["ServiceBeauticians"],
    }),
    updateServiceBeautician: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/service-beauticians/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["ServiceBeauticians"],
    }),
    patchServiceBeautician: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/service-beauticians/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["ServiceBeauticians"],
    }),
    deleteServiceBeautician: builder.mutation({
      query: (id) => ({ url: `v1/service-beauticians/${id}`, method: "DELETE" }),
      invalidatesTags: ["ServiceBeauticians"],
    }),
  }),
})

export const {
  useGetServiceBeauticiansQuery,
  useCreateServiceBeauticianMutation,
  useUpdateServiceBeauticianMutation,
  usePatchServiceBeauticianMutation,
  useDeleteServiceBeauticianMutation,
} = serviceBeauticiansApi

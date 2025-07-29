import { apiSlice } from "../api/api_slice"

export const beauticianAvailabilityApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBeauticianAvailability: builder.query({
      query: () => ({ url: "v1/beautician-availability", method: "GET" }),
      providesTags: ["BeauticianAvailability"],
    }),
    createBeauticianAvailability: builder.mutation({
      query: (data) => ({ url: "v1/beautician-availability", method: "POST", body: data }),
      invalidatesTags: ["BeauticianAvailability"],
    }),
    updateBeauticianAvailability: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/beautician-availability/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["BeauticianAvailability"],
    }),
    patchBeauticianAvailability: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/beautician-availability/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["BeauticianAvailability"],
    }),
    deleteBeauticianAvailability: builder.mutation({
      query: (id) => ({ url: `v1/beautician-availability/${id}`, method: "DELETE" }),
      invalidatesTags: ["BeauticianAvailability"],
    }),
  }),
})

export const {
  useGetBeauticianAvailabilityQuery,
  useCreateBeauticianAvailabilityMutation,
  useUpdateBeauticianAvailabilityMutation,
  usePatchBeauticianAvailabilityMutation,
  useDeleteBeauticianAvailabilityMutation,
} = beauticianAvailabilityApi

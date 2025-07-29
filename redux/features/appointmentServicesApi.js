import { apiSlice } from "../api/api_slice"

export const appointmentServicesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAppointmentServices: builder.query({
      query: () => ({ url: "v1/appointment-services", method: "GET" }),
      providesTags: ["AppointmentServices"],
    }),
    createAppointmentService: builder.mutation({
      query: (data) => ({ url: "v1/appointment-services", method: "POST", body: data }),
      invalidatesTags: ["AppointmentServices"],
    }),
    updateAppointmentService: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/appointment-services/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["AppointmentServices"],
    }),
    patchAppointmentService: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/appointment-services/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["AppointmentServices"],
    }),
    deleteAppointmentService: builder.mutation({
      query: (id) => ({ url: `v1/appointment-services/${id}`, method: "DELETE" }),
      invalidatesTags: ["AppointmentServices"],
    }),
  }),
})

export const {
  useGetAppointmentServicesQuery,
  useCreateAppointmentServiceMutation,
  useUpdateAppointmentServiceMutation,
  usePatchAppointmentServiceMutation,
  useDeleteAppointmentServiceMutation,
} = appointmentServicesApi

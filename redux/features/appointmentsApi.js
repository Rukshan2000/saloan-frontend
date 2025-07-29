import { apiSlice } from "../api/api_slice"

export const appointmentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAppointments: builder.query({
      query: () => ({ url: "v1/appointments", method: "GET" }),
      providesTags: ["Appointments"],
    }),
    createAppointment: builder.mutation({
      query: (data) => ({ url: "v1/appointments", method: "POST", body: data }),
      invalidatesTags: ["Appointments"],
    }),
    updateAppointment: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/appointments/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Appointments"],
    }),
    patchAppointment: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/appointments/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["Appointments"],
    }),

    deleteAppointment: builder.mutation({
      query: (id) => ({ url: `v1/appointments/${id}`, method: "DELETE" }),
      invalidatesTags: ["Appointments"],
    }),
  }),
})

export const {
  useGetAppointmentsQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  usePatchAppointmentMutation,
  useDeleteAppointmentMutation,
} = appointmentsApi

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
    // Enhanced booking endpoints
    getAvailableTimeSlots: builder.query({
      query: ({ beautician_id, total_duration, date }) => {
        const params = new URLSearchParams()
        if (beautician_id) params.append("beautician_id", beautician_id)
        if (date) params.append("date", date)
        if (total_duration) params.append("total_duration", total_duration)
        return {
          url: `v1/appointment-services/available-time-slots?${params.toString()}`,
          method: "GET"
        }
      },
      providesTags: ["AvailableTimeSlots"],
    }),
    findBestBeautician: builder.query({
      query: ({ service_ids, date, branch_id }) => {
        const params = new URLSearchParams()
        service_ids.forEach(id => params.append("service_ids[]", id))
        params.append("date", date)
        if (branch_id) params.append("branch_id", branch_id)
        return {
          url: `v1/appointment-services/find-best-beautician?${params.toString()}`,
          method: "GET"
        }
      },
      providesTags: ["BestBeautician"],
    }),
    getAvailableBeauticians: builder.query({
      query: ({ service_ids, date, branch_id }) => {
        const params = new URLSearchParams()
        service_ids.forEach(id => params.append("service_ids[]", id))
        params.append("date", date)
        if (branch_id) params.append("branch_id", branch_id)
        return {
          url: `v1/appointment-services/available-beauticians?${params.toString()}`,
          method: "GET"
        }
      },
      providesTags: ["AvailableBeauticians"],
    }),
  }),
})

export const {
  useGetAppointmentServicesQuery,
  useCreateAppointmentServiceMutation,
  useUpdateAppointmentServiceMutation,
  usePatchAppointmentServiceMutation,
  useDeleteAppointmentServiceMutation,
  useGetAvailableTimeSlotsQuery,
  useFindBestBeauticianQuery,
  useGetAvailableBeauticiansQuery,
} = appointmentServicesApi

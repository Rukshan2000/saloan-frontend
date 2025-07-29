import { apiSlice } from "../api/api_slice"

export const timeSlotsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTimeSlots: builder.query({
      query: () => ({ url: "v1/time-slots", method: "GET" }),
      providesTags: ["TimeSlots"],
    }),
    createTimeSlot: builder.mutation({
      query: (data) => ({ url: "v1/time-slots", method: "POST", body: data }),
      invalidatesTags: ["TimeSlots"],
    }),
    updateTimeSlot: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/time-slots/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["TimeSlots"],
    }),
    patchTimeSlot: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/time-slots/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["TimeSlots"],
    }),
    deleteTimeSlot: builder.mutation({
      query: (id) => ({ url: `v1/time-slots/${id}`, method: "DELETE" }),
      invalidatesTags: ["TimeSlots"],
    }),
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
  }),
})

export const {
  useGetTimeSlotsQuery,
  useCreateTimeSlotMutation,
  useUpdateTimeSlotMutation,
  usePatchTimeSlotMutation,
  useDeleteTimeSlotMutation,
  useGetAvailableTimeSlotsQuery,
} = timeSlotsApi

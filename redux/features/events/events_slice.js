import { apiSlice } from "../../api/api_slice"

export const eventsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllEvents: builder.query({
      query: () => ({
        url: "alleventss",
        method: "GET",
      }),
      providesTags: ["Events"],
    }),
    addEvent: builder.mutation({
      query: (event) => ({
        url: "addeventss",
        method: "POST",
        body: event,
      }),
      invalidatesTags: ["Events"],
    }),
    updateEvent: builder.mutation({
      query: ({ id, ...event }) => ({
        url: `/eventsupdate/${id}`,
        method: "POST",
        body: event,
      }),
      invalidatesTags: ["Events"],
    }),
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `/eventsdelete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Events"],
    }),
  }),
})

export const {
  useGetAllEventsQuery,
  useAddEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventsApi

import { apiSlice } from "../api/api_slice"

export const contentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchNews: builder.query({
      query: () => ({
        url: "news",
        method: "GET",
      }),
      providesTags: ["News"],
    }),
    fetchEvents: builder.query({
      query: () => ({
        url: "events",
        method: "GET",
      }),
      providesTags: ["Events"],
    }),
    fetchCampaigns: builder.query({
      query: () => ({
        url: "campaigns",
        method: "GET",
      }),
      providesTags: ["Campaigns"],
    }),
    submitContact: builder.mutation({
      query: (contactData) => ({
        url: "contact",
        method: "POST",
        body: contactData,
      }),
    }),
    submitVolunteer: builder.mutation({
      query: (volunteerData) => ({
        url: "volunteer",
        method: "POST",
        body: volunteerData,
      }),
    }),
    submitDonation: builder.mutation({
      query: (donationData) => ({
        url: "donations",
        method: "POST",
        body: donationData,
      }),
    }),
    createPaymentIntent: builder.mutation({
      query: (paymentData) => ({
        url: "payments/create-intent",
        method: "POST",
        body: paymentData,
      }),
    }),
    confirmPayment: builder.mutation({
      query: (confirmationData) => ({
        url: "payments/confirm",
        method: "POST",
        body: confirmationData,
      }),
    }),
    getDonationHistory: builder.query({
      query: (userId) => ({
        url: `donations/history/${userId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Donations"],
    }),
  }),
})

export const {
  useFetchNewsQuery,
  useFetchEventsQuery,
  useFetchCampaignsQuery,
  useSubmitContactMutation,
  useSubmitVolunteerMutation,
  useSubmitDonationMutation,
  useCreatePaymentIntentMutation,
  useConfirmPaymentMutation,
  useGetDonationHistoryQuery,
} = contentApi

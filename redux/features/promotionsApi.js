import { apiSlice } from "../api/api_slice"

export const promotionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPromotions: builder.query({
      query: () => ({ url: "v1/promotions", method: "GET" }),
      providesTags: ["Promotions"],
    }),
    createPromotion: builder.mutation({
      query: (data) => ({ url: "v1/promotions", method: "POST", body: data }),
      invalidatesTags: ["Promotions"],
    }),
    updatePromotion: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/promotions/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Promotions"],
    }),
    patchPromotion: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/promotions/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["Promotions"],
    }),
    deletePromotion: builder.mutation({
      query: (id) => ({ url: `v1/promotions/${id}`, method: "DELETE" }),
      invalidatesTags: ["Promotions"],
    }),
  }),
})

export const {
  useGetPromotionsQuery,
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
  usePatchPromotionMutation,
  useDeletePromotionMutation,
} = promotionsApi

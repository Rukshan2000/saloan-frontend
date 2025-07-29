import { apiSlice } from "../api/api_slice"

export const invoicesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInvoices: builder.query({
      query: () => ({ url: "v1/invoices", method: "GET" }),
      providesTags: ["Invoices"],
    }),
    createInvoice: builder.mutation({
      query: (data) => ({ url: "v1/invoices", method: "POST", body: data }),
      invalidatesTags: ["Invoices"],
    }),
    updateInvoice: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/invoices/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Invoices"],
    }),
    patchInvoice: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/invoices/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["Invoices"],
    }),
    deleteInvoice: builder.mutation({
      query: (id) => ({ url: `v1/invoices/${id}`, method: "DELETE" }),
      invalidatesTags: ["Invoices"],
    }),
  }),
})

export const {
  useGetInvoicesQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  usePatchInvoiceMutation,
  useDeleteInvoiceMutation,
} = invoicesApi

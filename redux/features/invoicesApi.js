import { apiSlice } from "../api/api_slice"

export const invoicesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInvoices: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        if (params.status) searchParams.append('status', params.status)
        if (params.customer_id) searchParams.append('customer_id', params.customer_id)
        if (params.date_from) searchParams.append('date_from', params.date_from)
        if (params.date_to) searchParams.append('date_to', params.date_to)
        if (params.page) searchParams.append('page', params.page)
        
        const queryString = searchParams.toString()
        return { 
          url: `v1/invoices${queryString ? `?${queryString}` : ''}`, 
          method: "GET" 
        }
      },
      transformResponse: (response) => {
        console.log('InvoicesApi - Raw API response:', response)
        
        // Handle different response structures
        if (Array.isArray(response)) {
          return response
        }
        
        // Handle Laravel pagination response: {success: true, data: {data: [...], ...pagination}}
        if (response && response.success && response.data && Array.isArray(response.data.data)) {
          console.log('InvoicesApi - Found paginated data:', response.data.data)
          return response.data.data
        }
        
        // Handle Laravel-style responses with data wrapper: {data: [...]}
        if (response && response.data && Array.isArray(response.data)) {
          return response.data
        }
        
        // Handle direct success wrapper: {success: true, data: [...]}
        if (response && response.success && Array.isArray(response.data)) {
          return response.data
        }
        
        // Fallback to empty array
        console.warn('InvoicesApi - Unexpected response structure:', response)
        return []
      },
      providesTags: ["Invoices"],
    }),
    getInvoice: builder.query({
      query: (id) => ({ url: `v1/invoices/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Invoices", id }],
    }),
    getInvoiceStatistics: builder.query({
      query: () => ({ url: "v1/invoices/statistics", method: "GET" }),
      providesTags: ["InvoiceStats"],
    }),
    createInvoiceFromAppointment: builder.mutation({
      query: (data) => ({ 
        url: "v1/invoices/create-from-appointment", 
        method: "POST", 
        body: data 
      }),
      invalidatesTags: ["Invoices", "InvoiceStats"],
    }),
    createInvoice: builder.mutation({
      query: (data) => ({ url: "v1/invoices", method: "POST", body: data }),
      invalidatesTags: ["Invoices", "InvoiceStats"],
    }),
    updateInvoiceStatus: builder.mutation({
      query: ({ id, status }) => ({ 
        url: `v1/invoices/${id}/status`, 
        method: "PATCH", 
        body: { status } 
      }),
      invalidatesTags: ["Invoices", "InvoiceStats"],
    }),
    sendInvoiceEmail: builder.mutation({
      query: (id) => ({ 
        url: `v1/invoices/${id}/send-email`, 
        method: "POST" 
      }),
      invalidatesTags: (result, error, id) => [{ type: "Invoices", id }],
    }),
    updateInvoice: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/invoices/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Invoices", "InvoiceStats"],
    }),
    patchInvoice: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/invoices/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["Invoices", "InvoiceStats"],
    }),
    deleteInvoice: builder.mutation({
      query: (id) => ({ url: `v1/invoices/${id}`, method: "DELETE" }),
      invalidatesTags: ["Invoices", "InvoiceStats"],
    }),
  }),
})

export const {
  useGetInvoicesQuery,
  useGetInvoiceQuery,
  useGetInvoiceStatisticsQuery,
  useCreateInvoiceFromAppointmentMutation,
  useCreateInvoiceMutation,
  useUpdateInvoiceStatusMutation,
  useSendInvoiceEmailMutation,
  useUpdateInvoiceMutation,
  usePatchInvoiceMutation,
  useDeleteInvoiceMutation,
} = invoicesApi

import { apiSlice } from "../api/api_slice"

export const saloonApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Branches
    getBranches: builder.query({
      query: () => ({ url: "v1/branches", method: "GET" }),
      providesTags: ["Branches"],
    }),
    createBranch: builder.mutation({
      query: (data) => ({ url: "v1/branches", method: "POST", body: data }),
      invalidatesTags: ["Branches"],
    }),
    updateBranch: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/branches/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Branches"],
    }),
    patchBranch: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/branches/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["Branches"],
    }),
    deleteBranch: builder.mutation({
      query: (id) => ({ url: `v1/branches/${id}`, method: "DELETE" }),
      invalidatesTags: ["Branches"],
    }),

    // Users
    getUsers: builder.query({
      query: () => ({ url: "v1/users", method: "GET" }),
      providesTags: ["Users"],
    }),
    createUser: builder.mutation({
      query: (data) => ({ url: "v1/users", method: "POST", body: data }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/users/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Users"],
    }),
    patchUser: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/users/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `v1/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["Users"],
    }),

    // Categories
    getCategories: builder.query({
      query: () => ({ url: "v1/categories", method: "GET" }),
      providesTags: ["Categories"],
    }),
    createCategory: builder.mutation({
      query: (data) => ({ url: "v1/categories", method: "POST", body: data }),
      invalidatesTags: ["Categories"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/categories/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Categories"],
    }),
    patchCategory: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/categories/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["Categories"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({ url: `v1/categories/${id}`, method: "DELETE" }),
      invalidatesTags: ["Categories"],
    }),

    // Services
    getServices: builder.query({
      query: () => ({ url: "v1/services", method: "GET" }),
      providesTags: ["Services"],
    }),
    createService: builder.mutation({
      query: (data) => ({ url: "v1/services", method: "POST", body: data }),
      invalidatesTags: ["Services"],
    }),
    updateService: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/services/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Services"],
    }),
    patchService: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/services/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["Services"],
    }),
    deleteService: builder.mutation({
      query: (id) => ({ url: `v1/services/${id}`, method: "DELETE" }),
      invalidatesTags: ["Services"],
    }),

    // Service Beauticians
    getServiceBeauticians: builder.query({
      query: () => ({ url: "v1/service-beauticians", method: "GET" }),
      providesTags: ["ServiceBeauticians"],
    }),
    createServiceBeautician: builder.mutation({
      query: (data) => ({ url: "v1/service-beauticians", method: "POST", body: data }),
      invalidatesTags: ["ServiceBeauticians"],
    }),
    updateServiceBeautician: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/service-beauticians/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["ServiceBeauticians"],
    }),
    patchServiceBeautician: builder.mutation({
      query: ({ id, ...data }) => ({ url: `v1/service-beauticians/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["ServiceBeauticians"],
    }),
    deleteServiceBeautician: builder.mutation({
      query: (id) => ({ url: `v1/service-beauticians/${id}`, method: "DELETE" }),
      invalidatesTags: ["ServiceBeauticians"],
    }),

    // Appointments
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

    // Appointment Services
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

    // Beautician Availability
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

    // Time Slots
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

    // Invoices
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

    // Promotions
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
  useGetBranchesQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  usePatchBranchMutation,
  useDeleteBranchMutation,

  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  usePatchUserMutation,
  useDeleteUserMutation,

  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  usePatchCategoryMutation,
  useDeleteCategoryMutation,

  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  usePatchServiceMutation,
  useDeleteServiceMutation,

  useGetServiceBeauticiansQuery,
  useCreateServiceBeauticianMutation,
  useUpdateServiceBeauticianMutation,
  usePatchServiceBeauticianMutation,
  useDeleteServiceBeauticianMutation,

  useGetAppointmentsQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  usePatchAppointmentMutation,
  useDeleteAppointmentMutation,

  useGetAppointmentServicesQuery,
  useCreateAppointmentServiceMutation,
  useUpdateAppointmentServiceMutation,
  usePatchAppointmentServiceMutation,
  useDeleteAppointmentServiceMutation,

  useGetBeauticianAvailabilityQuery,
  useCreateBeauticianAvailabilityMutation,
  useUpdateBeauticianAvailabilityMutation,
  usePatchBeauticianAvailabilityMutation,
  useDeleteBeauticianAvailabilityMutation,

  useGetTimeSlotsQuery,
  useCreateTimeSlotMutation,
  useUpdateTimeSlotMutation,
  usePatchTimeSlotMutation,
  useDeleteTimeSlotMutation,

  useGetInvoicesQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  usePatchInvoiceMutation,
  useDeleteInvoiceMutation,

  useGetPromotionsQuery,
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
  usePatchPromotionMutation,
  useDeletePromotionMutation,
} = saloonApi

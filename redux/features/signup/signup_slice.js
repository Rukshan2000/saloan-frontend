import { apiSlice } from "../../api/api_slice"

export const signupApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProfiles: builder.query({
      query: () => ({
        url: "/allprofiles",
        method: "GET",
      }),
    }),
    addProfile: builder.mutation({
      query: (profile) => ({
        url: "/addprofiles",
        method: "POST",
        body: profile,
      }),
    }),
    updateProfile: builder.mutation({
      query: ({ id, ...profile }) => ({
        url: `/profilesupdate/${id}`,
        method: "POST",
        body: profile,
      }),
    }),
    deleteProfile: builder.mutation({
      query: (id) => ({
        url: `/profilesdelete/${id}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const {
  useGetAllProfilesQuery,
  useAddProfileMutation,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
} = signupApi

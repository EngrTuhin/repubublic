import { baseApi } from "../api/baseApi";

export const claimsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClaims: builder.query({
      query: (params) => ({
        url: "/v1/claims",
        params,
      }),
      providesTags: ["Claims"],
    }),
    getClaimById: builder.query({
      query: (id) => `/v1/claims/${id}`,
      providesTags: (result, error, id) => [{ type: "Claims", id }],
    }),
    updateClaim: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/v1/claims/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Claims", id }, "Claims"],
    }),
    deleteClaim: builder.mutation({
      query: (id) => ({
        url: `/v1/claims/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Claims"],
    }),
  }),
});

export const {
  useGetClaimsQuery,
  useGetClaimByIdQuery,
  useUpdateClaimMutation,
  useDeleteClaimMutation,
} = claimsApi;

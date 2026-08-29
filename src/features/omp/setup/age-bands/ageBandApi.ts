import { baseApi } from "@/features/api/baseApi";
import { getFilterParams } from "@/lib/utils";

export const ageBandApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getOmpAgeBands: builder.query({
      query: (params) => {
        const filters = getFilterParams();
        const baseParams = typeof filters === "object" && filters !== null ? filters : {};
        return {
          url: "/v1/omp-age-bands",
          method: "GET",
          params: { ...baseParams, ...params },
        };
      },
    }),
    createOmpAgeBand: builder.mutation({
      query: (data) => ({ url: "/v1/omp-age-bands", method: "POST", body: data }),
      invalidatesTags: [{ type: "OmpUnderwriting", id: "AGE_BAND_LIST" }],
    }),
    updateOmpAgeBand: builder.mutation({
      query: ({ id, data }) => ({ url: `/v1/omp-age-bands/${id}`, method: "PUT", body: data }),
      invalidatesTags: (result, error, { id }) => [
        { type: "OmpUnderwriting", id: "AGE_BAND_LIST" },
        { type: "OmpUnderwriting", id: `AGE_BAND_${id}` },
      ],
    }),
    deleteOmpAgeBand: builder.mutation({
      query: (id) => ({ url: `/v1/omp-age-bands/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "OmpUnderwriting", id: "AGE_BAND_LIST" }],
    }),
  }),
});

export const {
  useGetOmpAgeBandsQuery,
  useCreateOmpAgeBandMutation,
  useUpdateOmpAgeBandMutation,
  useDeleteOmpAgeBandMutation,
} = ageBandApi;

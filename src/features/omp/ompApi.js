import { baseApi } from "../api/baseApi";

export const ompApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getOmpPolicyTypes: builder.query({
      query: () => ({ url: "/v1/omp-policy-types", method: "GET" }),
    }),
    getOmpPlanOptions: builder.query({
      query: () => ({ url: "/v1/omp-plan-options", method: "GET" }),
    }),
    getOmpCountryOptions: builder.query({
      query: () => ({ url: "/v1/omp-country-options", method: "GET" }),
    }),
    getOmpInsurances: builder.query({
      query: () => ({ url: "/v1/omps", method: "GET" }),
      providesTags: (result) => {
        const items = result?.data?.data ?? result?.data ?? [];
        return Array.isArray(items)
          ? [
              ...items.map(({ id }) => ({ type: "OmpUnderwriting", id })),
              { type: "OmpUnderwriting", id: "LIST" },
            ]
          : [{ type: "OmpUnderwriting", id: "LIST" }];
      },
    }),
    getOmpInsurance: builder.query({
      query: (id) => ({ url: `/v1/omps/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "OmpUnderwriting", id }],
    }),
    deleteOmpInsurance: builder.mutation({
      query: (id) => ({ url: `/v1/omps/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "OmpUnderwriting", id: "LIST" }],
    }),
    updateOmpInsurance: builder.mutation({
      query: ({ id, data }) => ({ url: `/v1/omps/${id}`, method: "PUT", body: data }),
      invalidatesTags: (result, error, { id }) => [
        { type: "OmpUnderwriting", id: "LIST" },
        { type: "OmpUnderwriting", id },
      ],
    }),
  }),
});

export const {
  useGetOmpPolicyTypesQuery,
  useGetOmpPlanOptionsQuery,
  useGetOmpCountryOptionsQuery,
  useGetOmpInsurancesQuery,
  useGetOmpInsuranceQuery,
  useDeleteOmpInsuranceMutation,
  useUpdateOmpInsuranceMutation,
} = ompApi;

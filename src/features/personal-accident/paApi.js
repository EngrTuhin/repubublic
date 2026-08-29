import { baseApi } from "../api/baseApi";

export const paApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPaOccupations: builder.query({
      query: () => ({ url: "/v1/pa-occupations", method: "GET" }),
    }),
    getPaTableTypes: builder.query({
      query: () => ({ url: "/v1/pa-table-types", method: "GET" }),
    }),
    getPaTariffs: builder.query({
      query: () => ({ url: "/v1/pa-tariffs", method: "GET" }),
    }),
    getPaInsurances: builder.query({
      query: () => ({ url: "/v1/pas", method: "GET" }),
      providesTags: (result) => {
        const items = result?.data?.data ?? result?.data ?? [];
        return Array.isArray(items)
          ? [
              ...items.map(({ id }) => ({ type: "PaUnderwriting", id })),
              { type: "PaUnderwriting", id: "LIST" },
            ]
          : [{ type: "PaUnderwriting", id: "LIST" }];
      },
    }),
    getPaInsurance: builder.query({
      query: (id) => ({ url: `/v1/pas/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "PaUnderwriting", id }],
    }),
    deletePaInsurance: builder.mutation({
      query: (id) => ({ url: `/v1/pas/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "PaUnderwriting", id: "LIST" }],
    }),
    updatePaInsurance: builder.mutation({
      query: ({ id, data }) => ({ url: `/v1/pas/${id}`, method: "PUT", body: data }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PaUnderwriting", id: "LIST" },
        { type: "PaUnderwriting", id },
      ],
    }),
  }),
});

export const {
  useGetPaOccupationsQuery,
  useGetPaTableTypesQuery,
  useGetPaTariffsQuery,
  useGetPaInsurancesQuery,
  useGetPaInsuranceQuery,
  useDeletePaInsuranceMutation,
  useUpdatePaInsuranceMutation,
} = paApi;

import { baseApi } from "@/features/api/baseApi";
import { getFilterParams } from "@/lib/utils";

const formatUrl = (endpoint: string, id?: string | number) => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return id !== undefined && id !== null ? `${cleanEndpoint}/${id}` : cleanEndpoint;
};

export const globalSetupApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getGlobalList: builder.query<any, { endpoint: string; params?: Record<string, any> }>({
      query: ({ endpoint, params }) => {
        const filters = getFilterParams();
        const baseParams = typeof filters === "object" && filters !== null ? filters : {};
        return {
          url: formatUrl(endpoint),
          method: "GET",
          params: { ...baseParams, ...params },
        };
      },
      providesTags: (result, error, { endpoint }) => [
        { type: "OmpUnderwriting", id: `${endpoint}_LIST` },
        "OmpUnderwriting",
      ],
    }),
    createGlobalItem: builder.mutation<any, { endpoint: string; data: any }>({
      query: ({ endpoint, data }) => ({
        url: formatUrl(endpoint),
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { endpoint }) => [
        { type: "OmpUnderwriting", id: `${endpoint}_LIST` },
        "OmpUnderwriting",
      ],
    }),
    updateGlobalItem: builder.mutation<any, { endpoint: string; id: string | number; data: any }>({
      query: ({ endpoint, id, data }) => ({
        url: formatUrl(endpoint, id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { endpoint, id }) => [
        { type: "OmpUnderwriting", id: `${endpoint}_LIST` },
        { type: "OmpUnderwriting", id: `${endpoint}_${id}` },
        "OmpUnderwriting",
      ],
    }),
    deleteGlobalItem: builder.mutation<any, { endpoint: string; id: string | number }>({
      query: ({ endpoint, id }) => ({
        url: formatUrl(endpoint, id),
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { endpoint }) => [
        { type: "OmpUnderwriting", id: `${endpoint}_LIST` },
        "OmpUnderwriting",
      ],
    }),
  }),
});

export const {
  useGetGlobalListQuery,
  useCreateGlobalItemMutation,
  useUpdateGlobalItemMutation,
  useDeleteGlobalItemMutation,
} = globalSetupApi;

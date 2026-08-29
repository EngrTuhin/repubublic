import { baseApi } from "@/features/api/baseApi";

export const reportsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getReportData: builder.query({
      query: (params) => ({
        url: "/v1/reports",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["DashboardStats"],
    }),
  }),
});

export const { useGetReportDataQuery } = reportsApi;

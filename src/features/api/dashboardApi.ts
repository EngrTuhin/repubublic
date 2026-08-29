import { baseApi } from "@/features/api/baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getDashboardStats: builder.query<any, Record<string, any> | void>({
      query: (params) => ({
        url: "/v1/dashboard/stats",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["DashboardStats"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;

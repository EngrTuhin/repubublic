"use client";

import { useGetDashboardStatsQuery } from "@/features/api/dashboardApi";

export function useDashboardStats(params = {}) {
  const { data: apiResponse, isLoading, isFetching, error, refetch } = useGetDashboardStatsQuery(params);

  const stats = apiResponse?.data || null;

  return {
    stats,
    filterInfo: apiResponse?.filter || null,
    loading: isLoading || isFetching,
    error,
    refetch,
  };
}

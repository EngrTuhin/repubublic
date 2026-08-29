import { baseApi } from "@/features/api/baseApi";

export const systemSettingsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getSystemSettings: builder.query<any, void>({
      query: () => ({
        url: "/v1/system-settings",
        method: "GET",
      }),
      providesTags: ["DashboardStats"],
    }),
    updateSystemSettings: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/v1/system-settings",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["DashboardStats"],
    }),
  }),
});

export const { useGetSystemSettingsQuery, useUpdateSystemSettingsMutation } = systemSettingsApi;

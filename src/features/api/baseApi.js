import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession, signOut } from "next-auth/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://127.0.0.1:8000/api",
  prepareHeaders: async (headers) => {
    const session = await getSession();
    if (session?.accessToken) {
      headers.set("Authorization", `Bearer ${session.accessToken}`);
    }
    headers.set("Accept", "application/json");
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    if (typeof window !== "undefined" && window.location.pathname !== "/" && window.location.pathname !== "/login") {
      signOut({ callbackUrl: "/" });
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["MotorUnderwriting", "PaUnderwriting", "OmpUnderwriting", "Document", "Claims", "DashboardStats"],
  endpoints: () => ({}),
});

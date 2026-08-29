import { getSession, signOut } from "next-auth/react";

/**
 * Common API client for making HTTP requests to the Laravel backend.
 */

const getBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_LARAVEL_API_URL ||
    "http://127.0.0.1:8000/api"
  );
};

/**
 * Common fetch wrapper with standard headers and base URL resolution.
 *
 * @param {string} endpoint - API endpoint (e.g., '/v1/login' or 'http...')
 * @param {RequestInit} [options] - Fetch configuration options
 * @returns {Promise<Response>}
 */
export async function apiFetch(endpoint, options = {}) {
  const baseUrl = getBaseUrl();
  const url =
    endpoint.startsWith("http://") || endpoint.startsWith("https://")
      ? endpoint
      : `${baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  let authHeaders = {};
  if (typeof window !== "undefined") {
    const session = await getSession();
    if (session?.accessToken) {
      authHeaders["Authorization"] = `Bearer ${session.accessToken}`;
    }
  }

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...authHeaders,
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (
    config.body &&
    typeof config.body === "object" &&
    !(config.body instanceof FormData)
  ) {
    config.body = JSON.stringify(config.body);
  }

  const res = await fetch(url, config);

  if (
    res.status === 401 &&
    typeof window !== "undefined" &&
    window.location.pathname !== "/" &&
    window.location.pathname !== "/login" &&
    !endpoint.includes("/login")
  ) {
    signOut({ callbackUrl: "/" });
  }

  return res;
}

export const apiClient = {
  get: (endpoint, options = {}) => apiFetch(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options = {}) =>
    apiFetch(endpoint, { ...options, method: "POST", body }),
  put: (endpoint, body, options = {}) =>
    apiFetch(endpoint, { ...options, method: "PUT", body }),
  patch: (endpoint, body, options = {}) =>
    apiFetch(endpoint, { ...options, method: "PATCH", body }),
  delete: (endpoint, options = {}) =>
    apiFetch(endpoint, { ...options, method: "DELETE" }),
};

export default apiClient;

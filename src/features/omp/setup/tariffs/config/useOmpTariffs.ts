"use client";

import { useGlobal, UseGlobalOptions } from "@/hooks/useGlobal";

/**
 * Sanitizes and transforms tariff form data before submitting to API (Create/Update).
 * Preserves exact array insertion order for rates [{ key: "G1", value: 1549 }, ...].
 */
export function transformTariffSubmitData(data: any) {
  const payload = { ...data };

  // Preserve exact insertion order by sending rates as a sanitized JSON array
  if (Array.isArray(payload.rates)) {
    payload.rates = payload.rates
      .filter((r: any) => r.key !== undefined && String(r.key).trim() !== "")
      .map((r: any) => ({
        key: String(r.key).trim(),
        value: r.value !== undefined && r.value !== null && r.value !== "" ? Number(r.value) : 0,
      }));
  } else if (payload.rates && typeof payload.rates === "object") {
    payload.rates = Object.entries(payload.rates).map(([k, v]) => ({
      key: String(k).trim(),
      value: v !== undefined && v !== null && v !== "" ? Number(v) : 0,
    }));
  }

  // Ensure boolean for is_schengen
  if (payload.is_schengen !== undefined) {
    payload.is_schengen = payload.is_schengen === true || payload.is_schengen === "true";
  }

  return payload;
}

/**
 * Prepares backend API record for the Edit Modal form.
 * Preserves exact array insertion order for repeater form rows [{ key: "G1", value: 1549 }, ...].
 */
export function transformTariffEditItem(item: any) {
  if (!item) return item;
  const transformed = { ...item };

  if (Array.isArray(transformed.rates)) {
    const sanitized = transformed.rates.map((r: any) => ({
      key: r.key !== undefined ? String(r.key) : "",
      value: r.value !== undefined ? r.value : "",
    }));
    transformed.rates = sanitized.length > 0 ? sanitized : [{ key: "", value: "" }];
  } else if (transformed.rates && typeof transformed.rates === "object") {
    const rateEntries = Object.entries(transformed.rates).map(([k, v]) => ({
      key: String(k),
      value: v,
    }));
    transformed.rates = rateEntries.length > 0 ? rateEntries : [{ key: "", value: "" }];
  }

  return transformed;
}

/**
 * Custom Hook for OMP Tariffs Setup Feature.
 * Manages form initialization, edit item data transformation, and submit payload sanitization.
 */
export function useOmpTariffs(options: UseGlobalOptions = {}) {
  const globalState = useGlobal("v1/omp-tariffs", {
    transformSubmitData: (data) => transformTariffSubmitData(data),
    ...options,
  });

  // Intercept openEditModal to transform editingItem rates object/array into repeater array rows
  const openEditModal = (item: any) => {
    const preparedItem = transformTariffEditItem(item);
    globalState.openEditModal(preparedItem);
  };

  return {
    ...globalState,
    openEditModal,
  };
}

export default useOmpTariffs;

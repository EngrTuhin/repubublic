"use client";

import { useGlobal, UseGlobalOptions } from "@/hooks/useGlobal";

/**
 * Custom Hook for OMP Claim Form Setup Feature.
 * Manages CRUD for OMP claim form content entries (title + rich text body).
 */
export function useOmpClaimForm(options: UseGlobalOptions = {}) {
  const globalState = useGlobal("v1/omp-claim-forms", {
    ...options,
  });

  return {
    ...globalState,
  };
}

export default useOmpClaimForm;

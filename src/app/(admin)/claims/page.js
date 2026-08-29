"use client";

import PageBuilder from "@/components/setup/PageBuilder";
import { useGlobal } from "@/hooks/useGlobal";
import { tableConfig } from "@/features/claims/config";

export default function ClaimsSettlementPage() {
  const state = useGlobal("v1/claims");

  return (
    <PageBuilder
      tableConfig={tableConfig}
      state={state}
    />
  );
}

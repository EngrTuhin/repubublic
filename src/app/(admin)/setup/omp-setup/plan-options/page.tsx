"use client";

import PageBuilder from "@/components/setup/PageBuilder";
import { useGlobal } from "@/hooks/useGlobal";
import { tableConfig, formFieldsConfig } from "@/features/omp/setup/plan-options/config";

export default function OmpPlanOptionsSetupPage() {
  const state = useGlobal("v1/omp-plan-options");

  return (
    <PageBuilder
      tableConfig={tableConfig}
      formFieldsConfig={formFieldsConfig}
      state={state}
    />
  );
}

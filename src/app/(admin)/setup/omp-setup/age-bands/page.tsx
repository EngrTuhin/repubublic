"use client";

import PageBuilder from "@/components/setup/PageBuilder";
import { useGlobal } from "@/hooks/useGlobal";
import { tableConfig, formFieldsConfig } from "@/features/omp/setup/age-bands/config";

export default function OmpAgeBandsSetupPage() {
  const state = useGlobal("v1/omp-age-bands");

  return (
    <PageBuilder
      tableConfig={tableConfig}
      formFieldsConfig={formFieldsConfig}
      state={state}
    />
  );
}

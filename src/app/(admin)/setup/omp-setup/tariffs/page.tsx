"use client";

import PageBuilder from "@/components/setup/PageBuilder";
import { tableConfig, formFieldsConfig, useOmpTariffs } from "@/features/omp/setup/tariffs/config";

export default function OmpTariffsSetupPage() {
  const state = useOmpTariffs();

  return (
    <PageBuilder
      tableConfig={tableConfig}
      formFieldsConfig={formFieldsConfig}
      state={state}
    />
  );
}

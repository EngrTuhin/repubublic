"use client";

import PageBuilder from "@/components/setup/PageBuilder";
import { tableConfig, formFieldsConfig, useOmpClaimForm } from "@/features/omp/setup/claim-form/config";

export default function OmpClaimFormSetupPage() {
  const state = useOmpClaimForm();

  return (
    <PageBuilder
      tableConfig={tableConfig}
      formFieldsConfig={formFieldsConfig}
      state={state}
    />
  );
}

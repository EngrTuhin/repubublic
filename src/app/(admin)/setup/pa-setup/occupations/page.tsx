"use client";

import PageBuilder from "@/components/setup/PageBuilder";
import { useGlobal } from "@/hooks/useGlobal";
import { tableConfig, formFieldsConfig } from "@/features/personal-accident/setup/occupations/config";

export default function PaOccupationsSetupPage() {
  const state = useGlobal("v1/pa-occupations");

  return (
    <PageBuilder
      tableConfig={tableConfig}
      formFieldsConfig={formFieldsConfig}
      state={state}
    />
  );
}

"use client";

import PageBuilder from "@/components/setup/PageBuilder";
import { useGlobal } from "@/hooks/useGlobal";
import { tableConfig, formConfig } from "@/features/motor-vehicle/setup/tariffs/config";

export default function UwTarrifsSetupPage() {
  const state = useGlobal("v1/uw-tarrifs");

  return (
    <PageBuilder
      tableConfig={tableConfig}
      formConfig={formConfig}
      state={state}
    />
  );
}

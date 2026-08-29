"use client";

import PageBuilder from "@/components/setup/PageBuilder";
import { useGlobal } from "@/hooks/useGlobal";
import { tableConfig, formFieldsConfig } from "@/features/motor-vehicle/setup/tariff-types/config";

export default function MotorTariffTypesSetupPage() {
  const state = useGlobal("v1/motor-tariff-types");

  return (
    <PageBuilder
      tableConfig={tableConfig}
      formFieldsConfig={formFieldsConfig}
      state={state}
    />
  );
}

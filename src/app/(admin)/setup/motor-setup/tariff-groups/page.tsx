"use client";

import PageBuilder from "@/components/setup/PageBuilder";
import { useGlobal } from "@/hooks/useGlobal";
import { tableConfig, formFieldsConfig } from "@/features/motor-vehicle/setup/tariff-groups/config";

export default function MotorTariffGroupsSetupPage() {
  const state = useGlobal("v1/motor-tariff-groups");

  return (
    <PageBuilder
      tableConfig={tableConfig}
      formFieldsConfig={formFieldsConfig}
      state={state}
    />
  );
}

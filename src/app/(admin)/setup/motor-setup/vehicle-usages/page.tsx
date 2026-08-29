"use client";

import PageBuilder from "@/components/setup/PageBuilder";
import { useGlobal } from "@/hooks/useGlobal";
import { tableConfig, formFieldsConfig } from "@/features/motor-vehicle/setup/vehicle-usages/config";

export default function MotorVehicleUsagesSetupPage() {
  const state = useGlobal("v1/motor-vehicle-usages");

  return (
    <PageBuilder
      tableConfig={tableConfig}
      formFieldsConfig={formFieldsConfig}
      state={state}
    />
  );
}

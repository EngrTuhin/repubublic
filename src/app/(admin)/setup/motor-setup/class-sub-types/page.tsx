"use client";

import PageBuilder from "@/components/setup/PageBuilder";
import { useGlobal } from "@/hooks/useGlobal";
import { tableConfig, formFieldsConfig } from "@/features/motor-vehicle/setup/class-sub-types/config";

export default function MotorClassSubTypesSetupPage() {
  const state = useGlobal("v1/motor-class-sub-types");

  return (
    <PageBuilder
      tableConfig={tableConfig}
      formFieldsConfig={formFieldsConfig}
      state={state}
    />
  );
}

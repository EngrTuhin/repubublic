"use client";

import PageBuilder from "@/components/setup/PageBuilder";
import { useGlobal } from "@/hooks/useGlobal";
import {
  tableConfig,
  formFieldsConfig,
} from "@/features/motor-vehicle/setup/comprehensive-liability-configs/config";

export default function MotorComprehensiveLiabilityConfigsSetupPage() {
  const state = useGlobal("v1/comprehensive-liability-configs");

  return (
    <PageBuilder
      tableConfig={tableConfig}
      formFieldsConfig={formFieldsConfig}
      state={state}
    />
  );
}

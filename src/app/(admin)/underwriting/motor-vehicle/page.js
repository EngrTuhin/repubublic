"use client";

import PageBuilder from "@/components/setup/PageBuilder";
import { useGlobal } from "@/hooks/useGlobal";
import { tableConfig } from "@/features/motor-vehicle/config";

export default function MotorUnderwritingPage() {
  const state = useGlobal("v1/motorinsurances");

  return (
    <PageBuilder
      tableConfig={tableConfig}

      state={state}
    />
  );
}

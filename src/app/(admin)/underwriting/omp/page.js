"use client";

import PageBuilder from "@/components/setup/PageBuilder";
import { useGlobal } from "@/hooks/useGlobal";
import { tableConfig } from "@/features/omp/config";

export default function OmpUnderwritingPage() {
  const state = useGlobal("v1/omps");

  return (
    <PageBuilder
      tableConfig={tableConfig}
      state={state}
    />
  );
}

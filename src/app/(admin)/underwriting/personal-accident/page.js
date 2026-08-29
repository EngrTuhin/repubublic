"use client";

import PageBuilder from "@/components/setup/PageBuilder";
import { useGlobal } from "@/hooks/useGlobal";
import { tableConfig } from "@/features/personal-accident/config";

export default function PersonalAccidentUnderwritingPage() {
  const state = useGlobal("v1/pas");

  return (
    <PageBuilder
      tableConfig={tableConfig}
      state={state}
    />
  );
}

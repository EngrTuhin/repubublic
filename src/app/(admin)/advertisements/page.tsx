"use client";

import PageBuilder from "@/components/setup/PageBuilder";
import { useGlobal } from "@/hooks/useGlobal";
import { tableConfig, formConfig, formFieldsConfig } from "@/features/advertisements/config";

export default function AdvertisementsPage() {
  const state = useGlobal("v1/advertisements");

  return (
    <PageBuilder
      tableConfig={tableConfig}
      formConfig={formConfig}
      formFieldsConfig={formFieldsConfig}
      state={state}
    />
  );
}
